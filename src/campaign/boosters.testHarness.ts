import {
  BOOSTER_CARD_COUNT, BOOSTER_COMMON_COUNT, BOOSTER_UNCOMMON_COUNT, openBooster,
} from './boosters';

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

function openWithRolls(premiumRarityRoll: number, stampRoll: number) {
  const rolls = [premiumRarityRoll, ...Array<number>(BOOSTER_CARD_COUNT).fill(0.5), stampRoll];
  let index = 0;
  return openBooster('ORIG', () => rolls[index++]);
}

export function runBoosterTests(): TestResult[] {
  return [
    run('boosters contain three Commons, three Uncommons, and one premium card', () => {
      const booster = openWithRolls(0.5, 0.5);
      expect(booster.cards.length === BOOSTER_CARD_COUNT, `Expected ${BOOSTER_CARD_COUNT} cards, received ${booster.cards.length}`);
      expect(booster.cards.filter(({ rarity }) => rarity === 'common').length === BOOSTER_COMMON_COUNT, `Booster did not contain ${BOOSTER_COMMON_COUNT} Commons`);
      expect(booster.cards.filter(({ rarity }) => rarity === 'uncommon').length === BOOSTER_UNCOMMON_COUNT, `Booster did not contain ${BOOSTER_UNCOMMON_COUNT} Uncommons`);
      expect(booster.cards.at(-1)?.rarity === booster.premiumRarity, 'The final card was not the premium pull');
    }),
    run('premium cards are stamped below the one-in-four threshold', () => {
      const booster = openWithRolls(0.5, 0.2499);
      expect(booster.cards.at(-1)?.stamped, 'A premium card below the 25% stamp threshold was not stamped');
    }),
    run('Ultra Rare cards are not automatically stamped', () => {
      const booster = openWithRolls(0.1, 0.25);
      expect(booster.premiumRarity === 'ultra', `Expected an Ultra Rare pull, received ${booster.premiumRarity}`);
      expect(!booster.cards.at(-1)?.stamped, 'An Ultra Rare card at the 25% boundary was incorrectly stamped');
    }),
  ];
}
