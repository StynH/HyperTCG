import { applyGameAction, listLegalActions, type GameAction } from '../actions';
import { secureRandom } from '../random';
import type { GameState, PlayerId } from '../types';
import { sampleKnownDeckState } from './belief';
import { boundedCandidates } from './candidates';
import { compileDeckProfile } from './deckProfile';
import { getAiDifficulty } from './difficulty';
import { runInformationSetSearch } from './ismcts';
import { nextSeed, seededRandom } from './random';
import { findRobustImmediateWin } from './tactical';
import type { AiDifficulty, DeckListEntry, DeckProfile, OpponentSearchOptions } from './types';

const AI_PLAYER: PlayerId = 1;

export interface OpponentCandidateScore {
  action: GameAction;
  meanValue: number;
  variance: number;
  visits: number;
  availability: number;
}

export interface OpponentDecision {
  action: GameAction;
  difficulty: AiDifficulty;
  candidates: readonly OpponentCandidateScore[];
  simulations: number;
}

const profileCache = new Map<string, DeckProfile>();

function cachedDeckProfile(entries: readonly DeckListEntry[]): DeckProfile {
  const key = entries.map(([cardId, count]) => `${cardId}:${count}`).join('|');
  const cached = profileCache.get(key);
  if (cached) return cached;
  const profile = compileDeckProfile(entries);
  profileCache.set(key, profile);
  return profile;
}

function selectWithinRegret(
  candidates: readonly OpponentCandidateScore[],
  regretLimit: number,
  temperature: number,
  random: () => number,
): GameAction {
  const best = candidates[0];
  if (!best) throw new Error('Cannot select from an empty AI candidate set.');
  if (regretLimit <= 0 || temperature <= 0) return best.action;
  const plausible = candidates.filter(({ meanValue }) => best.meanValue - meanValue <= regretLimit);
  if (plausible.length === 1) return best.action;
  const weights = plausible.map(({ meanValue }) => Math.exp((meanValue - best.meanValue) / temperature));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = random() * total;
  for (let index = 0; index < plausible.length; index += 1) {
    roll -= weights[index];
    if (roll <= 0) return plausible[index].action;
  }
  return plausible[plausible.length - 1].action;
}

export function chooseStrategicOpponentAction(
  state: GameState,
  options: OpponentSearchOptions,
  random: () => number = secureRandom,
): OpponentDecision | null {
  const difficulty = options.difficulty ?? 'challenger';
  const settings = getAiDifficulty(difficulty).settings;
  const profiles: Partial<Record<PlayerId, DeckProfile>> = {
    0: cachedDeckProfile(options.knownPlayerDeck),
    1: cachedDeckProfile(options.aiDeck),
  };
  const beliefSeeds = Array.from({ length: settings.beliefSamples }, () => nextSeed(random));
  const chanceSeeds = Array.from({ length: settings.chanceSamples }, () => nextSeed(random));
  const samples = beliefSeeds.map((seed) => (
    sampleKnownDeckState(state, AI_PLAYER, options.knownPlayerDeck, options.aiDeck, seededRandom(seed))
  ));
  const roots = boundedCandidates(samples[0], AI_PLAYER, settings.candidateLimit);
  if (!roots.length) return null;

  const robustWin = findRobustImmediateWin(
    samples,
    roots,
    chanceSeeds,
    AI_PLAYER,
    settings.candidateLimit,
  );
  if (robustWin) {
    const simulations = samples.length * chanceSeeds.length;
    return {
      action: robustWin,
      difficulty,
      candidates: [{
        action: robustWin,
        meanValue: 1_000_000,
        variance: 0,
        visits: simulations,
        availability: simulations,
      }],
      simulations,
    };
  }

  const candidates: OpponentCandidateScore[] = runInformationSetSearch({
    samples,
    chanceSeeds,
    player: AI_PLAYER,
    profiles,
    iterations: settings.iterations,
    searchDepth: settings.searchDepth,
    candidateLimit: settings.candidateLimit,
    searchSeed: nextSeed(random),
  });
  if (!candidates.length) return null;

  return {
    action: selectWithinRegret(candidates, settings.regretLimit, settings.temperature, random),
    difficulty,
    candidates,
    simulations: settings.iterations,
  };
}

export function runStrategicOpponentStep(
  state: GameState,
  options: OpponentSearchOptions,
  random: () => number = secureRandom,
): GameState {
  const isAiChoice = state.pendingChoice?.player === AI_PLAYER;
  const isAiMulligan = state.pendingMulligan?.player === AI_PLAYER;
  const isAiTurn = state.activePlayer === AI_PLAYER && state.isOpponentActing && !state.pendingChoice;
  if (state.winner !== null || (!isAiChoice && !isAiMulligan && !isAiTurn)) return state;
  const decision = chooseStrategicOpponentAction(state, options, random);
  if (!decision) return state;
  const result = applyGameAction(state, decision.action, random);
  if (!result.error) return result.state;
  const endAction = listLegalActions(state, AI_PLAYER).find(({ kind }) => kind === 'end-turn');
  return endAction ? applyGameAction(state, endAction, random).state : state;
}

export function mulliganStrategicOpeningHand(
  state: GameState,
  options: OpponentSearchOptions,
  random: () => number = secureRandom,
): GameState {
  const staged = prepareStrategicOpeningMulligan(state);
  return runStrategicOpponentStep(staged, options, random);
}

export function prepareStrategicOpeningMulligan(state: GameState): GameState {
  const staged = structuredClone(state);
  staged.pendingMulligan = { player: AI_PLAYER, maxCards: 3 };
  return staged;
}
