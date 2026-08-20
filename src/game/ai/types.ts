import type { EnergyType } from '../types';

export type AiDifficulty = 'initiate' | 'challenger' | 'veteran';

export type DeckListEntry = readonly [cardId: string, count: number];

export interface DeckCapabilityCounts {
  cardAdvantage: number;
  control: number;
  damage: number;
  economy: number;
  protection: number;
  reactions: number;
  recursion: number;
  selection: number;
  variance: number;
}

export interface DeckProfile {
  totalCards: number;
  kindCounts: { unit: number; utility: number; energy: number };
  energyDemand: Record<EnergyType, number>;
  averageUnitHp: number;
  averageUnitDefense: number;
  constructionCount: number;
  capabilities: DeckCapabilityCounts;
}

export interface AiSearchSettings {
  beliefSamples: number;
  chanceSamples: number;
  iterations: number;
  searchDepth: number;
  candidateLimit: number;
  regretLimit: number;
  temperature: number;
}

export interface OpponentSearchOptions {
  knownPlayerDeck: readonly DeckListEntry[];
  aiDeck: readonly DeckListEntry[];
  difficulty?: AiDifficulty;
}
