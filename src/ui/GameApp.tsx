import { useEffect, useMemo, useState } from 'react';
import { getCard } from '../data/catalog';
import type { AiDifficulty } from '../game/ai/types';
import { describeCardModifiers } from '../game/effectRuntime';
import { getDeckPreset } from '../game/deck';
import { useGame } from '../game/useGame';
import type { BoardAddress, CardInstance, UnitInPlay } from '../game/types';
import { ActionDock } from './ActionDock';
import { ChoicePanel } from './ChoicePanel';
import { DetailPanel } from './DetailPanel';
import { DiceCast } from './DiceCast';
import { GameBoard } from './GameBoard';
import { GameLog } from './GameLog';
import { Hand } from './Hand';
import { LogoGlyph } from './MakerGraphics';
import { MulliganPanel } from './MulliganPanel';

interface UnitSelection { address: BoardAddress; unit: UnitInPlay }

interface GameAppProps {
  playerDeckId: string;
  opponentDeckId: string;
  aiDifficulty: AiDifficulty;
  onExit: () => void;
}

export function GameApp({ playerDeckId, opponentDeckId, aiDifficulty, onExit }: GameAppProps) {
  const game = useGame(playerDeckId, opponentDeckId, aiDifficulty);
  const playerDeck = getDeckPreset(playerDeckId);
  const [hovered, setHovered] = useState<CardInstance | UnitInPlay | null>(null);
  const [selectedHand, setSelectedHand] = useState<CardInstance | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitSelection | null>(null);
  const [selectedUtility, setSelectedUtility] = useState<CardInstance | null>(null);
  const [pendingAttack, setPendingAttack] = useState<number | null>(null);
  // The board lags behind the engine while a dice roll animates, so the outcome
  // appears on the field only after the overlay has revealed it (see DiceCast onResolved).
  const [boardState, setBoardState] = useState(game.state);
  const [revealedSeq, setRevealedSeq] = useState<number | null>(null);
  const [dismissedSeq, setDismissedSeq] = useState<number | null>(null);
  useEffect(() => {
    const roll = game.state.lastRoll;
    const holdingForRoll = roll !== null && roll.sequence !== revealedSeq;
    if (!holdingForRoll) setBoardState(game.state);
  }, [game.state, revealedSeq]);
  // Advance the opponent one action at a time so each play and attack lands on its
  // own beat. We wait for the dice overlay of the previous action to be dismissed
  // before the next step, so combat rolls never fly past unseen. Depending on the
  // whole state object re-arms the timer after every step — a setup play changes
  // none of the primitive guards, so keying on those alone would stall the AI.
  const gameState = game.state;
  const { opponentStep } = game;
  useEffect(() => {
    const isAiDecision = gameState.isOpponentActing
      || gameState.pendingChoice?.player === 1
      || gameState.pendingMulligan?.player === 1;
    if (!isAiDecision || gameState.winner !== null || gameState.pendingChoice?.player === 0) return;
    const overlayPending = gameState.lastRoll !== null && gameState.lastRoll.sequence !== dismissedSeq;
    if (overlayPending) return;
    const timer = window.setTimeout(opponentStep, 700);
    return () => window.clearTimeout(timer);
  }, [gameState, dismissedSeq, opponentStep]);
  const you = game.state.players[0];
  const canAct = game.state.activePlayer === 0 && !game.state.isOpponentActing
    && game.state.winner === null && !game.state.pendingMulligan && !game.state.pendingChoice;
  const canUseHand = game.state.winner === null && !game.state.pendingChoice
    && (canAct || you.hand.some((instance) => getCard(instance.cardId).kind === 'utility' && getCard(instance.cardId).utilityType === 'free'));
  const selectedHandCard = selectedHand ? getCard(selectedHand.cardId) : null;
  const isPlacingUnit = canAct && selectedHandCard?.kind === 'unit';
  const isTargeting = canAct && pendingAttack !== null;
  const selectedAttacks = selectedUnit ? game.attacksFor(selectedUnit.unit.instanceId) : [];
  const selectedAttackErrors = selectedUnit
    ? selectedAttacks.map((_, index) => game.attackActionError(selectedUnit.address, index))
    : [];
  const selectedSourceId = selectedUnit?.unit.instanceId ?? selectedUtility?.instanceId;
  const selectedAbilities = selectedSourceId
    ? game.abilities.filter(({ sourceInstanceId }) => sourceInstanceId === selectedSourceId)
    : [];
  const detail = hovered ?? selectedHand ?? selectedUnit?.unit ?? selectedUtility ?? null;
  const detailModifiers = detail && 'currentHp' in detail ? describeCardModifiers(game.state, detail.instanceId) : [];

  // A selected Construction you control in the field can be advanced toward its
  // Completion Cost; the dock shows the counter and grays the action when illegal.
  const constructionEntry = selectedUtility
    ? you.utilities.find((entry) => entry.instanceId === selectedUtility.instanceId)
    : undefined;
  const construction = constructionEntry
    && getCard(constructionEntry.cardId).utilityType === 'construction'
    ? {
        completion: constructionEntry.completion ?? 0,
        target: getCard(constructionEntry.cardId).completionCost ?? 1,
        isDone: constructionEntry.isDone ?? false,
        canAdvance: !game.advanceConstructionActionError(selectedUtility!.instanceId),
      }
    : null;

  const clearSelection = () => {
    setSelectedHand(null);
    setSelectedUnit(null);
    setSelectedUtility(null);
    setPendingAttack(null);
  };

  const selectHand = (instance: CardInstance) => {
    const card = getCard(instance.cardId);
    setHovered(instance);
    setSelectedUnit(null);
    setSelectedUtility(null);
    setPendingAttack(null);
    setSelectedHand(instance);
    if (card.kind === 'unit') game.setNotice('Choose a highlighted Vanguard or Backguard slot.');
    if (card.kind === 'energy') game.setNotice(`Selected ${card.name}. Choose Play Energy to confirm.`);
    if (card.kind === 'utility') game.setNotice(`Selected ${card.name}. Choose Play Utility to confirm.`);
  };

  const playSelectedHand = () => {
    if (!selectedHand || !selectedHandCard) return;
    const played = selectedHandCard.kind === 'energy'
      ? game.playEnergy(selectedHand.instanceId)
      : selectedHandCard.kind === 'utility' && game.playUtility(selectedHand.instanceId);
    if (played) clearSelection();
  };

  const selectUtility = (instance: CardInstance, playerId: 0 | 1) => {
    setHovered(instance);
    setSelectedHand(null);
    setSelectedUnit(null);
    setSelectedUtility(instance);
    setPendingAttack(null);
    const card = getCard(instance.cardId);
    game.setNotice(playerId === 0 ? `Choose an action for ${card.name}.` : `Inspecting opposing ${card.name}.`);
  };

  const selectVanquished = (instance: CardInstance) => {
    setHovered(instance);
    setSelectedHand(null);
    setSelectedUnit(null);
    setSelectedUtility(null);
    setPendingAttack(null);
    game.setNotice(`Inspecting ${getCard(instance.cardId).name} from the Vanquished Pile.`);
  };

  const findUnit = (address: BoardAddress) => game.state.players[address.player][address.row][address.index];
  const clickSlot = (address: BoardAddress) => {
    const unit = findUnit(address);
    if (isPlacingUnit && address.player === 0 && !unit && selectedHand) {
      if (game.playUnit(address, selectedHand.instanceId)) clearSelection();
      return;
    }
    if (isTargeting && address.player === 1 && address.row === 'vanguard' && unit && selectedUnit) {
      if (game.attack(selectedUnit.address, pendingAttack!, address)) clearSelection();
      return;
    }
    if (unit) {
      setSelectedUnit({ address, unit });
      setSelectedHand(null);
      setSelectedUtility(null);
      setPendingAttack(null);
      setHovered(unit);
      game.setNotice(address.player === 0 ? `Choose an action for ${getCard(unit.cardId).name}.` : `${getCard(unit.cardId).name} is in the opposing ${address.row}.`);
    }
  };

  const beginAttack = (attackIndex: number) => {
    if (!selectedUnit || selectedUnit.address.player !== 0) return;
    const attack = selectedAttacks[attackIndex]?.attack;
    if (!attack) return;
    if (!/^\d/.test(attack.damage)) {
      if (game.attack(selectedUnit.address, attackIndex, null)) clearSelection();
      return;
    }
    const enemyHasUnits = [...game.state.players[1].vanguard, ...game.state.players[1].backguard].some(Boolean);
    if (!enemyHasUnits) {
      if (game.attack(selectedUnit.address, attackIndex, null)) clearSelection();
      return;
    }
    setPendingAttack(attackIndex);
    game.setNotice('Choose a highlighted opposing Vanguard Unit.');
  };

  const topPrompt = useMemo(() => {
    if (game.state.winner !== null) return game.state.winner === 0 ? 'YOU WIN' : 'YOU LOSE';
    if (game.state.pendingMulligan) return 'OPENING HAND';
    if (game.aiThinking) return 'OPPONENT THINKING';
    if (game.state.isOpponentActing) return 'OPPONENT TURN';
    return 'YOUR TURN';
  }, [game.aiThinking, game.state.isOpponentActing, game.state.pendingMulligan, game.state.winner]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to battlefield</a>
      <div className="cosmos" aria-hidden="true"><span className="nebula one" /><span className="nebula two" /><span className="grid-plane" /></div>
      <header className="topbar glass">
        <div className="brand"><LogoGlyph size={34} /><div><span>HYPERVERSE</span><small>TRADING CARD GAME</small></div></div>
        <div className="match-state"><span className="round">ROUND {game.state.round}</span><strong>{topPrompt}</strong><span className="format">{playerDeck.name} · SOLO</span></div>
        <div className="header-actions"><button type="button" onClick={onExit}>Main menu</button><button type="button" onClick={game.reset}>Restart match</button></div>
      </header>

      <div className="game-grid">
        <DetailPanel instance={detail} modifiers={detailModifiers} />
        <div className="center-stage">
          <GameBoard state={boardState} selectedUnit={selectedUnit?.address ?? null} selectedHand={selectedHand} selectedUtilityId={selectedUtility?.instanceId} isPlacingUnit={isPlacingUnit} isTargeting={isTargeting} onSlotClick={clickSlot} onHover={setHovered} onPreviewVanquished={setHovered} onSelectVanquished={selectVanquished} onUtilityClick={selectUtility} />
          <ActionDock
            notice={game.notice}
            handSelection={selectedHand}
            unitSelection={selectedUnit}
            utilitySelection={selectedUtility}
            pendingAttack={pendingAttack}
            canAct={canAct}
            construction={construction}
            attacks={selectedAttacks}
            attackErrors={selectedAttackErrors}
            abilities={selectedAbilities}
            canPlayHand={Boolean(selectedHand && !game.handActionError(selectedHand.instanceId))}
            canRotate={Boolean(selectedUnit && !game.rotateActionError(selectedUnit.address))}
            onRotate={() => { if (selectedUnit && game.rotate(selectedUnit.address)) clearSelection(); }}
            onAttack={beginAttack}
            onPlayHand={playSelectedHand}
            onAbility={(sourceInstanceId, abilityId) => { if (game.activateAbility(sourceInstanceId, abilityId)) clearSelection(); }}
            onAdvanceConstruction={() => { if (selectedUtility && game.advanceConstruction(selectedUtility.instanceId)) clearSelection(); }}
            onCancel={clearSelection}
            onEndTurn={() => { clearSelection(); game.endTurn(); }}
          />
          <Hand cards={you.hand} selectedId={selectedHand?.instanceId} disabled={!canUseHand} onHover={setHovered} onSelect={selectHand} />
        </div>
        <GameLog log={game.state.log} roll={game.state.lastRoll} />
      </div>

      <DiceCast roll={game.state.lastRoll} onResolved={setRevealedSeq} onDismiss={setDismissedSeq} />
      {game.state.pendingMulligan?.player === 0 && (
        <MulliganPanel
          cards={you.hand}
          maxCards={game.state.pendingMulligan.maxCards}
          onHover={setHovered}
          onSubmit={game.mulligan}
        />
      )}
      {game.state.winner !== null && (
        <div className="result-overlay" role="dialog" aria-modal="true" aria-labelledby="result-title">
          <div className="result-card glass"><LogoGlyph size={58} /><span>Match complete</span><h1 id="result-title">{game.state.winner === 0 ? 'You win' : 'You lose'}</h1><p>{game.state.winner === 0 ? 'The opponent has no HP remaining.' : 'You have no HP remaining.'}</p><div className="result-actions"><button type="button" onClick={game.reset}>Play again</button><button type="button" onClick={onExit}>Change deck</button></div></div>
        </div>
      )}
      {game.state.pendingChoice?.player === 0 && <ChoicePanel choice={game.state.pendingChoice} onSubmit={game.choose} />}
    </div>
  );
}
