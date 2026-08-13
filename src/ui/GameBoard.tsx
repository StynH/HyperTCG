import type { BoardAddress, CardInstance, GameState, UnitInPlay } from '../game/types';
import { EnergyZone } from './EnergyZone';
import { OpponentHand } from './Hand';
import { PlayerBanner } from './PlayerBanner';
import { UnitRows, UtilityZone } from './BoardRows';

interface GameBoardProps {
  state: GameState;
  selectedUnit: BoardAddress | null;
  selectedHand: CardInstance | null;
  isPlacingUnit: boolean;
  isTargeting: boolean;
  onSlotClick: (address: BoardAddress) => void;
  onHover: (instance: CardInstance | UnitInPlay) => void;
}

export function GameBoard(props: GameBoardProps) {
  const [you, opponent] = props.state.players;
  return (
    <main className="battlefield" id="main-content">
      <div className="opponent-topline">
        <PlayerBanner player={opponent} opponent active={props.state.activePlayer === 1} />
        <OpponentHand count={opponent.hand.length} />
        <EnergyZone energies={opponent.energies} />
      </div>
      <div className="board-half opponent-half">
        <UtilityZone cards={opponent.utilities} onHover={props.onHover} />
        <UnitRows player={opponent} playerId={1} reversed selected={props.selectedUnit} targetMode={props.isTargeting} onSlotClick={props.onSlotClick} onHover={props.onHover} />
      </div>
      <div className="rift-divider"><span /><b>THE RIFT</b><span /></div>
      <div className="board-half player-half">
        <UnitRows player={you} playerId={0} selected={props.selectedUnit} legalUnitPlacement={props.isPlacingUnit} onSlotClick={props.onSlotClick} onHover={props.onHover} />
        <UtilityZone cards={you.utilities} onHover={props.onHover} />
      </div>
      <div className="player-topline">
        <PlayerBanner player={you} active={props.state.activePlayer === 0} />
        <EnergyZone energies={you.energies} />
      </div>
    </main>
  );
}
