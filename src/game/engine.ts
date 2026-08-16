import { getCard } from '../data/catalog';
import { getEffectScript } from '../data/effects';
import { createDeck, DEFAULT_DECK_ID, getOpponentDeckId } from './deck';
import { appendGameLog, cardLogSubject, playerLogSubject, rulesLogSubject } from './gameLog';
import {
  canActivate, dispatchGameEvent, expireModifiers, hasModifier, modifierTotal, payCardCost,
  paymentForCost, resolveEffectChoice, startActivatedEffects, startAttackEffects, startEffects,
  startUtilityScript, utilityConditionError,
} from './effectRuntime';
import type { AttackScript, EffectOperation } from './effectTypes';
import type {
  AttackDefinition, BoardAddress, CardInstance, CostType, EnergyInPlay, GameResult,
  GameState, PlayerId, PlayerState, RowName, UnitInPlay,
} from './types';
import { secureRandom } from './random';

const emptyRow = () => Array<UnitInPlay | null>(5).fill(null);
const otherPlayer = (player: PlayerId): PlayerId => player === 0 ? 1 : 0;
const cloneState = (state: GameState): GameState => structuredClone(state);
const OPENING_HAND_SIZE = 7;
const MULLIGAN_LIMIT = 3;

function createPlayer(playerId: PlayerId, name: string, seed: number, deckId: string): PlayerState {
  const deck = createDeck(seed, deckId).map((card) => ({ ...card, owner: playerId }));
  return {
    name,
    hp: 250,
    deck: deck.slice(OPENING_HAND_SIZE),
    hand: deck.slice(0, OPENING_HAND_SIZE),
    vanguard: emptyRow(),
    backguard: emptyRow(),
    utilities: [],
    energies: [],
    vanquished: [],
    hasPlayedEnergy: false,
    energyPlaysThisTurn: 0,
    hasTakenFirstTurn: false,
    turnCount: 0,
  };
}

export interface GameOptions {
  playerDeckId?: string;
  opponentDeckId?: string;
}

export function createGame(options: GameOptions = {}): GameState {
  const playerDeckId = options.playerDeckId ?? DEFAULT_DECK_ID;
  const opponentDeckId = options.opponentDeckId ?? getOpponentDeckId(playerDeckId);
  const playerSeed = secureRandom.integer?.(0x1_0000_0000) ?? Math.floor(secureRandom() * 0x1_0000_0000);
  const opponentSeed = secureRandom.integer?.(0x1_0000_0000) ?? Math.floor(secureRandom() * 0x1_0000_0000);
  const players: [PlayerState, PlayerState] = [
    createPlayer(0, 'You', playerSeed, playerDeckId),
    createPlayer(1, 'Rift Automaton', opponentSeed, opponentDeckId),
  ];
  players[0].turnCount = 1;
  return {
    players,
    activePlayer: 0,
    round: 1,
    log: [{
      sequence: 1,
      kind: 'system',
      message: 'Opening hands drawn. You may mulligan up to three cards before your first turn.',
      source: rulesLogSubject('Match setup'),
      target: { kind: 'player', name: players[0].name, playerId: 0 },
      action: 'Opening mulligan',
    }],
    logSequence: 1,
    lastRoll: null,
    winner: null,
    isOpponentActing: false,
    actionSequence: 0,
    rollSequence: 0,
    usedActions: {},
    modifiers: [],
    pendingChoice: null,
    pendingMulligan: { player: 0, maxCards: MULLIGAN_LIMIT },
    pendingTurn: null,
    turnEvents: [],
  };
}

function removeFromHand(player: PlayerState, instanceId: string): CardInstance | null {
  const index = player.hand.findIndex((card) => card.instanceId === instanceId);
  if (index < 0) return null;
  return player.hand.splice(index, 1)[0];
}

export function energyPayment(cost: readonly CostType[], energies: EnergyInPlay[]): string[] | null {
  const available = energies.filter(({ isTapped }) => !isTapped);
  const selected: EnergyInPlay[] = [];
  for (const required of cost.filter((energy) => energy !== 'any')) {
    const match = available.find((energy) => energy.energyType === required && !selected.includes(energy));
    if (!match) return null;
    selected.push(match);
  }
  for (const _ of cost.filter((energy) => energy === 'any')) {
    const match = available.find((energy) => !selected.includes(energy));
    if (!match) return null;
    selected.push(match);
  }
  return selected.map(({ instanceId }) => instanceId);
}

