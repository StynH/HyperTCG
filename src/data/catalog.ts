import { GENERATED_CARDS } from './cardCatalog.generated';
import { ALTERNATIVE_CARDS } from './alternativeCards';
import { ENERGY_TYPES, type CardDefinition, type EnergyType } from '../game/types';
import { validateEffectScripts } from './effects';

export const ENERGY_META: Record<EnergyType, { label: string; symbol: string; color: string }> = {
  gluon: { label: 'Gluon', symbol: 'g', color: '#ffa94d' },
  photon: { label: 'Photon', symbol: 'γ', color: '#6ee3f6' },
  electron: { label: 'Electron', symbol: 'e⁻', color: '#f473b0' },
  muon: { label: 'Muon', symbol: 'μ', color: '#b78cf7' },
  boson: { label: 'Boson', symbol: 'H', color: '#ff6b6b' },
  neutrino: { label: 'Neutrino', symbol: 'ν', color: '#c7ef4a' },
};

const energyCards: CardDefinition[] = ENERGY_TYPES.map((energy) => ({
  id: `energy-${energy}`,
  kind: 'energy',
  name: `${ENERGY_META[energy].label} Energy`,
  subtitle: 'Permanent Resource',
  type: 'Energy',
  flavor: `${ENERGY_META[energy].label} domain energy.` ,
  hp: 0,
  defense: 0,
  cost: [],
  abilities: [],
  attacks: [],
  primary: energy,
  image: `/energies/${energy}-energy.png`,
  utilityType: 'instant',
  utilityCondition: '',
  utilityEffect: 'Play up to one Energy card during your turn. Tap Energy to pay costs.',
  utilityContent: 'effect',
  rarity: 'common',
  setId: 'ENERGY',
  number: ENERGY_TYPES.indexOf(energy) + 1,
  total: ENERGY_TYPES.length,
  energyType: energy,
}));

export const CARD_CATALOG = [
  ...(GENERATED_CARDS as unknown as CardDefinition[]),
  ...ALTERNATIVE_CARDS,
  ...energyCards,
];
export const CARD_BY_ID = new Map(CARD_CATALOG.map((card) => [card.id, card]));
validateEffectScripts(CARD_CATALOG);

export function getCard(cardId: string): CardDefinition {
  const card = CARD_BY_ID.get(cardId);
  if (!card) throw new Error(`Unknown card: ${cardId}`);
  return card;
}
