import type { CardCondition, OwnedCampaignCard } from './cardCondition';

export interface SgsGradingRecord {
  company: 'SGS';
  grade: number;
  certificateNumber: string;
}

export function calculateSgsGrade(condition: CardCondition): number {
  const total = condition.centering + condition.corners + condition.edges + condition.surface;
  return Math.round((total / 4) * 10) / 10;
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
