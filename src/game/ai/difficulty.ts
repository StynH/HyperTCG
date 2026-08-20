import type { AiDifficulty, AiSearchSettings } from './types';

export interface AiDifficultyDefinition {
  id: AiDifficulty;
  name: string;
  description: string;
  settings: AiSearchSettings;
}

export const AI_DIFFICULTIES: readonly AiDifficultyDefinition[] = [
  {
    id: 'initiate',
    name: 'Initiate',
    description: 'Plans short lines and allows small, believable openings.',
    settings: {
      beliefSamples: 1,
      chanceSamples: 1,
      iterations: 40,
      searchDepth: 2,
      candidateLimit: 10,
      regretLimit: 45,
      temperature: 24,
    },
  },
  {
    id: 'challenger',
    name: 'Challenger',
    description: 'Plans several actions and respects likely hidden responses.',
    settings: {
      beliefSamples: 2,
      chanceSamples: 2,
      iterations: 120,
      searchDepth: 3,
      candidateLimit: 14,
      regretLimit: 12,
      temperature: 6,
    },
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Searches deeper and consistently takes its strongest line.',
    settings: {
      beliefSamples: 3,
      chanceSamples: 3,
      iterations: 320,
      searchDepth: 4,
      candidateLimit: 18,
      regretLimit: 0,
      temperature: 0,
    },
  },
];

export function getAiDifficulty(difficulty: AiDifficulty): AiDifficultyDefinition {
  return AI_DIFFICULTIES.find(({ id }) => id === difficulty)!;
}
