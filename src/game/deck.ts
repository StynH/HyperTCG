import { CARD_BY_ID, getCard } from '../data/catalog';
import { ENERGY_TYPES, type CardInstance } from './types';

const UNIT_IDS = [
  '069-conscript', '075-metrocop', '083-scout-droid', '068-cleaning-droid',
  '078-pilot', '065-2d', '041-kramer', '067-civilian', '074-junk-droid',
  '081-salesman', '082-scanner', '085-soldier', '086-soldier-tf2',
  '070-demoman', '072-grunt',
];

const UTILITY_IDS = [
  '089-battle-medicine', '090-deploy-armor', '091-herring-bandito',
  '092-keltec-pr57', '093-narrow-escape', '094-pulse-rifle',
  '095-stun-baton', '096-tcr-v02-strike-gun', '030-splinter-groups',
  '055-clearmind', '057-incoming-warning', '063-suppressing-fire',
];

const ALTERNATIVE_IDS = [
  '103-lucille-de-labora',
  '104-squidward-mercenary',
  '105-the-master-of-puppets',
] as const;

let instanceSequence = 0;
function makeInstance(cardId: string): CardInstance {
  return { cardId, instanceId: `${cardId}-${++instanceSequence}` };
}

function seededShuffle<T>(values: T[], seed: number): T[] {
  const items = [...values];
  let value = seed;
  for (let index = items.length - 1; index > 0; index -= 1) {
    value = (value * 1664525 + 1013904223) >>> 0;
    const target = value % (index + 1);
    [items[index], items[target]] = [items[target], items[index]];
  }
  return items;
}

export function createDeck(seed: number): CardInstance[] {
  const missing = [...UNIT_IDS, ...UTILITY_IDS, ...ALTERNATIVE_IDS].filter((id) => !CARD_BY_ID.has(id));
  if (missing.length) throw new Error(`Deck references missing cards: ${missing.join(', ')}`);

  const scriptedOpening = [
    makeInstance('energy-gluon'),
    makeInstance('energy-electron'),
    makeInstance('069-conscript'),
    makeInstance('068-cleaning-droid'),
    makeInstance('089-battle-medicine'),
  ];
  const otherNonEnergy = [
    ...UNIT_IDS.flatMap((id) => Array.from({ length: 2 }, () => makeInstance(id))),
    ...UTILITY_IDS.map(makeInstance),
    makeInstance(seededShuffle([...ALTERNATIVE_IDS], seed)[0]),
  ];
  const openingIds = new Set(scriptedOpening.map(({ cardId }) => cardId));
  const filteredNonEnergy = otherNonEnergy.filter((instance) => {
    if (!openingIds.has(instance.cardId)) return true;
    openingIds.delete(instance.cardId);
    return false;
  });
  const energy = ENERGY_TYPES.flatMap((type) =>
    Array.from({ length: 3 }, () => makeInstance(`energy-${type}`)),
  );
  const openingEnergyIds = new Set(scriptedOpening.filter((card) => getCard(card.cardId).kind === 'energy').map(({ cardId }) => cardId));
  const filteredEnergy = energy.filter((instance) => {
    if (!openingEnergyIds.has(instance.cardId)) return true;
    openingEnergyIds.delete(instance.cardId);
    return false;
  });
  const remaining = seededShuffle([...filteredNonEnergy, ...filteredEnergy], seed).slice(0, 55);
  return [...scriptedOpening, ...remaining];
}
