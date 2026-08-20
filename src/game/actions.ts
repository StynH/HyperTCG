import { getCard } from '../data/catalog';
import {
  activateAbility, advanceConstruction, advanceConstructionActionError, attackActionError,
  availableActivatedAbilities, availableAttacks, availableAttackTargets, chooseEffect, endTurn,
  mulliganOpeningHand, playEnergy, playEnergyActionError, playUnit, playUnitActionError,
  playUtility, playUtilityActionError, rotateUnit, rotateUnitActionError, useAttack,
} from './engine';
import { secureRandom } from './random';
import type { BoardAddress, GameResult, GameState, PendingChoice, PlayerId } from './types';

export type GameAction =
  | { kind: 'mulligan'; player: PlayerId; selectedIds: readonly string[] }
  | { kind: 'play-energy'; player: PlayerId; instanceId: string }
  | { kind: 'play-unit'; player: PlayerId; instanceId: string; destination: BoardAddress }
  | { kind: 'play-utility'; player: PlayerId; instanceId: string }
  | { kind: 'advance-construction'; player: PlayerId; instanceId: string }
  | { kind: 'rotate-unit'; player: PlayerId; source: BoardAddress }
  | { kind: 'activate-ability'; player: PlayerId; sourceInstanceId: string; abilityId: string }
  | { kind: 'attack'; player: PlayerId; source: BoardAddress; attackIndex: number; target: BoardAddress | null }
  | { kind: 'resolve-choice'; player: PlayerId; choiceId: string; selectedIds: readonly string[] }
  | { kind: 'end-turn'; player: PlayerId };

export interface LegalActionOptions {
  maxChoiceActions?: number;
}

const DEFAULT_MAX_CHOICE_ACTIONS = 512;

function collectSelections(
  optionIds: readonly string[],
  size: number,
  ordered: boolean,
  limit: number,
): string[][] {
  const selections: string[][] = [];
  const visit = (selected: string[], remaining: string[], start: number) => {
    if (selections.length >= limit) return;
    if (selected.length === size) {
      selections.push(selected);
      return;
    }
    for (let index = ordered ? 0 : start; index < remaining.length; index += 1) {
      const id = remaining[index];
      const nextRemaining = ordered
        ? [...remaining.slice(0, index), ...remaining.slice(index + 1)]
        : remaining;
      visit([...selected, id], nextRemaining, ordered ? 0 : index + 1);
      if (selections.length >= limit) return;
    }
  };
  visit([], [...optionIds], 0);
  return selections;
}

function choiceActions(choice: PendingChoice, maxActions: number): GameAction[] {
  const optionIds = choice.options.map(({ id }) => id);
  return selectionSets(optionIds, choice.min, choice.max, choice.ordered, maxActions).map((selectedIds) => ({
    kind: 'resolve-choice' as const,
    player: choice.player,
    choiceId: choice.id,
    selectedIds,
  }));
}

function selectionSets(
  optionIds: readonly string[],
  min: number,
  max: number,
  ordered: boolean,
  limit: number,
): string[][] {
  // Materializing every permutation can explode for large searches. Always expose
  // the legal minimum and maximum boundaries, then fill a stable bounded frontier;
  // later search implementations can progressively widen this same action surface.
  const selections: string[][] = [];
  const seen = new Set<string>();
  const add = (selectedIds: string[]) => {
    const key = selectedIds.join('\u0000');
    if (selections.length >= limit || seen.has(key)) return;
    seen.add(key);
    selections.push(selectedIds);
  };
  if (min === 0) add([]);
  if (max > min) {
    add(optionIds.slice(0, max));
    if (ordered) add(optionIds.slice(-max).reverse());
  }
  for (let size = min; size <= max && selections.length < limit; size += 1) {
    for (const selectedIds of collectSelections(optionIds, size, ordered, limit - selections.length)) add(selectedIds);
  }
  return selections;
}

function mulliganActions(state: GameState, player: PlayerId): GameAction[] {
  const pending = state.pendingMulligan;
  if (!pending || pending.player !== player) return [];
  const optionIds = state.players[player].hand.map(({ instanceId }) => instanceId);
  return selectionSets(optionIds, 0, pending.maxCards, false, Number.POSITIVE_INFINITY).map((selectedIds) => ({
    kind: 'mulligan',
    player,
    selectedIds,
  }));
}

function boardAddresses(player: PlayerId): BoardAddress[] {
  return (['vanguard', 'backguard'] as const).flatMap((row) => (
    Array.from({ length: 5 }, (_, index) => ({ player, row, index }))
  ));
}

