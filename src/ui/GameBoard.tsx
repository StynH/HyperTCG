import type { BoardAddress, CardInstance, GameState, UnitInPlay } from '../game/types';
import { EnergyZone } from './EnergyZone';
import { OpponentHand } from './Hand';
import { PlayerBanner } from './PlayerBanner';
import { UnitRows, UtilityZone } from './BoardRows';
import { VanquishedPile } from './VanquishedPile';

interface GameBoardProps {
  state: GameState;
  selectedUnit: BoardAddress | null;
  selectedHand: CardInstance | null;
  selectedUtilityId?: string;
  isPlacingUnit: boolean;
  isTargeting: boolean;
  onSlotClick: (address: BoardAddress) => void;
  onHover: (instance: CardInstance | UnitInPlay) => void;
  onPreviewVanquished: (instance: CardInstance) => void;
  onSelectVanquished: (instance: CardInstance) => void;
  onUtilityClick: (instance: GameState['players'][number]['utilities'][number], playerId: 0 | 1) => void;
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
        <div className="zone-strip">
          <UtilityZone cards={opponent.utilities} playerId={1} selectedId={props.selectedUtilityId} onHover={props.onHover} onClick={props.onUtilityClick} />
          <VanquishedPile cards={opponent.vanquished} playerName={opponent.name} onPreview={props.onPreviewVanquished} onSelect={props.onSelectVanquished} />
        </div>
        <UnitRows state={props.state} player={opponent} playerId={1} reversed selected={props.selectedUnit} targetMode={props.isTargeting} selectedUtilityId={props.selectedUtilityId} onSlotClick={props.onSlotClick} onHover={props.onHover} onUtilityClick={props.onUtilityClick} />
      </div>
      <div className="rift-divider"><span /><b>THE RIFT</b><span /></div>
      <div className="board-half player-half">
        <UnitRows state={props.state} player={you} playerId={0} selected={props.selectedUnit} legalUnitPlacement={props.isPlacingUnit} selectedUtilityId={props.selectedUtilityId} onSlotClick={props.onSlotClick} onHover={props.onHover} onUtilityClick={props.onUtilityClick} />
        <div className="zone-strip">
          <UtilityZone cards={you.utilities} playerId={0} selectedId={props.selectedUtilityId} onHover={props.onHover} onClick={props.onUtilityClick} />
          <VanquishedPile cards={you.vanquished} playerName={you.name} onPreview={props.onPreviewVanquished} onSelect={props.onSelectVanquished} />
        </div>
      </div>
      <div className="player-topline">
        <PlayerBanner player={you} active={props.state.activePlayer === 0} />
        <EnergyZone energies={you.energies} />
      </div>
    </main>
  );
}
