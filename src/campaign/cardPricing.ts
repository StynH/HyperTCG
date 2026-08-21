import type { OwnedCampaignCard } from './cardCondition';
import type { CardDefinition } from '../game/types';
import { getSgsLabelTier, type SgsLabelTier } from './grading';

export type MarketRarity = 'common' | 'uncommon' | 'rare' | 'ultra' | 'alternative';

// Every catalog ID has exactly one base value. Copy-specific condition never
// changes this value; only explicit treatments and grading can modify it.
export const BASE_CARD_VALUES_CC: Readonly<Record<string, number>> = {
  '001-admiral-asgore-dreemurr': 375,
  '002-apocalypse': 165,
  '003-barack-obama': 215,
  '004-cyclops-super': 400,
  '005-donald-trump': 195,
  '006-dr-breen': 275,
  '007-garen-crownguard': 300,
  '008-jean-luc-picard': 170,
  '009-raiden': 425,
  '010-soldier-tf2-super': 390,
  '011-terra': 150,
  '012-xehanort': 375,
  '013-citadel': 120,
  '014-hyperversal-gate': 185,
  '015-x-tremists-unite': 210,
  '016-zero-hour': 110,
  '017-cyclops-tactician': 40,
  '018-ebony-maw': 25,
  '019-lola-bunny': 38,
  '020-mark-rutte': 20,
  '021-ordinal': 17,
  '022-patlu': 20,
  '023-squidward': 55,
  '024-sylas': 31,
  '025-vengeful-spectre': 22,
  '026-yoko-littner': 36,
  '027-copycats': 18,
  '028-energy-reactor': 16,
  '029-planet-n8318': 15,
  '030-splinter-groups': 13,
  '031-suppression-protocol': 12,
  '032-zephyr-strike': 16,
  '033-antonije-pusic': 9,
  '034-bob-ross': 28,
  '035-cremator': 7,
  '036-disaster-spectre': 6,
  '037-elite': 7,
  '038-eminem': 28,
  '039-engineer': 11,
  '040-geert-wilders': 12,
  '041-kramer': 9,
  '042-lawmaker': 5,
  '043-marksman': 6,
  '044-motu': 7,
  '045-murdoc-niccals': 26,
  '046-observing-spectre': 6,
  '047-peter-griffin': 15,
  '048-sniper': 10,
  '049-stalker': 8,
  '050-stanley-pines': 14,
  '051-stewie-griffin': 14,
  '052-tech-specialist': 5,
  '053-tupac': 18,
  '054-vale': 6,
  '055-clearmind': 5,
  '056-contract-with-the-tcr': 6,
  '057-incoming-warning': 5,
  '058-infiltration-strike': 7,
  '059-inter-hyperversal-space': 8,
  '060-oblique-blade': 9,
  '061-one-punch': 13,
  '062-overwatch-directive': 8,
  '063-suppressing-fire': 6,
  '064-transhuman-conditioning': 7,
  '065-2d': 8,
  '066-andy-king': 3,
  '067-civilian': 1,
  '068-cleaning-droid': 2,
  '069-conscript': 2,
  '070-demoman': 5,
  '071-desert-droid': 2,
  '072-grunt': 2,
  '073-guard': 2,
  '074-junk-droid': 3,
  '075-metrocop': 5,
  '076-mining-droid': 2,
  '077-norm-of-the-north': 4,
  '078-pilot': 2,
  '079-retrieval-machine': 3,
  '080-rover': 2,
  '081-salesman': 2,
  '082-scanner': 2,
  '083-scout-droid': 2,
  '084-sentry': 3,
  '085-soldier': 3,
  '086-soldier-tf2': 6,
  '087-transport-droid': 2,
  '088-trooper': 2,
  '089-battle-medicine': 4,
  '090-deploy-armor': 3,
  '091-herring-bandito': 5,
  '092-keltec-pr57': 4,
  '093-narrow-escape': 3,
  '094-pulse-rifle': 4,
  '095-stun-baton': 3,
  '096-tcr-v02-strike-gun': 4,
  '001-aleph-atomic-titan': 360,
  '002-e-v-e': 450,
  '003-emperor-metron': 250,
  '004-emperor-rassilon': 255,
  '005-emperor-saruman': 265,
  '006-emperor-uatu': 260,
  '007-endymion': 350,
  '008-rolento': 315,
  '009-project-catasthor': 280,
  '010-project-voidstar-cannon': 225,
  '011-project-voidstar-looking-glass': 230,
  '012-combine-advisor': 38,
  '013-fission-bomb-walker': 28,
  '014-prime-bounty-hunter': 36,
  '015-earth-prime': 26,
  '016-earth-3021': 24,
  '017-planetary-strike': 22,
  '018-project-parabellum': 44,
  '019-the-losing-battle': 20,
  '020-the-tomb-of-the-fallen-elder': 48,
  '021-crystal-golem': 9,
  '022-cse-star-fighter': 8,
  '023-cse-synth-lancer': 8,
  '024-fcr-mine-layer': 7,
  '025-isu-carrier': 10,
  '026-prime-collector': 11,
  '027-x-tremist-jet': 12,
  '028-aleph-fcr-joint-mission': 15,
  '029-cse-blockade': 7,
  '030-cse-negotiations': 8,
  '031-cse-siphoning-laser': 7,
  '032-decapitation-strike': 18,
  '033-fcr-mortar-cannon': 8,
  '034-fission-launcher-pod': 7,
  '035-isu-warp-gate': 14,
  '036-setting-the-bounty': 16,
  '037-aleph-striker': 3,
  '038-combine-grub': 2,
  '039-cse-trooper': 2,
  '040-digi-spectre': 4,
  '041-hidden-spectre': 4,
  '042-prime-infiltrator': 4,
  '043-stone-golem': 3,
  '044-2spooky4me': 5,
  '045-aleph-laser-claymore': 3,
  '046-fcr-trench-drone': 2,
  '047-crushing-grip': 3,
  '048-energy-retrieval-service': 3,
  '049-fcr-rpg-launcher': 4,
  '050-clay-golem': 2,
  '051-resonating-health-crystal': 4,
  '052-cse-sentry': 3,
  '053-dragoon': 10_000,
  '054-popeye': 14_000,
  '103-lucille-de-labora': 12_000,
  '104-squidward-mercenary': 18_000,
  '105-the-master-of-puppets': 28_000,
  'energy-gluon': 2,
  'energy-photon': 3,
  'energy-electron': 2,
  'energy-muon': 2,
  'energy-boson': 3,
  'energy-neutrino': 2,
};

