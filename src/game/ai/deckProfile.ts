import { getCard } from '../../data/catalog';
import { getEffectScript } from '../../data/effects';
import type { EffectOperation } from '../effectTypes';
import { ENERGY_TYPES, type EnergyType } from '../types';
import type { DeckCapabilityCounts, DeckListEntry, DeckProfile } from './types';

const emptyCapabilities = (): DeckCapabilityCounts => ({
  cardAdvantage: 0,
  control: 0,
  damage: 0,
  economy: 0,
  protection: 0,
  reactions: 0,
  recursion: 0,
  selection: 0,
  variance: 0,
});

function addOperationCapability(capabilities: DeckCapabilityCounts, operation: EffectOperation): void {
  if (operation.op === 'draw') capabilities.cardAdvantage += 1;
  if (operation.op === 'choose' || operation.op === 'choose-slots') capabilities.selection += 1;
  if (operation.op === 'damage' || operation.op === 'vanquish') capabilities.damage += 1;
  if (operation.op === 'condition' || operation.op === 'exhaust' || operation.op === 'rotate') capabilities.control += 1;
  if (operation.op === 'heal' || operation.op === 'prevent-vanquish' || operation.op === 'remove-conditions') capabilities.protection += 1;
  if (operation.op === 'roll') capabilities.variance += 1;
  if (operation.op === 'add-completion') capabilities.economy += 1;
  if (operation.op === 'move') {
    const sourceZones = typeof operation.cards === 'object' && 'zone' in operation.cards
      ? Array.isArray(operation.cards.zone) ? operation.cards.zone : [operation.cards.zone]
      : [];
    if (operation.to === 'hand-owner' && sourceZones.includes('vanquished')) capabilities.recursion += 1;
    if (operation.to === 'hand-owner' && sourceZones.includes('deck')) capabilities.cardAdvantage += 1;
    if (operation.to === 'energies' || operation.to === 'top-deck') capabilities.economy += 1;
  }
  if (operation.op === 'modifier') {
    if (operation.kind === 'extra-energy-play' || operation.kind === 'energy-enters-exhausted') capabilities.economy += 1;
    if (operation.kind === 'defense' || operation.kind === 'max-hp' || operation.kind === 'cannot-target-by-opponent') capabilities.protection += 1;
    if (operation.kind.startsWith('cannot-') || operation.kind === 'play-cost' || operation.kind === 'utility-cost') capabilities.control += 1;
  }
  if (operation.op === 'if') {
    operation.then.forEach((nested) => addOperationCapability(capabilities, nested));
    operation.else?.forEach((nested) => addOperationCapability(capabilities, nested));
  }
  if (operation.op === 'for-each') operation.effects.forEach((nested) => addOperationCapability(capabilities, nested));
}

function scriptOperations(cardId: string): EffectOperation[] {
  const script = getEffectScript(cardId);
  if (!script) return [];
  return [
    ...(script.utility?.effects ?? []),
    ...(script.activated ?? []).flatMap(({ costs, effects }) => [...(costs ?? []), ...effects]),
    ...(script.triggers ?? []).flatMap(({ effects }) => effects),
    ...(script.attacks ?? []).flatMap(({ prepare, effects, afterDamage }) => [
      ...(prepare ?? []), ...(effects ?? []), ...(afterDamage ?? []),
    ]),
  ];
}

export function compileDeckProfile(entries: readonly DeckListEntry[]): DeckProfile {
  const kindCounts = { unit: 0, utility: 0, energy: 0 };
  const energyDemand = Object.fromEntries(ENERGY_TYPES.map((type) => [type, 0])) as Record<EnergyType, number>;
  const capabilities = emptyCapabilities();
  let totalCards = 0;
  let totalUnitHp = 0;
  let totalUnitDefense = 0;
  let constructionCount = 0;

  for (const [cardId, count] of entries) {
    if (!Number.isInteger(count) || count < 1) throw new Error(`Invalid deck count for ${cardId}.`);
    const card = getCard(cardId);
    totalCards += count;
    kindCounts[card.kind] += count;
    for (const cost of [...card.cost, ...card.attacks.flatMap((attack) => attack.cost)]) {
      if (cost !== 'any') energyDemand[cost] += count;
    }
    if (card.kind === 'unit') {
      totalUnitHp += card.hp * count;
      totalUnitDefense += card.defense * count;
    }
    if (card.utilityType === 'construction') constructionCount += count;
    const perCard = emptyCapabilities();
    scriptOperations(cardId).forEach((operation) => addOperationCapability(perCard, operation));
    if (getEffectScript(cardId)?.utility?.reaction) perCard.reactions += 1;
    const printedDice = card.attacks.reduce((total, attack) => total + attack.dice.length, 0);
    perCard.variance += printedDice;
    for (const key of Object.keys(capabilities) as Array<keyof DeckCapabilityCounts>) {
      capabilities[key] += perCard[key] * count;
    }
  }

  return {
    totalCards,
    kindCounts,
    energyDemand,
    averageUnitHp: kindCounts.unit ? totalUnitHp / kindCounts.unit : 0,
    averageUnitDefense: kindCounts.unit ? totalUnitDefense / kindCounts.unit : 0,
    constructionCount,
    capabilities,
  };
}
