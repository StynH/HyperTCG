import { actionKey, applyGameAction, listLegalActions, type GameAction } from '../actions';
import { secureRandom } from '../random';
import type { GameState, PlayerId } from '../types';
import { evaluateGameState } from './evaluation';

export { evaluateGameState } from './evaluation';

const TYPICAL_OUTCOME_RANDOM = () => 0.49;
const MAX_CHOICE_DEPTH = 12;

function resolvedChoiceValue(state: GameState, player: PlayerId, depth: number): number {
  if (depth >= MAX_CHOICE_DEPTH || state.pendingChoice?.player !== player) {
    return evaluateGameState(state, player);
  }
  const actions = listLegalActions(state, player);
  if (!actions.length) return evaluateGameState(state, player);
  let best = -Infinity;
  for (const action of actions) {
    const result = applyGameAction(state, action, TYPICAL_OUTCOME_RANDOM);
    if (result.error) continue;
    best = Math.max(best, resolvedChoiceValue(result.state, player, depth + 1));
  }
  return Number.isFinite(best) ? best : evaluateGameState(state, player);
}

function actionValue(state: GameState, player: PlayerId, action: GameAction): number {
  const result = applyGameAction(state, action, TYPICAL_OUTCOME_RANDOM);
  if (result.error) return -Infinity;
  return resolvedChoiceValue(result.state, player, 0);
}

export function rankActions(
  state: GameState,
  player: PlayerId,
  actions: readonly GameAction[],
): Array<{ action: GameAction; value: number }> {
  return actions
    .map((action) => ({ action, value: actionValue(state, player, action) }))
    .filter(({ value }) => Number.isFinite(value))
    .sort((left, right) => right.value - left.value || actionKey(left.action).localeCompare(actionKey(right.action)));
}

export function rankHeuristicActions(state: GameState, player: PlayerId): Array<{ action: GameAction; value: number }> {
  return rankActions(state, player, listLegalActions(state, player));
}

export function chooseHeuristicAction(
  state: GameState,
  player: PlayerId,
  random: () => number = secureRandom,
): GameAction | null {
  const ranked = rankHeuristicActions(state, player);
  if (!ranked.length) return null;
  const bestValue = ranked[0].value;
  const equivalent = ranked.filter(({ value }) => Math.abs(value - bestValue) < 0.001);
  return equivalent[Math.floor(random() * equivalent.length)]?.action ?? ranked[0].action;
}

export function chooseRandomLegalAction(
  state: GameState,
  player: PlayerId,
  random: () => number = secureRandom,
): GameAction | null {
  const actions = listLegalActions(state, player);
  if (!actions.length) return null;
  return actions[Math.floor(random() * actions.length)] ?? actions[0];
}

export function runHeuristicOpponentStep(
  state: GameState,
  random: () => number = secureRandom,
): GameState {
  const isAiChoice = state.pendingChoice?.player === 1;
  const isAiTurn = state.activePlayer === 1 && state.isOpponentActing && !state.pendingChoice;
  if (state.pendingMulligan || state.winner !== null || (!isAiChoice && !isAiTurn)) return state;
  const action = chooseHeuristicAction(state, 1, random);
  if (!action) return state;
  const result = applyGameAction(state, action, random);
  if (!result.error) return result.state;
  const endAction = listLegalActions(state, 1).find(({ kind }) => kind === 'end-turn');
  if (!endAction) return state;
  return applyGameAction(state, endAction, random).state;
}
