import { openBooster } from './boosters';
import {
  purchaseBoosters, wipeCampaignCollection, type CampaignProfile,
} from './profile';

interface TestResult { name: string; passed: boolean; error?: string }

function run(name: string, test: () => void): TestResult {
  try {
    test();
    return { name, passed: true };
  } catch (error) {
    return { name, passed: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function expect(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function createProfile(): CampaignProfile {
  return {
    version: 3,
    celestialCredits: 1_000,
    collection: {},
    ownedCards: [],
    packsOpened: 0,
  };
}

export function runCampaignProfileTests(): TestResult[] {
  return [
    run('bulk purchase adds every card and pack in one profile update', () => {
      const boosters = [openBooster('ORIG', () => 0.5), openBooster('ORIG', () => 0.5)];
      const profile = purchaseBoosters(createProfile(), boosters, 100);
      const collectionTotal = Object.values(profile.collection).reduce((total, count) => total + count, 0);
      expect(collectionTotal === 20, `Expected 20 collection cards, received ${collectionTotal}`);
      expect(profile.ownedCards.length === 20, `Expected 20 owned cards, received ${profile.ownedCards.length}`);
      expect(profile.packsOpened === 2, `Expected 2 opened packs, received ${profile.packsOpened}`);
    }),
    run('bulk purchase rejects an empty purchase', () => {
      let didThrow = false;
      try {
        purchaseBoosters(createProfile(), [], 100);
      } catch {
        didThrow = true;
      }
      expect(didThrow, 'An empty booster purchase was accepted');
    }),
    run('collection wipe deletes cards while retaining campaign totals', () => {
      const purchased = purchaseBoosters(createProfile(), [openBooster('FOUR', () => 0.5)], 100);
      const wiped = wipeCampaignCollection(purchased);
      expect(Object.keys(wiped.collection).length === 0, 'Collection counts were not cleared');
      expect(wiped.ownedCards.length === 0, 'Owned card records were not cleared');
      expect(wiped.packsOpened === 1, 'Lifetime opened pack count was reset');
      expect(wiped.celestialCredits === purchased.celestialCredits, 'Celestial Credits changed during collection wipe');
    }),
  ];
}
