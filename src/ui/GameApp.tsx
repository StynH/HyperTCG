import { useMemo, useState } from 'react';
import { getCard } from '../data/catalog';
import { useGame } from '../game/useGame';
import type { BoardAddress, CardInstance, UnitInPlay } from '../game/types';
import { ActionDock } from './ActionDock';
import { ChoicePanel } from './ChoicePanel';
import { DetailPanel } from './DetailPanel';
import { GameBoard } from './GameBoard';
import { GameLog } from './GameLog';
import { Hand } from './Hand';
import { LogoGlyph } from './MakerGraphics';

interface UnitSelection { address: BoardAddress; unit: UnitInPlay }

export function GameApp() {
  const game = useGame();
  const [hovered, setHovered] = useState<CardInstance | UnitInPlay | null>(null);
  const [selectedHand, setSelectedHand] = useState<CardInstance | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitSelection | null>(null);
  const [pendingAttack, setPendingAttack] = useState<number | null>(null);
  const you = game.state.players[0];
  const canAct = game.state.activePlayer === 0 && !game.state.isOpponentActing && game.state.winner === null;
  const canUseHand = game.state.winner === null && !game.state.pendingChoice
    && (canAct || you.hand.some((instance) => getCard(instance.cardId).kind === 'utility' && getCard(instance.cardId).utilityType === 'free'));
  const selectedHandCard = selectedHand ? getCard(selectedHand.cardId) : null;
  const isPlacingUnit = canAct && selectedHandCard?.kind === 'unit';
  const isTargeting = canAct && pendingAttack !== null;
  const selectedAttacks = selectedUnit ? game.attacksFor(selectedUnit.unit.instanceId) : [];
  const detail = hovered ?? selectedHand ?? selectedUnit?.unit ?? null;

  const clearSelection = () => {
    setSelectedHand(null);
    setSelectedUnit(null);
    setPendingAttack(null);
  };

  const selectHand = (instance: CardInstance) => {
    const card = getCard(instance.cardId);
    setHovered(instance);
    setSelectedUnit(null);
    setPendingAttack(null);
    if (card.kind === 'energy') {
      setSelectedHand(null);
      game.playEnergy(instance.instanceId);
      return;
    }
    if (card.kind === 'utility') {
      setSelectedHand(null);
      game.playUtility(instance.instanceId);
      return;
    }
    setSelectedHand(instance);
    game.setNotice('Choose a highlighted Vanguard or Backguard slot.');
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
    if (game.state.isOpponentActing) return 'OPPONENT TURN';
    return 'YOUR TURN';
  }, [game.state.isOpponentActing, game.state.winner]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to battlefield</a>
      <div className="cosmos" aria-hidden="true"><span className="nebula one" /><span className="nebula two" /><span className="grid-plane" /></div>
      <header className="topbar glass">
        <div className="brand"><LogoGlyph size={34} /><div><span>HYPERVERSE</span><small>TRADING CARD GAME</small></div></div>
        <div className="match-state"><span className="round">ROUND {game.state.round}</span><strong>{topPrompt}</strong><span className="format">ORIG · SOLO</span></div>
        <div className="header-actions"><button type="button" onClick={game.reset}>Restart match</button></div>
      </header>

      <div className="game-grid">
        <DetailPanel instance={detail} />
        <div className="center-stage">
          <GameBoard state={game.state} selectedUnit={selectedUnit?.address ?? null} selectedHand={selectedHand} isPlacingUnit={isPlacingUnit} isTargeting={isTargeting} onSlotClick={clickSlot} onHover={setHovered} />
          <ActionDock
            notice={game.notice}
            handSelection={selectedHand}
            unitSelection={selectedUnit}
            pendingAttack={pendingAttack}
            canAct={canAct}
            attacks={selectedAttacks}
            abilities={game.abilities}
            onRotate={() => { if (selectedUnit && game.rotate(selectedUnit.address)) clearSelection(); }}
            onAttack={beginAttack}
            onAbility={(sourceInstanceId, abilityId) => { if (game.activateAbility(sourceInstanceId, abilityId)) clearSelection(); }}
            onCancel={clearSelection}
            onEndTurn={() => { clearSelection(); game.endTurn(); }}
          />
          <Hand cards={you.hand} selectedId={selectedHand?.instanceId} disabled={!canUseHand} onHover={setHovered} onSelect={selectHand} />
        </div>
        <GameLog log={game.state.log} roll={game.state.lastRoll} />
      </div>

      {game.state.winner !== null && (
        <div className="result-overlay" role="dialog" aria-modal="true" aria-labelledby="result-title">
          <div className="result-card glass"><LogoGlyph size={58} /><span>Match complete</span><h1 id="result-title">{game.state.winner === 0 ? 'Rift secured' : 'Signal lost'}</h1><p>{game.state.winner === 0 ? 'The opposing timeline has collapsed.' : 'The Rift Automaton controls this timeline.'}</p><button type="button" onClick={game.reset}>Play again</button></div>
        </div>
      )}
      {game.state.pendingChoice?.player === 0 && <ChoicePanel choice={game.state.pendingChoice} onSubmit={game.choose} />}
    </div>
  );
}
