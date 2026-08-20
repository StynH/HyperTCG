import { actionKey, applyGameAction, listLegalActions, type GameAction } from '../actions';
import { secureRandom } from '../random';
import type { GameState, PlayerId } from '../types';
import { sampleKnownDeckState } from './belief';
import { compileDeckProfile } from './deckProfile';
import { getAiDifficulty } from './difficulty';
import { evaluateGameState } from './evaluation';
import { rankActions } from './heuristicOpponent';
import type { AiDifficulty, DeckListEntry, DeckProfile, OpponentSearchOptions } from './types';

const AI_PLAYER: PlayerId = 1;
const INVALID_ACTION_VALUE = -1_000_000;

export interface OpponentCandidateScore {
  action: GameAction;
  meanValue: number;
  variance: number;
}

export interface OpponentDecision {
  action: GameAction;
  difficulty: AiDifficulty;
  candidates: readonly OpponentCandidateScore[];
  simulations: number;
}

interface SearchContext {
  profiles: Partial<Record<PlayerId, DeckProfile>>;
  candidateLimit: number;
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

function seededRandom(initialSeed: number): () => number {
  let seed = initialSeed >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x1_0000_0000;
  };
}

function nextSeed(random: () => number): number {
  return Math.floor(random() * 0x1_0000_0000) >>> 0;
}

function actingPlayer(state: GameState): PlayerId {
  return state.pendingChoice?.player ?? state.pendingMulligan?.player ?? state.activePlayer;
}

function boundedCandidates(state: GameState, player: PlayerId, limit: number): GameAction[] {
  const legal = listLegalActions(state, player, { maxChoiceActions: Math.max(32, limit * 3) });
  const semanticKeys = new Set<string>();
  const frontier = legal.filter((action) => {
    // Board indices have no adjacency semantics in the current rules. One open
    // slot per row represents equivalent Unit placements and keeps widening cheap.
    const semanticKey = action.kind === 'play-unit'
      ? `${action.kind}:${action.instanceId}:${action.destination.row}`
      : actionKey(action);
    if (semanticKeys.has(semanticKey)) return false;
    semanticKeys.add(semanticKey);
    return true;
  });
  const ranked = rankActions(state, player, frontier);
  if (ranked.length <= limit) return ranked.map(({ action }) => action);

  const selected: GameAction[] = [];
  const selectedKeys = new Set<string>();
  const representedKinds = new Set<GameAction['kind']>();
  const add = (action: GameAction) => {
    const key = actionKey(action);
    if (selected.length >= limit || selectedKeys.has(key)) return;
    selected.push(action);
    selectedKeys.add(key);
    representedKinds.add(action.kind);
  };

  for (const { action } of ranked) {
    if (!representedKinds.has(action.kind)) add(action);
  }
  for (const { action } of ranked) add(action);
  return selected;
}

function searchValue(
  state: GameState,
  depth: number,
  context: SearchContext,
  random: () => number,
): number {
  if (state.winner !== null || depth <= 0) return evaluateGameState(state, AI_PLAYER, context.profiles);
  const actor = actingPlayer(state);
  const actions = boundedCandidates(state, actor, context.candidateLimit);
  if (!actions.length) return evaluateGameState(state, AI_PLAYER, context.profiles);

  let value = actor === AI_PLAYER ? -Infinity : Infinity;
  for (const action of actions) {
    const actionRandom = seededRandom(nextSeed(random));
    const result = applyGameAction(state, action, actionRandom);
    if (result.error) continue;
    const childValue = searchValue(result.state, depth - 1, context, actionRandom);
    value = actor === AI_PLAYER ? Math.max(value, childValue) : Math.min(value, childValue);
  }
  return Number.isFinite(value) ? value : evaluateGameState(state, AI_PLAYER, context.profiles);
}

function candidateRoots(sampledState: GameState, limit: number): GameAction[] {
  return boundedCandidates(sampledState, AI_PLAYER, limit);
}

function selectWithinRegret(
  candidates: readonly OpponentCandidateScore[],
  regretLimit: number,
  temperature: number,
  random: () => number,
): GameAction {
  const best = candidates[0];
  if (!best || regretLimit <= 0 || temperature <= 0) return best.action;
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
  const roots = candidateRoots(samples[0], settings.candidateLimit);
  if (!roots.length) return null;

  const context: SearchContext = { profiles, candidateLimit: settings.candidateLimit };
  const candidates = roots.map((action): OpponentCandidateScore => {
    const values: number[] = [];
    for (const sample of samples) {
      for (const seed of chanceSeeds) {
        const simulationRandom = seededRandom(seed);
        const result = applyGameAction(sample, action, simulationRandom);
        values.push(result.error
          ? INVALID_ACTION_VALUE
          : searchValue(result.state, settings.searchDepth - 1, context, simulationRandom));
      }
    }
    const meanValue = values.reduce((total, value) => total + value, 0) / values.length;
    const variance = values.reduce((total, value) => total + (value - meanValue) ** 2, 0) / values.length;
    return { action, meanValue, variance };
  }).sort((left, right) => (
    right.meanValue - left.meanValue
    || left.variance - right.variance
    || actionKey(left.action).localeCompare(actionKey(right.action))
  ));

  return {
    action: selectWithinRegret(candidates, settings.regretLimit, settings.temperature, random),
    difficulty,
    candidates,
    simulations: roots.length * settings.beliefSamples * settings.chanceSamples,
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
  const staged = structuredClone(state);
  staged.pendingMulligan = { player: AI_PLAYER, maxCards: 3 };
  return runStrategicOpponentStep(staged, options, random);
}
