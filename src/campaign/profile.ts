import type { OpenedBooster } from './boosters';
import {
  createOwnedCampaignCard, type CardCondition, type OwnedCampaignCard,
} from './cardCondition';
import { getCard } from '../data/catalog';
import { getGradingFeeCc } from './cardPricing';
import { calculateSgsGrade, gradeCardWithSgs, type SgsGradingRecord } from './grading';

export interface CampaignProfile {
  version: 3;
  celestialCredits: number;
  collection: Record<string, number>;
  ownedCards: OwnedCampaignCard[];
  packsOpened: number;
}

interface VersionTwoCampaignProfile {
  version: 2;
  celestialCredits: number;
  collection: Record<string, number>;
  ownedCards: OwnedCampaignCard[];
  packsOpened: number;
}

interface LegacyCampaignProfile {
  version: 1;
  celestialCredits: number;
  collection: Record<string, number>;
  packsOpened: number;
}

export const STARTING_CELESTIAL_CREDITS = 1_000;
// Temporary preview rule. Keep pack prices intact while campaign rewards are not implemented.
export const HAS_UNLIMITED_CELESTIAL_CREDITS = true;
const STORAGE_KEY = 'hyperverse-campaign-v1';

function createDefaultProfile(): CampaignProfile {
  return {
    version: 3,
    celestialCredits: STARTING_CELESTIAL_CREDITS,
    collection: {},
    ownedCards: [],
    packsOpened: 0,
  };
}

function isValidCollection(value: unknown): value is Record<string, number> {
  return !!value
    && typeof value === 'object'
    && Object.values(value).every((count) => Number.isSafeInteger(count) && count >= 0);
}

function isScoreBetween(value: unknown, minimum: number): value is number {
  return typeof value === 'number'
    && value >= minimum
    && value <= 10
    && Number.isInteger(value * 10);
}

function isValidCondition(value: unknown): value is CardCondition {
  if (!value || typeof value !== 'object') return false;
  const condition = value as Partial<CardCondition>;
  return isScoreBetween(condition.centering, 8)
    && isScoreBetween(condition.corners, 9)
    && isScoreBetween(condition.edges, 9)
    && isScoreBetween(condition.surface, 9);
}

function isValidOwnedCard(value: unknown): value is OwnedCampaignCard {
  if (!value || typeof value !== 'object') return false;
  const card = value as Partial<OwnedCampaignCard>;
  return typeof card.instanceId === 'string'
    && card.instanceId.length > 0
    && typeof card.cardId === 'string'
    && card.cardId.length > 0
    && isValidCondition(card.condition)
    && (card.stamped === undefined || typeof card.stamped === 'boolean')
    && (card.grading === undefined || isValidGradingRecord(card.grading));
}

function isValidGradingRecord(value: unknown): value is SgsGradingRecord {
  if (!value || typeof value !== 'object') return false;
  const grading = value as Partial<SgsGradingRecord>;
  return grading.company === 'SGS'
    && isScoreBetween(grading.grade, 1)
    && typeof grading.certificateNumber === 'string'
    && grading.certificateNumber.startsWith('SGS-');
}

function hasValidBaseFields(value: Partial<CampaignProfile | VersionTwoCampaignProfile | LegacyCampaignProfile>): boolean {
  return Number.isSafeInteger(value.celestialCredits)
    && value.celestialCredits! >= 0
    && Number.isSafeInteger(value.packsOpened)
    && value.packsOpened! >= 0
    && isValidCollection(value.collection);
}

function isValidProfile(value: unknown): value is CampaignProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<CampaignProfile>;
  return profile.version === 3
    && hasValidBaseFields(profile)
    && Array.isArray(profile.ownedCards)
    && profile.ownedCards.every(isValidOwnedCard);
}

function normalizeStoredGrades(profile: CampaignProfile): CampaignProfile {
  let didChange = false;
  const ownedCards = profile.ownedCards.map((card) => {
    if (!card.grading) return card;
    const grade = calculateSgsGrade(card.condition);
    if (grade === card.grading.grade) return card;
    didChange = true;
    return { ...card, grading: { ...card.grading, grade } };
  });
  return didChange ? { ...profile, ownedCards } : profile;
}

function isValidVersionTwoProfile(value: unknown): value is VersionTwoCampaignProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<VersionTwoCampaignProfile>;
  return profile.version === 2
    && hasValidBaseFields(profile)
    && Array.isArray(profile.ownedCards)
    && profile.ownedCards.every(isValidOwnedCard);
}

function isValidLegacyProfile(value: unknown): value is LegacyCampaignProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<LegacyCampaignProfile>;
  return profile.version === 1 && hasValidBaseFields(profile);
}

