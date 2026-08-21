import { CARD_CATALOG } from '../data/catalog';
import type { CardDefinition } from '../game/types';
import type { OwnedCampaignCard } from './cardCondition';
import {
  BASE_CARD_VALUES_CC, getBaseCardValueCc, getGradingFeeCc,
  getOwnedCardValueCc, getRawCardValueWithTreatmentCc,
  GRADING_FEE_FLOOR_CC, GRADING_FEE_RATE,
} from './cardPricing';

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

type PristineTier = 'white-gold' | 'platinum' | 'diamond';

const PRISTINE_CONDITIONS: Record<PristineTier, OwnedCampaignCard['condition']> = {
  'white-gold': { centering: 9, corners: 10, edges: 10, surface: 10 },
  platinum: { centering: 9.5, corners: 10, edges: 10, surface: 10 },
  diamond: { centering: 10, corners: 10, edges: 10, surface: 10 },
};

function ownedCard(cardId: string, grade?: number, stamped = false, pristineTier: PristineTier = 'white-gold'): OwnedCampaignCard {
  return {
    instanceId: `pricing-${cardId}`,
    cardId,
    condition: grade === 10
      ? PRISTINE_CONDITIONS[pristineTier]
      : { centering: 8, corners: 8, edges: 8, surface: 8 },
    ...(stamped ? { stamped: true } : {}),
    ...(grade === undefined ? {} : {
      grading: { company: 'SGS', grade, certificateNumber: 'SGS-PRICETEST001' },
    }),
  };
}

function card(cardId: string): CardDefinition {
  return CARD_CATALOG.find((candidate) => candidate.id === cardId)!;
}

