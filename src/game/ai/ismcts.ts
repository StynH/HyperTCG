import { actionKey, applyGameAction, type GameAction } from '../actions';
import type { GameState, PlayerId } from '../types';
import { boundedCandidates } from './candidates';
import { evaluateGameState } from './evaluation';
import { mixSeed, seededRandom } from './random';
import type { DeckProfile } from './types';

const EXPLORATION = Math.SQRT2;
const WIDENING_RATE = 1.8;
const ROLLOUT_VARIATION = 0.12;

interface SearchNode {
  visits: number;
  edges: Map<string, SearchEdge>;
}

interface SearchEdge {
  action: GameAction;
  visits: number;
  availability: number;
  totalValue: number;
  totalSquaredValue: number;
  child: SearchNode;
}

export interface InformationSetCandidate {
  action: GameAction;
  meanValue: number;
  variance: number;
  visits: number;
  availability: number;
}

export interface InformationSetSearchInput {
  samples: readonly GameState[];
  chanceSeeds: readonly number[];
  player: PlayerId;
  profiles: Partial<Record<PlayerId, DeckProfile>>;
  iterations: number;
  searchDepth: number;
  candidateLimit: number;
  searchSeed: number;
}

function actingPlayer(state: GameState): PlayerId {
  return state.pendingChoice?.player ?? state.pendingMulligan?.player ?? state.activePlayer;
}

function createNode(): SearchNode {
  return { visits: 0, edges: new Map() };
}

function normalizedValue(
  state: GameState,
  player: PlayerId,
  profiles: Partial<Record<PlayerId, DeckProfile>>,
): number {
  if (state.winner !== null) return state.winner === player ? 1 : -1;
  return Math.tanh(evaluateGameState(state, player, profiles) / 500);
}

function selectTreeEdge(
  candidates: readonly GameAction[],
  node: SearchNode,
  actor: PlayerId,
  player: PlayerId,
): { edge: SearchEdge; action: GameAction } | null {
  let selected: { edge: SearchEdge; action: GameAction } | null = null;
  let selectedScore = -Infinity;
  for (const action of candidates) {
    const edge = node.edges.get(actionKey(action));
    if (!edge) continue;
    const mean = edge.totalValue / Math.max(1, edge.visits);
    const exploitation = actor === player ? mean : -mean;
    const exploration = EXPLORATION * Math.sqrt(
      Math.log(Math.max(2, edge.availability)) / Math.max(1, edge.visits),
    );
    const score = exploitation + exploration;
    if (score > selectedScore) {
      selected = { edge, action };
      selectedScore = score;
    }
  }
  return selected;
}

function rollout(
  initialState: GameState,
  remainingDepth: number,
  player: PlayerId,
  profiles: Partial<Record<PlayerId, DeckProfile>>,
  candidateLimit: number,
  random: () => number,
): number {
  let state = initialState;
  for (let depth = 0; depth < remainingDepth && state.winner === null; depth += 1) {
    const actor = actingPlayer(state);
    const candidates = boundedCandidates(state, actor, candidateLimit);
    if (!candidates.length) break;
    const varied = random() < ROLLOUT_VARIATION;
    const poolSize = Math.min(3, candidates.length);
    const action = varied ? candidates[Math.floor(random() * poolSize)] : candidates[0];
    const result = applyGameAction(state, action, random);
    if (result.error) break;
    state = result.state;
  }
  return normalizedValue(state, player, profiles);
}

export function runInformationSetSearch(input: InformationSetSearchInput): InformationSetCandidate[] {
  if (!input.samples.length || !input.chanceSeeds.length || input.iterations <= 0) return [];
  const root = createNode();

  for (let iteration = 0; iteration < input.iterations; iteration += 1) {
    let state = input.samples[iteration % input.samples.length];
    const chanceSeed = input.chanceSeeds[iteration % input.chanceSeeds.length];
    const random = seededRandom(mixSeed(input.searchSeed, chanceSeed, iteration));
    let node = root;
    const traversed: SearchEdge[] = [];
    let depth = 0;

    while (depth < input.searchDepth && state.winner === null) {
      const actor = actingPlayer(state);
      const candidates = boundedCandidates(state, actor, input.candidateLimit);
      if (!candidates.length) break;

      const legalKeys = new Set(candidates.map(actionKey));
      for (const [key, edge] of node.edges) {
        if (legalKeys.has(key)) edge.availability += 1;
      }

      const width = Math.min(
        candidates.length,
        Math.max(1, Math.floor(WIDENING_RATE * Math.sqrt(node.visits + 1))),
      );
      const unexpanded = candidates.find((action) => !node.edges.has(actionKey(action)));
      if (unexpanded && node.edges.size < width) {
        const edge: SearchEdge = {
          action: unexpanded,
          visits: 0,
          availability: 1,
          totalValue: 0,
          totalSquaredValue: 0,
          child: createNode(),
        };
        node.edges.set(actionKey(unexpanded), edge);
        const result = applyGameAction(state, unexpanded, random);
        if (result.error) break;
        traversed.push(edge);
        state = result.state;
        node = edge.child;
        depth += 1;
        break;
      }

      const selected = selectTreeEdge(candidates, node, actor, input.player);
      if (!selected) break;
      const result = applyGameAction(state, selected.action, random);
      if (result.error) break;
      traversed.push(selected.edge);
      state = result.state;
      node = selected.edge.child;
      depth += 1;
    }

    const value = rollout(
      state,
      input.searchDepth - depth,
      input.player,
      input.profiles,
      input.candidateLimit,
      random,
    );
    root.visits += 1;
    for (const edge of traversed) {
      edge.visits += 1;
      edge.totalValue += value;
      edge.totalSquaredValue += value * value;
      edge.child.visits += 1;
    }
  }

  return [...root.edges.values()].map((edge): InformationSetCandidate => {
    const normalizedMean = edge.totalValue / Math.max(1, edge.visits);
    const normalizedVariance = Math.max(
      0,
      edge.totalSquaredValue / Math.max(1, edge.visits) - normalizedMean * normalizedMean,
    );
    return {
      action: edge.action,
      meanValue: normalizedMean * 1_000,
      variance: normalizedVariance * 1_000_000,
      visits: edge.visits,
      availability: edge.availability,
    };
  }).sort((left, right) => (
    right.meanValue - left.meanValue
    || right.visits - left.visits
    || left.variance - right.variance
    || actionKey(left.action).localeCompare(actionKey(right.action))
  ));
}