function payAttackCost(state: GameState, player: PlayerId, cost: readonly CostType[]): boolean {
  const payment = paymentForCost(state, player, cost);
  if (!payment) return false;
  state.players[player].energies.forEach((energy) => {
    if (payment.includes(energy.instanceId)) energy.isTapped = true;
  });
  return true;
}

function actionBlocked(state: GameState): string | null {
  if (state.pendingMulligan) return 'Complete the opening mulligan first.';
  if (state.pendingChoice) return 'Resolve the pending choice first.';
  return null;
}

function shuffleCards(cards: CardInstance[], random: () => number): void {
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [cards[index], cards[target]] = [cards[target], cards[index]];
  }
}

export function mulliganOpeningHand(
  state: GameState,
  selectedIds: readonly string[],
  random: () => number = secureRandom,
): GameResult {
  const pending = state.pendingMulligan;
  if (!pending) return { state, error: 'The opening mulligan is already complete.' };
  if (selectedIds.length > pending.maxCards) {
    return { state, error: `You may mulligan up to ${pending.maxCards} cards.` };
  }
  const uniqueIds = new Set(selectedIds);
  if (uniqueIds.size !== selectedIds.length) return { state, error: 'Choose each mulligan card only once.' };
  const player = state.players[pending.player];
  if (selectedIds.some((instanceId) => !player.hand.some((card) => card.instanceId === instanceId))) {
    return { state, error: 'Every mulligan card must be in your opening hand.' };
  }

  const next = cloneState(state);
  const nextPlayer = next.players[pending.player];
  const returnedCards = nextPlayer.hand.filter((card) => uniqueIds.has(card.instanceId));
  nextPlayer.hand = nextPlayer.hand.filter((card) => !uniqueIds.has(card.instanceId));
  nextPlayer.deck.push(...returnedCards);
  shuffleCards(nextPlayer.deck, random);
  nextPlayer.hand.push(...nextPlayer.deck.splice(0, returnedCards.length));
  next.pendingMulligan = null;
  appendGameLog(next, {
    kind: 'system',
    message: returnedCards.length === 0
      ? `${nextPlayer.name} kept all seven opening cards.`
      : `${nextPlayer.name} mulliganed ${returnedCards.length} card${returnedCards.length === 1 ? '' : 's'} and drew the same number.`,
    source: rulesLogSubject('Mulligan rule'),
    target: playerLogSubject(next, pending.player),
    action: returnedCards.length === 0 ? 'Opening hand kept' : 'Opening hand redrawn',
  });
  return { state: next };
}

export function playEnergy(state: GameState, playerId: PlayerId, instanceId: string): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.activePlayer !== playerId || state.winner !== null) return { state, error: 'It is not your turn.' };
  const next = cloneState(state);
  const player = next.players[playerId];
  const allowed = 1 + modifierTotal(next, null, playerId, 'extra-energy-play');
  if (player.energyPlaysThisTurn >= allowed) return { state, error: 'You have used every Energy play available this turn.' };
  const held = player.hand.find((item) => item.instanceId === instanceId);
  if (!held || getCard(held.cardId).kind !== 'energy') return { state, error: 'That card is not an Energy.' };
  const removed = removeFromHand(player, instanceId)!;
  const definition = getCard(removed.cardId);
  player.energies.push({ ...removed, owner: removed.owner ?? playerId, energyType: definition.energyType!, isTapped: false });
  player.energyPlaysThisTurn += 1;
  player.hasPlayedEnergy = player.energyPlaysThisTurn > 0;
  return { state: appendGameLog(next, {
    kind: 'play',
    message: player.name + ' played ' + definition.name + '.',
    source: cardLogSubject(removed, playerId),
    target: playerLogSubject(next, playerId),
    action: 'Played Energy',
  }) };
}

