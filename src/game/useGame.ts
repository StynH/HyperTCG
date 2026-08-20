import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCard } from '../data/catalog';
import {
  activateAbility, advanceConstruction, advanceConstructionActionError, attackActionError,
  availableActivatedAbilities, availableAttacks, chooseEffect, createGame, endPlayerTurn,
  mulliganOpeningHand, playEnergy, playEnergyActionError, playUnit, playUtility,
  playUtilityActionError, rotateUnit, rotateUnitActionError, useAttack,
} from './engine';
import { applyGameAction } from './actions';
import { createKnownDeckObservation } from './ai/belief';
import { nextSeed } from './ai/random';
import { prepareStrategicOpeningMulligan, runStrategicOpponentStep } from './ai/strategicOpponent';
import type { AiDifficulty } from './ai/types';
import type { AiSearchRequest, AiSearchResponse } from './ai/workerProtocol';
import { getDeckPreset } from './deck';
import { secureRandom } from './random';
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
  const [aiThinking, setAiThinking] = useState(false);
  const stateRef = useRef(state);
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  stateRef.current = state;

  const cancelAiSearch = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    requestIdRef.current += 1;
    setAiThinking(false);
  }, []);
  useEffect(() => cancelAiSearch, [cancelAiSearch]);

  const opponentStep = useCallback(() => {
    if (workerRef.current) return;
    const requestedState = stateRef.current;
    if (typeof Worker === 'undefined') {
      setState((current) => runStrategicOpponentStep(current, opponentSearchOptions));
      return;
    }

    const requestId = ++requestIdRef.current;
    const worker = new Worker(new URL('./ai/search.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;
    setAiThinking(true);
    const finish = () => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      setAiThinking(false);
    };
    worker.onmessage = ({ data }: MessageEvent<AiSearchResponse>) => {
      if (data.requestId !== requestId) return;
      finish();
      if (stateRef.current === requestedState && requestedState.pendingMulligan?.player === 1) {
        setNotice('Opening hands complete. Your first turn begins.');
      }
      setState((current) => {
        if (current !== requestedState) return current;
        if (data.error || !data.action) return runStrategicOpponentStep(current, opponentSearchOptions);
        const result = applyGameAction(current, data.action);
        return result.error ? runStrategicOpponentStep(current, opponentSearchOptions) : result.state;
      });
    };
    worker.onerror = () => {
      finish();
      setState((current) => (
        current === requestedState ? runStrategicOpponentStep(current, opponentSearchOptions) : current
      ));
    };
    const request: AiSearchRequest = {
      requestId,
      state: createKnownDeckObservation(
        requestedState,
        1,
        opponentSearchOptions.knownPlayerDeck,
        opponentSearchOptions.aiDeck,
      ),
      options: opponentSearchOptions,
      seed: nextSeed(secureRandom),
    };
    worker.postMessage(request);
  }, [opponentSearchOptions]);

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
    aiThinking,
    setNotice,
    opponentStep,
    reset: () => {
      cancelAiSearch();
      setState(createSelectedGame());
      setNotice('Choose up to three opening cards to mulligan, or keep all seven.');
    },
    mulligan: (selectedIds: readonly string[]) => {
      const humanResult = mulliganOpeningHand(state, selectedIds);
      if (humanResult.error) return apply(humanResult);
      return apply(
        { state: prepareStrategicOpeningMulligan(humanResult.state) },
        selectedIds.length === 0
          ? 'Opening hand kept. Opponent is choosing its opening hand.'
          : `Replaced ${selectedIds.length} card${selectedIds.length === 1 ? '' : 's'}. Opponent is choosing its opening hand.`,
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