export function runCardPricingTests(): TestResult[] {
  return [
    run('every catalog card has one positive integer base price', () => {
      const catalogIds = new Set(CARD_CATALOG.map(({ id }) => id));
      expect(catalogIds.size === CARD_CATALOG.length, 'The card catalog contains duplicate IDs');
      expect(Object.keys(BASE_CARD_VALUES_CC).length === CARD_CATALOG.length, 'The price list and catalog have different sizes');
      for (const catalogCard of CARD_CATALOG) {
        const value = getBaseCardValueCc(catalogCard.id);
        expect(Number.isSafeInteger(value) && value > 0, `${catalogCard.id} has an invalid base price`);
      }
    }),
    run('identical ungraded copies have the same value regardless of hidden condition', () => {
      const catalogCard = card('023-squidward');
      for (const stamped of [false, true]) {
        const first = ownedCard(catalogCard.id, undefined, stamped);
        const second = {
          ...ownedCard(catalogCard.id, undefined, stamped),
          instanceId: `pricing-squidward-second-copy-${stamped}`,
          condition: { centering: 8, corners: 8, edges: 8, surface: 8 },
        } satisfies OwnedCampaignCard;
        expect(
          getOwnedCardValueCc(catalogCard, first) === getOwnedCardValueCc(catalogCard, second),
          `Ungraded condition changed the ${stamped ? 'stamped' : 'standard'} market value`,
        );
      }
    }),
    run('SUPER cards have Pokemon ex-style premiums baked into their fixed base prices', () => {
      const superValues = CARD_CATALOG
        .filter((catalogCard) => catalogCard.unitTreatment === 'super')
        .map((catalogCard) => getBaseCardValueCc(catalogCard.id));
      const standardUltraValues = CARD_CATALOG
        .filter((catalogCard) => catalogCard.rarity === 'ultra' && catalogCard.unitTreatment !== 'super')
        .map((catalogCard) => getBaseCardValueCc(catalogCard.id));
      expect(Math.min(...superValues) > Math.max(...standardUltraValues), 'SUPER and standard Ultra Rare base-price bands overlap');
    }),
    run('alternative base prices occupy a Ghost Rare and Gold Star band', () => {
      const alternativeValues = CARD_CATALOG
        .filter((catalogCard) => catalogCard.rarity === 'secret' || catalogCard.unitTreatment === 'alternative')
        .map((catalogCard) => getBaseCardValueCc(catalogCard.id));
      const standardValues = CARD_CATALOG
        .filter((catalogCard) => catalogCard.rarity !== 'secret' && catalogCard.unitTreatment !== 'alternative')
        .map((catalogCard) => getBaseCardValueCc(catalogCard.id));
      expect(Math.min(...alternativeValues) >= 10_000, 'An Alternative card is below the premium chase band');
      expect(Math.min(...alternativeValues) > Math.max(...standardValues), 'Alternative and standard price bands overlap');
    }),
    run('grade premiums rise from the commercial floor toward SGS 10 for each rarity', () => {
      for (const cardId of ['086-soldier-tf2', '034-bob-ross', '023-squidward', '005-donald-trump', '053-dragoon']) {
        const catalogCard = card(cardId);
        const values = [7, 7.5, 8, 8.5, 9, 9.5, 10].map((grade) => getOwnedCardValueCc(catalogCard, ownedCard(cardId, grade)));
        expect(values.every((value, index) => index === 0 || value > values[index - 1]), `${cardId} is not worth more at every higher grade`);
      }
    }),
    run('grade 7 is the first value above raw while lower grades remain collector territory', () => {
      for (const cardId of ['023-squidward', '005-donald-trump', '053-dragoon']) {
        const catalogCard = card(cardId);
        const raw = getOwnedCardValueCc(catalogCard, ownedCard(cardId));
        expect(getOwnedCardValueCc(catalogCard, ownedCard(cardId, 6.5)) < raw, `${cardId} grade 6.5 was not below raw value`);
        expect(getOwnedCardValueCc(catalogCard, ownedCard(cardId, 7)) > raw, `${cardId} grade 7 was not above raw value`);
      }
    }),
    run('Pristine label multipliers match the approved rarity table', () => {
      const cases = [
        ['086-soldier-tf2', 20, 45, 100],
        ['034-bob-ross', 18, 40, 90],
        ['023-squidward', 12, 30, 75],
        ['005-donald-trump', 8, 45, 120],
        ['053-dragoon', 4, 50, 250],
      ] as const;
      for (const [cardId, whiteGold, platinum, diamond] of cases) {
        const catalogCard = card(cardId);
        const base = getBaseCardValueCc(cardId);
        for (const [tier, multiplier] of [['white-gold', whiteGold], ['platinum', platinum], ['diamond', diamond]] as const) {
          expect(
            getOwnedCardValueCc(catalogCard, ownedCard(cardId, 10, false, tier)) === Math.round(base * multiplier),
            `${cardId} ${tier} did not use the ${multiplier}x multiplier`,
          );
        }
      }
    }),
    run('the grading fee scales with the card and never drops below the floor', () => {
      for (const catalogCard of CARD_CATALOG) {
        for (const stamped of [false, true]) {
          const raw = getRawCardValueWithTreatmentCc(catalogCard, stamped);
          const fee = getGradingFeeCc(catalogCard, ownedCard(catalogCard.id, undefined, stamped));
          expect(Number.isSafeInteger(fee) && fee >= GRADING_FEE_FLOOR_CC, `${catalogCard.id} quoted an invalid grading fee`);
          expect(fee === Math.max(GRADING_FEE_FLOOR_CC, Math.round(raw * GRADING_FEE_RATE)), `${catalogCard.id} did not price grading off its raw value`);
        }
      }
    }),
    // A pack card can only return 9.0, 9.5, or 10: the condition roll floors
    // centering at 8 and every other subgrade at 9. Grade 9.5 is ~73% of all
    // outcomes, so it is the result that decides whether a band is worth the
    // fee. Rare Pristine 10s stay profitable by design; that is the lottery.
    run('Commons never clear their grading fee on the common 9.5 outcome', () => {
      const bulk = CARD_CATALOG.filter((catalogCard) => catalogCard.kind !== 'energy' && catalogCard.rarity === 'common');
      expect(bulk.length > 0, 'The catalog has no Common cards');
      for (const catalogCard of bulk) {
        const raw = getOwnedCardValueCc(catalogCard, ownedCard(catalogCard.id));
        const fee = getGradingFeeCc(catalogCard, ownedCard(catalogCard.id));
        const graded = getOwnedCardValueCc(catalogCard, ownedCard(catalogCard.id, 9.5));
        expect(graded - fee < raw, `${catalogCard.id} makes Common grading profitable at 9.5`);
      }
    }),
    run('an Ultra Rare 9.5 clears its grading fee', () => {
      for (const cardId of ['008-rolento', '009-raiden', '002-e-v-e']) {
        const catalogCard = card(cardId);
        const raw = getOwnedCardValueCc(catalogCard, ownedCard(cardId));
        const fee = getGradingFeeCc(catalogCard, ownedCard(cardId));
        const graded = getOwnedCardValueCc(catalogCard, ownedCard(cardId, 9.5));
        expect(graded - fee > raw, `${cardId} loses money on the most common grade outcome`);
      }
    }),
    run('the whole grade ladder pays more at every step for a premium card', () => {
      const cardId = '010-soldier-tf2-super';
      const catalogCard = card(cardId);
      const ladder = [
        getOwnedCardValueCc(catalogCard, ownedCard(cardId, 9, true)),
        getOwnedCardValueCc(catalogCard, ownedCard(cardId, 9.5, true)),
        getOwnedCardValueCc(catalogCard, ownedCard(cardId, 10, true, 'white-gold')),
        getOwnedCardValueCc(catalogCard, ownedCard(cardId, 10, true, 'platinum')),
        getOwnedCardValueCc(catalogCard, ownedCard(cardId, 10, true, 'diamond')),
      ];
      expect(
        ladder.every((value, index) => index === 0 || value > ladder[index - 1]),
        `The stamped SUPER grade ladder does not pay more at every step: ${ladder.join(' -> ')}`,
      );
    }),
    run('grading still beats a raw sale at 9.5 for every premium rarity', () => {
      for (const cardId of ['008-rolento', '009-raiden', '053-dragoon', '105-the-master-of-puppets']) {
        const catalogCard = card(cardId);
        const raw = getOwnedCardValueCc(catalogCard, ownedCard(cardId));
        const fee = getGradingFeeCc(catalogCard, ownedCard(cardId));
        const graded = getOwnedCardValueCc(catalogCard, ownedCard(cardId, 9.5));
        expect(graded - fee > raw, `${cardId} loses money grading at the most common outcome`);
      }
    }),
    run('stamps and higher Pristine labels compound the market premium', () => {
      const catalogCard = card('104-squidward-mercenary');
      const raw = getOwnedCardValueCc(catalogCard, ownedCard(catalogCard.id));
      const stamped = getOwnedCardValueCc(catalogCard, ownedCard(catalogCard.id, undefined, true));
      const whiteGold = getOwnedCardValueCc(catalogCard, ownedCard(catalogCard.id, 10));
      const platinum = getOwnedCardValueCc(catalogCard, ownedCard(catalogCard.id, 10, false, 'platinum'));
      const diamond = getOwnedCardValueCc(catalogCard, ownedCard(catalogCard.id, 10, false, 'diamond'));
      expect(stamped > raw, 'The stamped treatment did not add value');
      expect(whiteGold < platinum && platinum < diamond, 'Pristine labels did not increase from White Gold through Diamond');
    }),
  ];
}
