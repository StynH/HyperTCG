import { CARD_CATALOG } from '../data/catalog';
import type { CardDefinition } from '../game/types';

export type BoosterSetId = 'ORIG' | 'FOUR';
export type BoosterRarity = 'common' | 'uncommon' | 'rare' | 'ultra' | 'alternative';

export interface BoosterDefinition {
  id: BoosterSetId;
  name: string;
  shortName: string;
  description: string;
  price: number;
  accent: string;
  accentSoft: string;
}

export interface BoosterCard {
  card: CardDefinition;
  rarity: BoosterRarity;
}

export interface OpenedBooster {
  setId: BoosterSetId;
  cards: readonly BoosterCard[];
  premiumRarity: Exclude<BoosterRarity, 'common' | 'uncommon'>;
}

export const BOOSTER_DEFINITIONS: readonly BoosterDefinition[] = [
  {
    id: 'ORIG',
    name: 'Origin',
    shortName: 'ORIGIN',
    description: 'Heroes, machines, and legends from the original base set.',
    price: 100,
    accent: '#5de1f2',
    accentSoft: '#b9f5fb',
  },
  {
    id: 'FOUR',
    name: 'Vengeance of the Four Emperors',
    shortName: 'FOUR EMPERORS',
    description: 'The Four Emperors set, featuring imperial units, rebels, constructions, and new support cards.',
    price: 100,
    accent: '#ff6c55',
    accentSoft: '#ffc09f',
  },
] as const;

const pools = new Map<BoosterSetId, Map<BoosterRarity, readonly CardDefinition[]>>();

function getBoosterDefinition(setId: BoosterSetId): BoosterDefinition {
  const definition = BOOSTER_DEFINITIONS.find((booster) => booster.id === setId);
  if (!definition) throw new Error(`Unknown booster set: ${setId}`);
  return definition;
}

function isAlternative(card: CardDefinition): boolean {
  return card.unitTreatment === 'alternative' || card.rarity === 'secret';
}

function buildPools(setId: BoosterSetId): Map<BoosterRarity, readonly CardDefinition[]> {
  const cards = CARD_CATALOG.filter((card) => card.setId === setId && card.kind !== 'energy');
  const byRarity = new Map<BoosterRarity, readonly CardDefinition[]>([
    ['common', cards.filter((card) => !isAlternative(card) && card.rarity === 'common')],
    ['uncommon', cards.filter((card) => !isAlternative(card) && card.rarity === 'uncommon')],
    ['rare', cards.filter((card) => !isAlternative(card) && card.rarity === 'rare')],
    ['ultra', cards.filter((card) => !isAlternative(card) && card.rarity === 'ultra')],
    ['alternative', cards.filter(isAlternative)],
  ]);

  for (const [rarity, pool] of byRarity) {
    if (pool.length === 0) throw new Error(`${getBoosterDefinition(setId).name} has no ${rarity} cards.`);
  }
  return byRarity;
}

function getPool(setId: BoosterSetId, rarity: BoosterRarity): readonly CardDefinition[] {
  let setPools = pools.get(setId);
  if (!setPools) {
    setPools = buildPools(setId);
    pools.set(setId, setPools);
  }
  return setPools.get(rarity)!;
}

function drawDistinct(
  pool: readonly CardDefinition[],
  count: number,
  random: () => number,
): CardDefinition[] {
  if (pool.length < count) throw new Error(`Cannot draw ${count} distinct cards from a pool of ${pool.length}.`);
  const available = [...pool];
  return Array.from({ length: count }, () => {
    const index = Math.min(Math.floor(random() * available.length), available.length - 1);
    return available.splice(index, 1)[0];
  });
}

export function getPremiumRarity(roll: number): OpenedBooster['premiumRarity'] {
  if (roll < 0 || roll >= 1) throw new Error(`Premium rarity roll must be between 0 and 1, received ${roll}.`);
  if (roll < 0.0017) return 'alternative';
  if (roll < 0.16) return 'ultra';
  return 'rare';
}

export function openBooster(setId: BoosterSetId, random: () => number = Math.random): OpenedBooster {
  getBoosterDefinition(setId);
  const premiumRarity = getPremiumRarity(random());
  const commons = drawDistinct(getPool(setId, 'common'), 6, random);
  const uncommons = drawDistinct(getPool(setId, 'uncommon'), 3, random);
  const premium = drawDistinct(getPool(setId, premiumRarity), 1, random)[0];

  return {
    setId,
    premiumRarity,
    cards: [
      ...commons.map((card) => ({ card, rarity: 'common' as const })),
      ...uncommons.map((card) => ({ card, rarity: 'uncommon' as const })),
      { card: premium, rarity: premiumRarity },
    ],
  };
}