export function playUnit(state: GameState, address: BoardAddress, instanceId: string): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.activePlayer !== address.player || state.winner !== null) return { state, error: 'It is not your turn.' };
  const next = cloneState(state);
  const player = next.players[address.player];
  if (player[address.row][address.index]) return { state, error: 'That position is occupied.' };
  if (address.row === 'backguard' && hasModifier(next, null, address.player, 'cannot-play-backguard')) {
    return { state, error: 'Units cannot be played to your Backguard right now.' };
  }
  const held = player.hand.find((item) => item.instanceId === instanceId);
  if (!held) return { state, error: 'That card is no longer in your hand.' };
  const card = getCard(held.cardId);
  if (card.kind !== 'unit') return { state, error: 'Only Units can enter a Unit position.' };
  if (card.unitTreatment === 'super' && [...player.vanguard, ...player.backguard].some((unit) => unit && getCard(unit.cardId).unitTreatment === 'super')) {
    return { state, error: 'You can control only one SUPER Unit.' };
  }
  if (!payCardCost(next, address.player, card.id, 'play')) return { state, error: 'You do not have the required Ready Energy.' };
  const removed = removeFromHand(player, instanceId)!;
  player[address.row][address.index] = {
    ...removed,
    owner: removed.owner ?? address.player,
    currentHp: card.hp,
    isReady: true,
    enteredTurn: player.turnCount,
    conditions: [],
  };
  appendGameLog(next, {
    kind: 'play',
    message: player.name + ' played ' + card.name + ' to the ' + address.row + '.',
    source: cardLogSubject(removed, address.player),
    target: playerLogSubject(next, address.player),
    action: 'Entered ' + (address.row === 'vanguard' ? 'Vanguard' : 'Backguard'),
  });
  dispatchGameEvent(next, { name: 'played', sourceId: removed.instanceId, targetId: removed.instanceId, controller: address.player });
  return { state: next };
}

export function playUtility(state: GameState, playerId: PlayerId, instanceId: string): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.winner !== null) return { state, error: 'The match is over.' };
  const held = state.players[playerId].hand.find((item) => item.instanceId === instanceId);
  if (!held) return { state, error: 'That card is no longer in your hand.' };
  const card = getCard(held.cardId);
  if (card.kind !== 'utility') return { state, error: 'That card is not a Utility.' };
  if (state.activePlayer !== playerId && card.utilityType !== 'free') return { state, error: 'Only Free Effects can be played during the opposing turn.' };
  const conditionError = utilityConditionError(state, playerId, instanceId);
  if (conditionError) return { state, error: conditionError };
  const next = cloneState(state);
  if (!payCardCost(next, playerId, card.id, 'utility')) return { state, error: 'You do not have the required Ready Energy.' };
  const removed = removeFromHand(next.players[playerId], instanceId)!;
  if (card.utilityType === 'continuous' || card.utilityType === 'equipment') next.players[playerId].utilities.push(removed);
  else next.players[playerId].vanquished.push(removed);
  appendGameLog(next, {
    kind: 'play',
    message: next.players[playerId].name + ' played ' + card.name + '.',
    source: cardLogSubject(removed, playerId),
    target: playerLogSubject(next, playerId),
    action: card.utilityType === 'equipment' ? 'Played Equipment' : 'Played Utility',
  });
  startUtilityScript(next, playerId, instanceId);
  return { state: next };
}

export function rotateUnit(state: GameState, address: BoardAddress): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.activePlayer !== address.player || state.winner !== null) return { state, error: 'It is not your turn.' };
  const next = cloneState(state);
  const player = next.players[address.player];
  const unit = player[address.row][address.index];
  if (!unit?.isReady) return { state, error: 'Only a Ready Unit can Rotate.' };
  if (unit.conditions.some(({ name }) => name === 'paralyzed')) return { state, error: 'A Paralyzed Unit cannot Rotate.' };
  if (hasModifier(next, unit.instanceId, null, 'cannot-rotate')
    && !hasModifier(next, unit.instanceId, null, 'ignore-rotation-prevention')) return { state, error: 'That Unit cannot Rotate right now.' };
  const destination: RowName = address.row === 'vanguard' ? 'backguard' : 'vanguard';
  const openIndex = player[destination].findIndex((slot) => slot === null);
  if (openIndex < 0) return { state, error: 'The ' + destination + ' is full.' };
  player[address.row][address.index] = null;
  unit.isReady = false;
  player[destination][openIndex] = unit;
  appendGameLog(next, {
    kind: 'movement',
    message: getCard(unit.cardId).name + ' Rotated to the ' + destination + ' and became Exhausted.',
    source: cardLogSubject(unit, address.player),
    target: cardLogSubject(unit, address.player),
    action: 'Rotate → ' + (destination === 'vanguard' ? 'Vanguard' : 'Backguard'),
  });
  dispatchGameEvent(next, { name: 'unit-rotated', sourceId: unit.instanceId, targetId: unit.instanceId, controller: address.player });
  return { state: next };
}

export interface AvailableAttack {
  attack: AttackDefinition;
  script: AttackScript;
  providerCardId: string;
}

