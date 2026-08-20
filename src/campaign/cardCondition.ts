import type { SgsGradingRecord } from './grading';

export interface CardCondition {
  centering: number;
  corners: number;
  edges: number;
  surface: number;
}

export interface OwnedCampaignCard {
  instanceId: string;
  cardId: string;
  condition: CardCondition;
  stamped?: boolean;
  grading?: SgsGradingRecord;
}

function rollOneDecimal(minimum: number, maximum: number, random: () => number): number {
  const roll = random();
  if (roll < 0 || roll >= 1) throw new Error(`Condition roll must be between 0 and 1, received ${roll}.`);
  return Math.round((minimum + (maximum - minimum) * roll) * 10) / 10;
}

export function rollCardCondition(random: () => number = Math.random): CardCondition {
  return {
    centering: rollOneDecimal(8, 10, random),
    corners: rollOneDecimal(9, 10, random),
    edges: rollOneDecimal(9, 10, random),
    surface: rollOneDecimal(9, 10, random),
  };
}

function createInstanceId(): string {
  return globalThis.crypto.randomUUID();
}

export function createOwnedCampaignCard(
  cardId: string,
  stamped = false,
  random: () => number = Math.random,
  createId: () => string = createInstanceId,
): OwnedCampaignCard {
  return {
    instanceId: createId(),
    cardId,
    condition: rollCardCondition(random),
    ...(stamped ? { stamped: true } : {}),
  };
}
