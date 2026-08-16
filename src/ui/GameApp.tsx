import { useMemo, useState } from 'react';
import { getCard } from '../data/catalog';
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
  onExit: () => void;
}

export function GameApp({ playerDeckId, opponentDeckId, onExit }: GameAppProps) {
  const game = useGame(playerDeckId, opponentDeckId);
  const playerDeck = getDeckPreset(playerDeckId);
  const [hovered, setHovered] = useState<CardInstance | UnitInPlay | null>(null);
  const [selectedHand, setSelectedHand] = useState<CardInstance | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitSelection | null>(null);
  const [selectedUtility, setSelectedUtility] = useState<CardInstance | null>(null);
  const [pendingAttack, setPendingAttack] = useState<number | null>(null);
  const you = game.state.players[0];
  const canAct = game.state.activePlayer === 0 && !game.state.isOpponentActing
    && game.state.winner === null && !game.state.pendingMulligan;
  const canUseHand = game.state.winner === null && !game.state.pendingChoice
    && (canAct || you.hand.some((instance) => getCard(instance.cardId).kind === 'utility' && getCard(instance.cardId).utilityType === 'free'));
  const selectedHandCard = selectedHand ? getCard(selectedHand.cardId) : null;
  const isPlacingUnit = canAct && selectedHandCard?.kind === 'unit';
  const isTargeting = canAct && pendingAttack !== null;
  const selectedAttacks = selectedUnit ? game.attacksFor(selectedUnit.unit.instanceId) : [];
  const selectedSourceId = selectedUnit?.unit.instanceId ?? selectedUtility?.instanceId;
  const selectedAbilities = selectedSourceId
    ? game.abilities.filter(({ sourceInstanceId }) => sourceInstanceId === selectedSourceId)
    : [];
  const detail = hovered ?? selectedHand ?? selectedUnit?.unit ?? selectedUtility ?? null;

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
    if (card.kind === 'energy') game.setNotice(`Ready to play ${card.name}. Confirm the Energy play in Command.`);
    if (card.kind === 'utility') game.setNotice(`Ready to play ${card.name}. Review it, then confirm in Command.`);
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
    if (game.state.winner !== null) return game.state.winner === 0 ? 'RIFT SECURED' : 'SIGNAL LOST';
    if (game.state.pendingMulligan) return 'OPENING HAND';
    if (game.state.isOpponentActing) return 'OPPONENT TURN';
    return 'YOUR TURN';
  }, [game.state.isOpponentActing, game.state.pendingMulligan, game.state.winner]);

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
        <DetailPanel instance={detail} />
        <div className="center-stage">
          <GameBoard state={game.state} selectedUnit={selectedUnit?.address ?? null} selectedHand={selectedHand} selectedUtilityId={selectedUtility?.instanceId} isPlacingUnit={isPlacingUnit} isTargeting={isTargeting} onSlotClick={clickSlot} onHover={setHovered} onPreviewVanquished={setHovered} onSelectVanquished={selectVanquished} onUtilityClick={selectUtility} />
          <ActionDock
            notice={game.notice}
            handSelection={selectedHand}
            unitSelection={selectedUnit}
            utilitySelection={selectedUtility}
            pendingAttack={pendingAttack}
            canAct={canAct}
            attacks={selectedAttacks}
            abilities={selectedAbilities}
            canPlayHand={canUseHand}
            onRotate={() => { if (selectedUnit && game.rotate(selectedUnit.address)) clearSelection(); }}
            onAttack={beginAttack}
            onPlayHand={playSelectedHand}
            onAbility={(sourceInstanceId, abilityId) => { if (game.activateAbility(sourceInstanceId, abilityId)) clearSelection(); }}
            onCancel={clearSelection}
            onEndTurn={() => { clearSelection(); game.endTurn(); }}
          />
          <Hand cards={you.hand} selectedId={selectedHand?.instanceId} disabled={!canUseHand} onHover={setHovered} onSelect={selectHand} />
        </div>
        <GameLog log={game.state.log} roll={game.state.lastRoll} />
      </div>

      <DiceCast roll={game.state.lastRoll} />
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
          <div className="result-card glass"><LogoGlyph size={58} /><span>Match complete</span><h1 id="result-title">{game.state.winner === 0 ? 'Rift secured' : 'Signal lost'}</h1><p>{game.state.winner === 0 ? 'The opposing timeline has collapsed.' : 'The Rift Automaton controls this timeline.'}</p><div className="result-actions"><button type="button" onClick={game.reset}>Play again</button><button type="button" onClick={onExit}>Change deck</button></div></div>
        </div>
      )}
      {game.state.pendingChoice?.player === 0 && <ChoicePanel choice={game.state.pendingChoice} onSubmit={game.choose} />}
    </div>
  );
}
