import { actionKey, listLegalActions, type GameAction } from '../actions';
import type { GameState, PlayerId } from '../types';
import { rankActions } from './heuristicOpponent';

export function boundedCandidates(state: GameState, player: PlayerId, limit: number): GameAction[] {
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
