import { hasModifier } from '../effectRuntime';
import type { CardInstance, GameState, PlayerId } from '../types';
import type { DeckListEntry } from './types';

const otherPlayer = (player: PlayerId): PlayerId => player === 0 ? 1 : 0;

function shuffle<T>(items: T[], random: () => number): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [items[index], items[target]] = [items[target], items[index]];
  }
  return items;
}

function cardsInState(state: GameState): Array<{ card: CardInstance; controller: PlayerId }> {
  return state.players.flatMap((player, controller) => [
    ...player.deck.map((card) => ({ card, controller: controller as PlayerId })),
    ...player.hand.map((card) => ({ card, controller: controller as PlayerId })),
    ...player.vanguard.flatMap((card) => card ? [{ card, controller: controller as PlayerId }] : []),
    ...player.backguard.flatMap((card) => card ? [{ card, controller: controller as PlayerId }] : []),
    ...player.utilities.map((card) => ({ card, controller: controller as PlayerId })),
    ...player.energies.map((card) => ({ card, controller: controller as PlayerId })),
    ...player.vanquished.map((card) => ({ card, controller: controller as PlayerId })),
  ]);
}

function hiddenCardIds(state: GameState, viewer: PlayerId, subject: PlayerId): Set<string> {
  const player = state.players[subject];
  const remembered = new Set(state.modifiers.flatMap(({ targetIds }) => targetIds));
  state.pendingChoice?.options.forEach(({ id }) => remembered.add(id));
  const handIsRevealed = hasModifier(state, null, subject, 'reveal-hand');
  const topDeckIsRevealed = hasModifier(state, null, subject, 'reveal-top-deck');
  const hidden = new Set<string>();
  if (viewer !== subject && !handIsRevealed) {
    player.hand.forEach(({ instanceId }) => {
      if (!remembered.has(instanceId)) hidden.add(instanceId);
    });
  }
  player.deck.forEach(({ instanceId }, index) => {
    if ((!topDeckIsRevealed || index > 0) && !remembered.has(instanceId)) hidden.add(instanceId);
  });
  if (viewer !== subject) {
    player.vanquished.forEach(({ instanceId, isFaceDown }) => {
      if (isFaceDown && !remembered.has(instanceId)) hidden.add(instanceId);
    });
  }
  return hidden;
}

function remainingDeckPool(
  state: GameState,
  subject: PlayerId,
  entries: readonly DeckListEntry[],
  hidden: ReadonlySet<string>,
): string[] {
  const remaining = new Map(entries.map(([cardId, count]) => [cardId, count]));
  for (const { card, controller } of cardsInState(state)) {
    const owner = card.owner ?? controller;
    if (owner !== subject || hidden.has(card.instanceId)) continue;
    remaining.set(card.cardId, Math.max(0, (remaining.get(card.cardId) ?? 0) - 1));
  }
  return [...remaining].flatMap(([cardId, count]) => Array.from({ length: count }, () => cardId));
}

export function sampleKnownDeckState(
  state: GameState,
  viewer: PlayerId,
  knownOpponentDeck: readonly DeckListEntry[],
  knownViewerDeck: readonly DeckListEntry[],
  random: () => number,
): GameState {
  const sampled = structuredClone(state);
  for (const [subject, knownDeck] of [
    [otherPlayer(viewer), knownOpponentDeck],
    [viewer, knownViewerDeck],
  ] as const) {
    const hidden = hiddenCardIds(sampled, viewer, subject);
    if (!hidden.size) continue;
    const fallbackPool = knownDeck.flatMap(([cardId, count]) => Array.from({ length: count }, () => cardId));
    const pool = shuffle(remainingDeckPool(sampled, subject, knownDeck, hidden), random);
    while (pool.length < hidden.size) {
      if (!fallbackPool.length) throw new Error('Cannot sample a hidden state from an empty known deck list.');
      pool.push(fallbackPool[Math.floor(random() * fallbackPool.length)]);
    }
    let sampleIndex = 0;
    const replace = (card: CardInstance): CardInstance => {
      if (!hidden.has(card.instanceId)) return card;
      const cardId = pool[sampleIndex];
      const instanceId = `belief-${subject}-${sampleIndex}`;
      sampleIndex += 1;
      return { instanceId, cardId, owner: card.owner ?? subject, isFaceDown: card.isFaceDown };
    };
    sampled.players[subject].hand = sampled.players[subject].hand.map(replace);
    sampled.players[subject].deck = sampled.players[subject].deck.map(replace);
    sampled.players[subject].vanquished = sampled.players[subject].vanquished.map(replace);
  }
  return sampled;
}