const GRADE_MULTIPLIERS: Record<MarketRarity, Readonly<Record<number, number>>> = {
  common: { 1: 0.2, 1.5: 0.25, 2: 0.3, 2.5: 0.35, 3: 0.4, 3.5: 0.45, 4: 0.5, 4.5: 0.55, 5: 0.6, 5.5: 0.7, 6: 0.8, 6.5: 0.9, 7: 1.5, 7.5: 2, 8: 3, 8.5: 5, 9: 8, 9.5: 10 },
  uncommon: { 1: 0.2, 1.5: 0.25, 2: 0.3, 2.5: 0.35, 3: 0.4, 3.5: 0.45, 4: 0.5, 4.5: 0.55, 5: 0.6, 5.5: 0.7, 6: 0.8, 6.5: 0.9, 7: 1.4, 7.5: 1.8, 8: 2.5, 8.5: 4, 9: 6, 9.5: 8 },
  rare: { 1: 0.2, 1.5: 0.25, 2: 0.3, 2.5: 0.35, 3: 0.4, 3.5: 0.45, 4: 0.5, 4.5: 0.55, 5: 0.6, 5.5: 0.7, 6: 0.8, 6.5: 0.9, 7: 1.25, 7.5: 1.35, 8: 1.5, 8.5: 2, 9: 3, 9.5: 5 },
  ultra: { 1: 0.2, 1.5: 0.25, 2: 0.3, 2.5: 0.35, 3: 0.4, 3.5: 0.45, 4: 0.5, 4.5: 0.55, 5: 0.6, 5.5: 0.7, 6: 0.8, 6.5: 0.9, 7: 1.05, 7.5: 1.1, 8: 1.2, 8.5: 1.5, 9: 2, 9.5: 3 },
  alternative: { 1: 0.2, 1.5: 0.25, 2: 0.3, 2.5: 0.35, 3: 0.4, 3.5: 0.45, 4: 0.5, 4.5: 0.55, 5: 0.6, 5.5: 0.7, 6: 0.8, 6.5: 0.9, 7: 1.01, 7.5: 1.03, 8: 1.05, 8.5: 1.075, 9: 1.1, 9.5: 1.5 },
};

