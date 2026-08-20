import { useCallback, useMemo, useState } from 'react';
import { getCard } from '../data/catalog';
import {
  activateAbility, advanceConstruction, advanceConstructionActionError, attackActionError,
  availableActivatedAbilities, availableAttacks, chooseEffect, createGame, endPlayerTurn,
  mulliganOpeningHand, playEnergy, playEnergyActionError, playUnit, playUtility,
  playUtilityActionError, rotateUnit, rotateUnitActionError, useAttack,
} from './engine';
import { mulliganStrategicOpeningHand, runStrategicOpponentStep } from './ai/strategicOpponent';
import type { AiDifficulty } from './ai/types';
import { getDeckPreset } from './deck';
import type { BoardAddress, GameResult, GameState } from './types';

export function useGame(playerDeckId: string, opponentDeckId: string, aiDifficulty: AiDifficulty) {
  const createSelectedGame = useCallback(
    () => createGame({ playerDeckId, opponentDeckId }),
    [opponentDeckId, playerDeckId],
  );
  const opponentSearchOptions = useMemo(() => ({
    knownPlayerDeck: getDeckPreset(playerDeckId).entries,
    aiDeck: getDeckPreset(opponentDeckId).entries,
    difficulty: aiDifficulty,
  }), [aiDifficulty, opponentDeckId, playerDeckId]);
  const [state, setState] = useState<GameState>(createSelectedGame);
  const [notice, setNotice] = useState('Choose up to three opening cards to mulligan, or keep all seven.');
  const opponentStep = useCallback(() => setState((current) => (
    runStrategicOpponentStep(current, opponentSearchOptions)
  )), [opponentSearchOptions]);

  const apply = useCallback((result: GameResult, successNotice = 'Done.') => {
    if (result.error) {
      setNotice(result.error);
      return false;
    }
    setState(result.state);
    setNotice(successNotice);
    return true;
  }, []);

  return {
    state,
    notice,
    setNotice,
    opponentStep,
    reset: () => { setState(createSelectedGame()); setNotice('Choose up to three opening cards to mulligan, or keep all seven.'); },
    mulligan: (selectedIds: readonly string[]) => {
      const humanResult = mulliganOpeningHand(state, selectedIds);
      if (humanResult.error) return apply(humanResult);
      return apply(
        { state: mulliganStrategicOpeningHand(humanResult.state, opponentSearchOptions) },
        selectedIds.length === 0
          ? 'Opening hands kept. Your first turn begins.'
          : `Mulligan complete. Replaced ${selectedIds.length} card${selectedIds.length === 1 ? '' : 's'}.`,
      );
    },
    playEnergy: (instanceId: string) => apply(playEnergy(state, 0, instanceId), 'Energy played.'),
    playUnit: (address: BoardAddress, instanceId: string) => apply(playUnit(state, address, instanceId), 'Unit played.'),
    playUtility: (instanceId: string) => apply(playUtility(state, 0, instanceId), 'Utility played.'),
    rotate: (address: BoardAddress) => apply(rotateUnit(state, address), 'Unit rotated.'),
    rotateActionError: (address: BoardAddress) => rotateUnitActionError(state, address),
    attack: (source: BoardAddress, attackIndex: number, target: BoardAddress | null) => apply(useAttack(state, source, attackIndex, target), 'Attack complete.'),
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
    activateAbility: (sourceInstanceId: string, abilityId: string) => apply(activateAbility(state, 0, sourceInstanceId, abilityId), 'Ability used.'),
    advanceConstruction: (instanceId: string) => apply(advanceConstruction(state, 0, instanceId), 'Construction advanced.'),
    advanceConstructionActionError: (instanceId: string) => advanceConstructionActionError(state, 0, instanceId),
    choose: (selectedIds: readonly string[]) => apply(chooseEffect(state, selectedIds), 'Choice confirmed.'),
    endTurn: () => apply(endPlayerTurn(state)),
  };
}