function migrateLegacyProfile(profile: LegacyCampaignProfile): CampaignProfile {
  const ownedCards = Object.entries(profile.collection).flatMap(([cardId, count]) => (
    Array.from({ length: count }, () => createOwnedCampaignCard(cardId))
  ));
  return { ...profile, version: 3, ownedCards };
}

export function loadCampaignProfile(): CampaignProfile {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return createDefaultProfile();
    const profile: unknown = JSON.parse(serialized);
    if (isValidProfile(profile)) {
      const normalizedProfile = normalizeStoredGrades(profile);
      if (normalizedProfile !== profile) saveCampaignProfile(normalizedProfile);
      return normalizedProfile;
    }
    if (isValidVersionTwoProfile(profile)) {
      const migratedProfile = normalizeStoredGrades({ ...profile, version: 3 });
      saveCampaignProfile(migratedProfile);
      return migratedProfile;
    }
    if (isValidLegacyProfile(profile)) {
      const migratedProfile = migrateLegacyProfile(profile);
      saveCampaignProfile(migratedProfile);
      return migratedProfile;
    }
    return createDefaultProfile();
  } catch (error) {
    console.warn('Campaign progress could not be loaded.', error);
    return createDefaultProfile();
  }
}

export function getCampaignGradingFeeCc(ownedCard: OwnedCampaignCard): number {
  return getGradingFeeCc(getCard(ownedCard.cardId), ownedCard);
}

export function canGradeCampaignCard(profile: CampaignProfile, instanceId: string): boolean {
  const ownedCard = profile.ownedCards.find((card) => card.instanceId === instanceId);
  if (!ownedCard || ownedCard.grading) return false;
  return HAS_UNLIMITED_CELESTIAL_CREDITS || profile.celestialCredits >= getCampaignGradingFeeCc(ownedCard);
}

export function gradeCampaignCard(profile: CampaignProfile, instanceId: string): CampaignProfile {
  const cardIndex = profile.ownedCards.findIndex((card) => card.instanceId === instanceId);
  if (cardIndex < 0) throw new Error(`Unknown campaign card instance: ${instanceId}`);
  const gradedCard = gradeCardWithSgs(profile.ownedCards[cardIndex]);
  if (gradedCard === profile.ownedCards[cardIndex]) return profile;
  const fee = getCampaignGradingFeeCc(profile.ownedCards[cardIndex]);
  if (!canGradeCampaignCard(profile, instanceId)) throw new Error('Not enough Celestial Credits to grade this card.');
  const ownedCards = [...profile.ownedCards];
  ownedCards[cardIndex] = gradedCard;
  return {
    ...profile,
    celestialCredits: HAS_UNLIMITED_CELESTIAL_CREDITS
      ? profile.celestialCredits
      : profile.celestialCredits - fee,
    ownedCards,
  };
}

export function saveCampaignProfile(profile: CampaignProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.warn('Campaign progress could not be saved.', error);
  }
}

export function canPurchaseBooster(profile: CampaignProfile, price: number): boolean {
  return HAS_UNLIMITED_CELESTIAL_CREDITS || profile.celestialCredits >= price;
}

export function purchaseBooster(
  profile: CampaignProfile,
  booster: OpenedBooster,
  price: number,
): CampaignProfile {
  return purchaseBoosters(profile, [booster], price);
}

export function purchaseBoosters(
  profile: CampaignProfile,
  boosters: readonly OpenedBooster[],
  pricePerBooster: number,
): CampaignProfile {
  if (boosters.length < 1) throw new Error('At least one booster is required.');
  const totalPrice = pricePerBooster * boosters.length;
  if (!canPurchaseBooster(profile, totalPrice)) throw new Error('Not enough Celestial Credits for these boosters.');
  const collection = { ...profile.collection };
  for (const booster of boosters) {
    for (const { card } of booster.cards) collection[card.id] = (collection[card.id] ?? 0) + 1;
  }
  const ownedCards = [
    ...profile.ownedCards,
    ...boosters.flatMap((booster) => (
      booster.cards.map(({ card, stamped }) => createOwnedCampaignCard(card.id, stamped))
    )),
  ];
  return {
    ...profile,
    celestialCredits: HAS_UNLIMITED_CELESTIAL_CREDITS
      ? profile.celestialCredits
      : profile.celestialCredits - totalPrice,
    collection,
    ownedCards,
    packsOpened: profile.packsOpened + boosters.length,
  };
}

export function wipeCampaignCollection(profile: CampaignProfile): CampaignProfile {
  return {
    ...profile,
    collection: {},
    ownedCards: [],
  };
}