export function availableAttacks(state: GameState, unitInstanceId: string): AvailableAttack[] {
  const owner = ([0, 1] as const).find((player) =>
    [...state.players[player].vanguard, ...state.players[player].backguard].some((unit) => unit?.instanceId === unitInstanceId));
  if (owner === undefined) return [];
  const unit = [...state.players[owner].vanguard, ...state.players[owner].backguard].find((item) => item?.instanceId === unitInstanceId)!;
  const definition = getCard(unit.cardId);
  const own = definition.attacks.map((attack) => ({
    attack,
    script: getEffectScript(definition.id).attacks!.find(({ id }) => id === attack.id)!,
    providerCardId: definition.id,
  }));
  const equipment = state.players[owner].utilities.flatMap((utility) => {
    if (utility.attachedTo !== unitInstanceId) return [];
    const equipmentCard = getCard(utility.cardId);
    const attack = equipmentCard.utilityAttack;
    if (!attack?.name) return [];
    return [{
      attack,
      script: getEffectScript(equipmentCard.id).attacks!.find(({ id }) => id === attack.id)!,
      providerCardId: equipmentCard.id,
    }];
  });
  return [...own, ...equipment];
}

function isDamagingAttack(attack: AttackDefinition) {
  return /^\d/.test(attack.damage);
}

export function useAttack(
  state: GameState,
  source: BoardAddress,
  attackIndex: number,
  target: BoardAddress | null,
  random: () => number = secureRandom,
): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.activePlayer !== source.player || state.winner !== null) return { state, error: 'It is not your turn.' };
  if (!state.players[source.player].hasTakenFirstTurn) return { state, error: 'You cannot attack on your first turn.' };
  const attacker = state.players[source.player][source.row][source.index];
  if (!attacker?.isReady) return { state, error: 'Choose a Ready Unit.' };
  if (attacker.conditions.some(({ name }) => name === 'paralyzed' || name === 'cowering')) return { state, error: 'That Condition prevents this Unit from attacking.' };
  if (hasModifier(state, attacker.instanceId, null, 'cannot-attack')) return { state, error: 'That Unit cannot attack right now.' };
  const option = availableAttacks(state, attacker.instanceId)[attackIndex];
  if (!option) return { state, error: 'That attack does not exist.' };
  const { attack, script } = option;
  if (source.row === 'backguard' && attack.damage !== 'BG') return { state, error: 'Only BG attacks may be used from the Backguard.' };
  const defenderId = otherPlayer(source.player);
  const defendingUnits = [...state.players[defenderId].vanguard, ...state.players[defenderId].backguard].filter(Boolean);
  if (isDamagingAttack(attack)) {
    if (!target && defendingUnits.length) return { state, error: 'Choose an opposing Vanguard Unit.' };
    if (target && (target.player !== defenderId || target.row !== 'vanguard')) return { state, error: 'Damaging attacks target the opposing Vanguard.' };
    if (target && !state.players[target.player][target.row][target.index]) return { state, error: 'That target is no longer present.' };
  }
  const next = cloneState(state);
  if (!payAttackCost(next, source.player, attack.cost)) return { state, error: 'You do not have the required Ready Energy.' };
  const nextAttacker = next.players[source.player][source.row][source.index]!;
  nextAttacker.isReady = false;
  const targetId = target ? next.players[target.player][target.row][target.index]?.instanceId ?? null : null;
  const attackTarget = targetId
    ? cardLogSubject(next.players[target!.player][target!.row][target!.index]!, target!.player)
    : playerLogSubject(next, defenderId);
  appendGameLog(next, {
    kind: 'attack',
    message: getCard(nextAttacker.cardId).name + ' used ' + attack.name + '.',
    source: cardLogSubject(nextAttacker, source.player),
    target: attackTarget,
    action: attack.name,
  });
  startAttackEffects(next, source.player, nextAttacker.instanceId, targetId, defenderId, attack, script, random);
  return { state: next };
}

export function availableActivatedAbilities(state: GameState, player: PlayerId) {
  const sources = [
    ...state.players[player].vanguard,
    ...state.players[player].backguard,
    ...state.players[player].utilities,
  ].filter((source): source is NonNullable<typeof source> => Boolean(source));
  return sources.flatMap((source) =>
    (getEffectScript(source.cardId).activated ?? [])
      .filter(({ timing, id }) => timing === 'action' && canActivate(state, player, source.instanceId, id))
      .map((ability) => ({ sourceInstanceId: source.instanceId, cardId: source.cardId, abilityId: ability.id, name: ability.name })),
  );
}

