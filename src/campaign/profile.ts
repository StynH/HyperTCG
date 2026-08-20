import type { OpenedBooster } from './boosters';
import {
  createOwnedCampaignCard, type CardCondition, type OwnedCampaignCard,
} from './cardCondition';

export interface CampaignProfile {
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
    version: 2,
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
    && isValidCondition(card.condition);
}

function hasValidBaseFields(value: Partial<CampaignProfile | LegacyCampaignProfile>): boolean {
  return Number.isSafeInteger(value.celestialCredits)
    && value.celestialCredits! >= 0
    && Number.isSafeInteger(value.packsOpened)
    && value.packsOpened! >= 0
    && isValidCollection(value.collection);
}

function isValidProfile(value: unknown): value is CampaignProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<CampaignProfile>;
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
  return { ...profile, version: 2, ownedCards };
}

export function loadCampaignProfile(): CampaignProfile {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return createDefaultProfile();
    const profile: unknown = JSON.parse(serialized);
    if (isValidProfile(profile)) return profile;
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
  if (!canPurchaseBooster(profile, price)) throw new Error('Not enough Celestial Credits for this booster.');
  const collection = { ...profile.collection };
  for (const { card } of booster.cards) collection[card.id] = (collection[card.id] ?? 0) + 1;
  const ownedCards = [
    ...profile.ownedCards,
    ...booster.cards.map(({ card }) => createOwnedCampaignCard(card.id)),
  ];
  return {
    ...profile,
    celestialCredits: HAS_UNLIMITED_CELESTIAL_CREDITS
      ? profile.celestialCredits
      : profile.celestialCredits - price,
    collection,
    ownedCards,
    packsOpened: profile.packsOpened + 1,
  };
}
