import { useCallback, useEffect, useState } from 'react';
import {
  activateAbility, availableActivatedAbilities, availableAttacks, chooseEffect, createGame,
  endPlayerTurn, playEnergy, playUnit, playUtility, rotateUnit, runOpponentTurn, useAttack,
} from './engine';
import type { BoardAddress, GameResult, GameState } from './types';

export function useGame() {
  const [state, setState] = useState<GameState>(createGame);
  const [notice, setNotice] = useState('Click Energy or Utility to play it. Click a Unit, then choose its highlighted slot.');

  const apply = useCallback((result: GameResult) => {
    if (result.error) {
      setNotice(result.error);
      return false;
    }
    setState(result.state);
    setNotice('Action resolved.');
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
    reset: () => { setState(createGame()); setNotice('New match initialized.'); },
    playEnergy: (instanceId: string) => apply(playEnergy(state, 0, instanceId)),
    playUnit: (address: BoardAddress, instanceId: string) => apply(playUnit(state, address, instanceId)),
    playUtility: (instanceId: string) => apply(playUtility(state, 0, instanceId)),
    rotate: (address: BoardAddress) => apply(rotateUnit(state, address)),
    attack: (source: BoardAddress, attackIndex: number, target: BoardAddress | null) => apply(useAttack(state, source, attackIndex, target)),
    attacksFor: (instanceId: string) => availableAttacks(state, instanceId),
    abilities: availableActivatedAbilities(state, 0),
    activateAbility: (sourceInstanceId: string, abilityId: string) => apply(activateAbility(state, 0, sourceInstanceId, abilityId)),
    choose: (selectedIds: readonly string[]) => apply(chooseEffect(state, selectedIds)),
    endTurn: () => apply(endPlayerTurn(state)),
  };
}