export function activateAbility(state: GameState, player: PlayerId, sourceInstanceId: string, abilityId: string): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.activePlayer !== player || state.winner !== null) return { state, error: 'It is not your turn.' };
  const next = cloneState(state);
  const source = [...next.players[player].vanguard, ...next.players[player].backguard, ...next.players[player].utilities]
    .find((card) => card?.instanceId === sourceInstanceId);
  const ability = source ? getEffectScript(source.cardId).activated?.find(({ id }) => id === abilityId) : undefined;
  if (source && ability && canActivate(next, player, sourceInstanceId, abilityId)) appendGameLog(next, {
    kind: 'ability',
    message: getCard(source.cardId).name + ' activated ' + ability.name + '.',
    source: cardLogSubject(source, player),
    target: cardLogSubject(source, player),
    action: ability.name,
  });
  return startActivatedEffects(next, player, sourceInstanceId, abilityId);
}

export function chooseEffect(
  state: GameState,
  selectedIds: readonly string[],
  random: () => number = secureRandom,
): GameResult {
  const next = cloneState(state);
  const resolved = resolveEffectChoice(next, selectedIds, random);
  if (!resolved.error && !resolved.state.pendingChoice && resolved.state.pendingTurn !== null) completePendingTurn(resolved.state, random);
  return resolved;
}

function readyPlayer(state: GameState, playerId: PlayerId) {
  const player = state.players[playerId];
  player.hasPlayedEnergy = false;
  player.energyPlaysThisTurn = 0;
  player.energies.forEach((energy) => {
    if (!hasModifier(state, energy.instanceId, null, 'cannot-ready')) energy.isTapped = false;
  });
  [...player.vanguard, ...player.backguard].forEach((unit) => {
    if (unit && !hasModifier(state, unit.instanceId, null, 'cannot-ready')) unit.isReady = true;
  });
}

function drawTurnCard(state: GameState, playerId: PlayerId) {
  const card = state.players[playerId].deck.shift();
  if (!card) {
    state.winner = otherPlayer(playerId);
    appendGameLog(state, {
      kind: 'victory',
      message: state.players[playerId].name + ' decked out.',
      source: rulesLogSubject('Deck-out rule'),
      target: playerLogSubject(state, playerId),
      action: 'Deck depleted',
    });
  } else {
    state.players[playerId].hand.push(card);
  }
}

function processTurnEnd(state: GameState, playerId: PlayerId, random: () => number) {
  const player = state.players[playerId];
  for (const unit of [...player.vanguard, ...player.backguard]) {
    if (!unit) continue;
    const cowering = unit.conditions.findIndex(({ name }) => name === 'cowering');
    if (cowering >= 0 && random() < 0.5) unit.conditions.splice(cowering, 1);
    const paralyzed = unit.conditions.find(({ name }) => name === 'paralyzed');
    if (paralyzed) {
      paralyzed.controllerTurns += 1;
      if (paralyzed.controllerTurns >= 2) unit.conditions = unit.conditions.filter(({ name }) => name !== 'paralyzed');
    }
  }
  const cursedEffects: EffectOperation[] = [{
    op: 'for-each',
    selector: { zone: ['vanguard', 'backguard'], controller: 'actor', kind: 'unit', hasCondition: 'cursed' },
    store: 'cursed-unit',
    effects: [
      { op: 'choose', selector: { zone: ['vanguard', 'backguard'], controller: 'actor', kind: 'unit', exclude: 'cursed-unit' }, store: 'curse-target', min: 0, max: 1, prompt: 'Cursed: choose another Unit to take 20 Damage.' },
      { op: 'damage', target: 'curse-target', amount: 20, damageType: 'condition' },
    ],
  }];
  startEffects(state, playerId, 'rules', cursedEffects, { name: 'turn-end', controller: playerId }, random);
  expireModifiers(state, playerId, 'end');
}

