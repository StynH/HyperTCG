import { applyGameAction, type GameAction } from '../actions';
import type { GameState, PlayerId } from '../types';
import { boundedCandidates } from './candidates';
import { mixSeed, seededRandom } from './random';

const MAX_FORCED_CHOICE_DEPTH = 8;

function winsAfterForcedChoices(
  state: GameState,
  player: PlayerId,
  seed: number,
  candidateLimit: number,
  depth: number,
): boolean {
  if (state.winner !== null) return state.winner === player;
  if (!state.pendingChoice || depth >= MAX_FORCED_CHOICE_DEPTH) return false;

  const actor = state.pendingChoice.player;
  const choices = boundedCandidates(state, actor, candidateLimit);
  if (!choices.length) return false;
  const outcomes = choices.map((choice, index) => {
    const result = applyGameAction(state, choice, seededRandom(mixSeed(seed, depth, index)));
    return !result.error && winsAfterForcedChoices(
      result.state,
      player,
      mixSeed(seed, depth + 1, index),
      candidateLimit,
      depth + 1,
    );
  });
  return actor === player ? outcomes.some(Boolean) : outcomes.every(Boolean);
}

/**
 * Returns a move whose immediate effect (including generated choice chains) wins
 * in every supplied hidden-state and RNG scenario. This tactical guard is kept
 * separate from statistical search so a noisy estimate cannot discard a forced win.
 */
export function findRobustImmediateWin(
  samples: readonly GameState[],
  actions: readonly GameAction[],
  chanceSeeds: readonly number[],
  player: PlayerId,
  candidateLimit: number,
): GameAction | null {
  for (const action of actions) {
    const winsEveryScenario = samples.every((sample, sampleIndex) => (
      chanceSeeds.every((chanceSeed) => {
        const seed = mixSeed(chanceSeed, sampleIndex);
        const result = applyGameAction(sample, action, seededRandom(seed));
        return !result.error && winsAfterForcedChoices(
          result.state,
          player,
          seed,
          candidateLimit,
          0,
        );
      })
    ));
    if (winsEveryScenario) return action;
  }
  return null;
}
