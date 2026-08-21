import type { CardCondition, OwnedCampaignCard } from './cardCondition';

export interface SgsGradingRecord {
  company: 'SGS';
  grade: number;
  certificateNumber: string;
}

export type SgsLabelTier = 'diamond' | 'platinum' | 'white-gold' | 'gold' | 'silver' | 'bronze';

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

export function getSgsLabelTier(card: OwnedCampaignCard): SgsLabelTier {
  const grade = card.grading?.grade;
  if (grade === 10) {
    const subgrades = Object.values(getSgsSubgrades(card.condition));
    const perfectSubgradeCount = subgrades.filter((score) => score === 10).length;
    if (perfectSubgradeCount === 4) return 'diamond';
    if (perfectSubgradeCount === 3 && subgrades.includes(9.5)) return 'platinum';
    return 'white-gold';
  }
  if (grade !== undefined && grade >= 9.5) return 'gold';
  if (grade !== undefined && grade >= 9) return 'silver';
  return 'bronze';
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