function ordinaryActions(state: GameState, player: PlayerId): GameAction[] {
  if (state.activePlayer !== player || state.winner !== null) return [];
  const actions: GameAction[] = [];
  const playerState = state.players[player];

  for (const held of playerState.hand) {
    const card = getCard(held.cardId);
    if (card.kind === 'energy' && !playEnergyActionError(state, player, held.instanceId)) {
      actions.push({ kind: 'play-energy', player, instanceId: held.instanceId });
    }
    if (card.kind === 'unit') {
      for (const destination of boardAddresses(player)) {
        if (!playUnitActionError(state, destination, held.instanceId)) {
          actions.push({ kind: 'play-unit', player, instanceId: held.instanceId, destination });
        }
      }
    }
    if (card.kind === 'utility' && !playUtilityActionError(state, player, held.instanceId)) {
      actions.push({ kind: 'play-utility', player, instanceId: held.instanceId });
    }
  }

  for (const utility of playerState.utilities) {
    if (!advanceConstructionActionError(state, player, utility.instanceId)) {
      actions.push({ kind: 'advance-construction', player, instanceId: utility.instanceId });
    }
  }

  for (const source of boardAddresses(player)) {
    if (!rotateUnitActionError(state, source)) actions.push({ kind: 'rotate-unit', player, source });
    const unit = playerState[source.row][source.index];
    if (!unit) continue;
    for (let attackIndex = 0; attackIndex < availableAttacks(state, unit.instanceId).length; attackIndex += 1) {
      if (attackActionError(state, source, attackIndex)) continue;
      for (const target of availableAttackTargets(state, source, attackIndex)) {
        actions.push({ kind: 'attack', player, source, attackIndex, target });
      }
    }
  }

  for (const ability of availableActivatedAbilities(state, player)) {
    actions.push({
      kind: 'activate-ability',
      player,
      sourceInstanceId: ability.sourceInstanceId,
      abilityId: ability.abilityId,
    });
  }

  actions.push({ kind: 'end-turn', player });
  return actions;
}

export function listLegalActions(
  state: GameState,
  player: PlayerId,
  options: LegalActionOptions = {},
): GameAction[] {
  if (state.pendingMulligan) return mulliganActions(state, player);
  if (state.pendingChoice) {
    if (state.pendingChoice.player !== player) return [];
    return choiceActions(state.pendingChoice, options.maxChoiceActions ?? DEFAULT_MAX_CHOICE_ACTIONS);
  }
  return ordinaryActions(state, player);
}

function mismatchedPlayer(state: GameState, action: GameAction): GameResult {
  return { state, error: `Action player ${action.player} does not match its board address.` };
}

export function applyGameAction(
  state: GameState,
  action: GameAction,
  random: () => number = secureRandom,
): GameResult {
  switch (action.kind) {
    case 'mulligan':
      if (state.pendingMulligan?.player !== action.player) return { state, error: 'That player cannot mulligan now.' };
      return mulliganOpeningHand(state, action.selectedIds, random);
    case 'play-energy':
      return playEnergy(state, action.player, action.instanceId);
    case 'play-unit':
      if (action.destination.player !== action.player) return mismatchedPlayer(state, action);
      return playUnit(state, action.destination, action.instanceId);
    case 'play-utility':
      return playUtility(state, action.player, action.instanceId);
    case 'advance-construction':
      return advanceConstruction(state, action.player, action.instanceId);
    case 'rotate-unit':
      if (action.source.player !== action.player) return mismatchedPlayer(state, action);
      return rotateUnit(state, action.source);
    case 'activate-ability':
      return activateAbility(state, action.player, action.sourceInstanceId, action.abilityId);
    case 'attack':
      if (action.source.player !== action.player) return mismatchedPlayer(state, action);
      return useAttack(state, action.source, action.attackIndex, action.target, random);
    case 'resolve-choice':
      if (state.pendingChoice?.id !== action.choiceId || state.pendingChoice.player !== action.player) {
        return { state, error: 'That choice is no longer available to this player.' };
      }
      return chooseEffect(state, action.selectedIds, random);
    case 'end-turn':
      return endTurn(state, action.player, random);
  }
}

export function actionKey(action: GameAction): string {
  switch (action.kind) {
    case 'mulligan': return `mulligan:${action.selectedIds.join(',')}`;
    case 'play-energy': return `energy:${action.instanceId}`;
    case 'play-unit': return `unit:${action.instanceId}:${action.destination.row}:${action.destination.index}`;
    case 'play-utility': return `utility:${action.instanceId}`;
    case 'advance-construction': return `construction:${action.instanceId}`;
    case 'rotate-unit': return `rotate:${action.source.row}:${action.source.index}`;
    case 'activate-ability': return `ability:${action.sourceInstanceId}:${action.abilityId}`;
    case 'attack': return `attack:${action.source.row}:${action.source.index}:${action.attackIndex}:${action.target?.row ?? 'player'}:${action.target?.index ?? -1}`;
    case 'resolve-choice': return `choice:${action.choiceId}:${action.selectedIds.join(',')}`;
    case 'end-turn': return 'end-turn';
  }
}
