import type { GameAction } from '../actions';
import type { GameState } from '../types';
import type { OpponentSearchOptions } from './types';

export interface AiSearchRequest {
  requestId: number;
  state: GameState;
  options: OpponentSearchOptions;
  seed: number;
}

export interface AiSearchResponse {
  requestId: number;
  action: GameAction | null;
  error?: string;
}