type PristineLabelTier = Extract<SgsLabelTier, 'white-gold' | 'platinum' | 'diamond'>;

const PRISTINE_LABEL_MULTIPLIERS: Record<PristineLabelTier, Record<MarketRarity, number>> = {
  'white-gold': { common: 20, uncommon: 18, rare: 12, ultra: 8, alternative: 4 },
  platinum: { common: 45, uncommon: 40, rare: 30, ultra: 45, alternative: 50 },
  diamond: { common: 100, uncommon: 90, rare: 75, ultra: 120, alternative: 250 },
};

const STAMP_MULTIPLIERS: Record<MarketRarity, number> = {
  common: 2,
  uncommon: 2.25,
  rare: 2.5,
  ultra: 3,
  alternative: 4,
};

export function getMarketRarity(card: CardDefinition): MarketRarity {
  if (card.unitTreatment === 'alternative' || card.rarity === 'secret') return 'alternative';
  if (card.rarity === 'common' || card.rarity === 'uncommon' || card.rarity === 'rare' || card.rarity === 'ultra') {
    return card.rarity;
  }
  throw new Error(`Card ${card.id} has unsupported market rarity ${card.rarity}.`);
}

export function getBaseCardValueCc(cardId: string): number {
  const value = BASE_CARD_VALUES_CC[cardId];
  if (value === undefined) throw new Error(`Card ${cardId} does not have an individual market price.`);
  return value;
}

export function getRawCardValueWithTreatmentCc(card: CardDefinition, stamped = false): number {
  let value = getBaseCardValueCc(card.id);
  if (stamped) value *= STAMP_MULTIPLIERS[getMarketRarity(card)];
  return Math.round(value);
}

export function getRawPriceTreatmentLabels(card: CardDefinition, stamped = false): readonly string[] {
  const labels: string[] = [];
  if (card.unitTreatment === 'super') labels.push('SUPER');
  if (stamped) labels.push('STAMPED');
  return labels;
}

// SGS scales its fee with the card it is grading. A flat fee cannot serve a
// catalog spanning 1 to 28,000 CC: it is trivial at the top and absurd at the
// bottom, leaving Ultra Rares as the only band where grading is a real choice.
// The floor keeps Commons out of the market entirely.
export const GRADING_FEE_FLOOR_CC = 80;
export const GRADING_FEE_RATE = 0.25;

export function getGradingFeeCc(card: CardDefinition, ownedCard: OwnedCampaignCard): number {
  if (card.id !== ownedCard.cardId) throw new Error(`Cannot quote grading for ${ownedCard.cardId} using ${card.id}.`);
  const rawValue = getRawCardValueWithTreatmentCc(card, ownedCard.stamped);
  return Math.max(GRADING_FEE_FLOOR_CC, Math.round(rawValue * GRADING_FEE_RATE));
}

export function getOwnedCardValueCc(card: CardDefinition, ownedCard: OwnedCampaignCard): number {
  if (card.id !== ownedCard.cardId) throw new Error(`Cannot price ${ownedCard.cardId} using ${card.id}.`);
  const rarity = getMarketRarity(card);
  let value = getRawCardValueWithTreatmentCc(card, ownedCard.stamped);
  if (ownedCard.grading) {
    const labelTier = getSgsLabelTier(ownedCard);
    const gradeMultiplier = ownedCard.grading.grade === 10
      ? PRISTINE_LABEL_MULTIPLIERS[labelTier as PristineLabelTier]?.[rarity]
      : GRADE_MULTIPLIERS[rarity][ownedCard.grading.grade];
    if (gradeMultiplier === undefined) throw new Error(`SGS grade ${ownedCard.grading.grade} does not have a market multiplier.`);
    value *= gradeMultiplier;
  }
  return Math.max(1, Math.round(value));
}

export function formatCelestialCredits(credits: number): string {
  return `${credits.toLocaleString()} CC`;
}
