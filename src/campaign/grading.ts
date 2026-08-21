import type { CardCondition, OwnedCampaignCard } from './cardCondition';

export interface SgsGradingRecord {
  company: 'SGS';
  grade: number;
  certificateNumber: string;
}

export function roundSgsGrade(grade: number): number {
  return Math.round(grade * 2) / 2;
}

export function getSgsSubgrades(condition: CardCondition): CardCondition {
  return {
    centering: roundSgsGrade(condition.centering),
    corners: roundSgsGrade(condition.corners),
    edges: roundSgsGrade(condition.edges),
    surface: roundSgsGrade(condition.surface),
  };
}

export function calculateSgsGrade(condition: CardCondition): number {
  const subgrades = getSgsSubgrades(condition);
  const total = subgrades.centering + subgrades.corners + subgrades.edges + subgrades.surface;
  return roundSgsGrade(total / 4);
}

function createCertificateNumber(instanceId: string): string {
  const serial = instanceId.replaceAll('-', '').slice(0, 12).toUpperCase();
  return `SGS-${serial}`;
}

export function gradeCardWithSgs(card: OwnedCampaignCard): OwnedCampaignCard {
  if (card.grading) return card;
  return {
    ...card,
    grading: {
      company: 'SGS',
      grade: calculateSgsGrade(card.condition),
      certificateNumber: createCertificateNumber(card.instanceId),
    },
  };
}