function beginTurn(state: GameState, playerId: PlayerId, random: () => number) {
  state.activePlayer = playerId;
  state.turnEvents = [];
  const player = state.players[playerId];
  player.turnCount += 1;
  readyPlayer(state, playerId);
  expireModifiers(state, playerId, 'start');
  if (player.hasTakenFirstTurn) drawTurnCard(state, playerId);
  const conditionEffects: EffectOperation[] = [
    {
      op: 'for-each',
      selector: { zone: ['vanguard', 'backguard'], controller: 'actor', kind: 'unit', hasCondition: 'infected' },
      store: 'infected-unit',
      effects: [{ op: 'damage', target: 'infected-unit', amount: { value: 'condition-amount' }, damageType: 'condition' }],
    },
    {
      op: 'for-each',
      selector: { zone: ['vanguard', 'backguard'], controller: 'actor', kind: 'unit', hasCondition: 'doomed' },
      store: 'doomed-unit',
      effects: [{ op: 'vanquish', target: 'doomed-unit' }],
    },
  ];
  startEffects(state, playerId, 'rules', conditionEffects, { name: 'turn-start', controller: playerId }, random);
}

function completePendingTurn(state: GameState, random: () => number) {
  const player = state.pendingTurn;
  if (player === null) return;
  state.pendingTurn = null;
  if (player === 0) state.round += 1;
  beginTurn(state, player, random);
  state.isOpponentActing = player === 1;
  appendGameLog(state, {
    kind: 'turn',
    message: player === 0
      ? 'Round ' + state.round + '. Your Energy and Units are Ready.'
      : 'Opponent turn. The Rift Automaton is evaluating the board…',
    source: rulesLogSubject('Turn sequence'),
    target: playerLogSubject(state, player),
    action: player === 0 ? 'Your turn' : 'Opponent turn',
  });
}

function affordable(player: PlayerState, kind: 'unit' | 'utility') {
  return player.hand.find((held) => {
    const card = getCard(held.cardId);
    return card.kind === kind && energyPayment(card.cost, player.energies) !== null;
  });
}

export function runOpponentTurn(state: GameState, random: () => number = secureRandom): GameState {
  if (state.pendingMulligan || state.pendingChoice || state.winner !== null || state.activePlayer !== 1) return state;
  let next = cloneState(state);
  const opponent = next.players[1];
  const energy = opponent.hand.find((held) => getCard(held.cardId).kind === 'energy');
  if (energy && opponent.energyPlaysThisTurn < 1 + modifierTotal(next, null, 1, 'extra-energy-play')) {
    next = playEnergy(next, 1, energy.instanceId).state;
  }
  if (next.pendingChoice) return next;
  const unit = affordable(next.players[1], 'unit');
  if (unit) {
    const row: RowName = next.players[1].vanguard.some((slot) => slot === null) ? 'vanguard' : 'backguard';
    const index = next.players[1][row].findIndex((slot) => slot === null);
    if (index >= 0) next = playUnit(next, { player: 1, row, index }, unit.instanceId).state;
  }
  if (next.pendingChoice) return next;
  const utility = affordable(next.players[1], 'utility');
  if (utility) {
    const result = playUtility(next, 1, utility.instanceId);
    if (!result.error) next = result.state;
  }
  if (next.pendingChoice) return next;
  if (opponent.hasTakenFirstTurn) {
    for (let index = 0; index < 5; index += 1) {
      const attacker = next.players[1].vanguard[index];
      if (!attacker?.isReady) continue;
      const attackIndex = availableAttacks(next, attacker.instanceId).findIndex(({ attack }) =>
        isDamagingAttack(attack) && energyPayment(attack.cost, next.players[1].energies) !== null);
      if (attackIndex < 0) continue;
      const targetIndex = next.players[0].vanguard.findIndex(Boolean);
      const target = targetIndex >= 0 ? { player: 0 as const, row: 'vanguard' as const, index: targetIndex } : null;
      next = useAttack(next, { player: 1, row: 'vanguard', index }, attackIndex, target, random).state;
      if (next.pendingChoice || next.winner !== null) return next;
    }
  }
  processTurnEnd(next, 1, random);
  next.players[1].hasTakenFirstTurn = true;
  if (next.winner === null) {
    next.pendingTurn = 0;
    if (!next.pendingChoice) completePendingTurn(next, random);
  }
  if (!next.pendingChoice) next.isOpponentActing = false;
  return next;
}

export function endPlayerTurn(state: GameState, random: () => number = secureRandom): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.activePlayer !== 0 || state.winner !== null) return { state, error: 'You cannot end the turn now.' };
  const next = cloneState(state);
  processTurnEnd(next, 0, random);
  next.players[0].hasTakenFirstTurn = true;
  if (next.winner === null) {
    next.pendingTurn = 1;
    if (!next.pendingChoice) completePendingTurn(next, random);
  }
  return { state: next };
}
