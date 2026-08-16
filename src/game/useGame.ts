import { useCallback, useEffect, useState } from 'react';
import { getCard } from '../data/catalog';
import {
  activateAbility, attackActionError, availableActivatedAbilities, availableAttacks, chooseEffect, createGame,
  endPlayerTurn, mulliganOpeningHand, playEnergy, playEnergyActionError, playUnit, playUtility,
  playUtilityActionError, rotateUnit, rotateUnitActionError, runOpponentTurn, useAttack,
} from './engine';
import type { BoardAddress, GameResult, GameState } from './types';

export function useGame(playerDeckId: string, opponentDeckId: string) {
  const createSelectedGame = useCallback(
    () => createGame({ playerDeckId, opponentDeckId }),
    [opponentDeckId, playerDeckId],
  );
  const [state, setState] = useState<GameState>(createSelectedGame);
  const [notice, setNotice] = useState('Choose up to three opening cards to mulligan, or keep all seven.');

  const apply = useCallback((result: GameResult, successNotice = 'Action resolved.') => {
    if (result.error) {
      setNotice(result.error);
      return false;
    }
    setState(result.state);
    setNotice(successNotice);
    return true;
  }, []);

  useEffect(() => {
    if (!state.isOpponentActing || state.winner !== null || state.pendingChoice) return;
    const timer = window.setTimeout(() => setState((current) => runOpponentTurn(current)), 850);
    return () => window.clearTimeout(timer);
  }, [state.isOpponentActing, state.pendingChoice, state.winner]);

  return {
    state,
    notice,
    setNotice,
    reset: () => { setState(createSelectedGame()); setNotice('Choose up to three opening cards to mulligan, or keep all seven.'); },
    mulligan: (selectedIds: readonly string[]) => apply(
      mulliganOpeningHand(state, selectedIds),
      selectedIds.length === 0
        ? 'Opening hand kept. Your first turn begins.'
        : `Mulligan complete. Replaced ${selectedIds.length} card${selectedIds.length === 1 ? '' : 's'}.`,
    ),
    playEnergy: (instanceId: string) => apply(playEnergy(state, 0, instanceId)),
    playUnit: (address: BoardAddress, instanceId: string) => apply(playUnit(state, address, instanceId)),
    playUtility: (instanceId: string) => apply(playUtility(state, 0, instanceId)),
    rotate: (address: BoardAddress) => apply(rotateUnit(state, address)),
    rotateActionError: (address: BoardAddress) => rotateUnitActionError(state, address),
    attack: (source: BoardAddress, attackIndex: number, target: BoardAddress | null) => apply(useAttack(state, source, attackIndex, target)),
    attackActionError: (source: BoardAddress, attackIndex: number) => attackActionError(state, source, attackIndex),
    attacksFor: (instanceId: string) => availableAttacks(state, instanceId),
    handActionError: (instanceId: string) => {
      const held = state.players[0].hand.find((card) => card.instanceId === instanceId);
      if (!held) return 'That card is no longer in your hand.';
      return getCard(held.cardId).kind === 'energy'
        ? playEnergyActionError(state, 0, instanceId)
        : playUtilityActionError(state, 0, instanceId);
    },
    abilities: availableActivatedAbilities(state, 0),
    activateAbility: (sourceInstanceId: string, abilityId: string) => apply(activateAbility(state, 0, sourceInstanceId, abilityId)),
    choose: (selectedIds: readonly string[]) => apply(chooseEffect(state, selectedIds)),
    endTurn: () => apply(endPlayerTurn(state)),
  };
}
