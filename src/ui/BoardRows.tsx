import type { BoardAddress, CardInstance, PlayerId, PlayerState, RowName, UnitInPlay } from '../game/types';
import { CardTile } from './CardTile';

interface UnitRowsProps {
  player: PlayerState;
  playerId: PlayerId;
  selected?: BoardAddress | null;
  legalUnitPlacement?: boolean;
  targetMode?: boolean;
  onSlotClick: (address: BoardAddress) => void;
  onHover: (instance: CardInstance | UnitInPlay) => void;
}

function UnitRow({ row, ...props }: UnitRowsProps & { row: RowName }) {
  return (
    <div className={`unit-row ${row}`}>
      <span className="row-label">{row === 'vanguard' ? 'Vanguard' : 'Backguard'}</span>
      <div className="slot-grid">
        {props.player[row].map((unit, index) => {
          const address = { player: props.playerId, row, index };
          const selected = props.selected?.player === address.player && props.selected.row === row && props.selected.index === index;
          const targetable = Boolean(props.targetMode && props.playerId === 1 && row === 'vanguard' && unit);
          return (
            <div className={`unit-slot ${!unit && props.legalUnitPlacement ? 'legal' : ''} ${targetable ? 'legal-target' : ''}`} key={`${row}-${index}`}>
              {unit ? (
                <CardTile instance={unit} currentHp={unit.currentHp} isReady={unit.isReady} isSelected={selected} isTarget={targetable} onHover={props.onHover} onClick={() => props.onSlotClick(address)} />
              ) : (
                <button
                  type="button"
                  className="empty-slot"
                  onClick={() => props.onSlotClick(address)}
                  aria-label={`Empty ${row} position ${index + 1}`}
                >
                  <span>{index + 1}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function UnitRows(props: UnitRowsProps & { reversed?: boolean }) {
  const rows: RowName[] = props.reversed ? ['backguard', 'vanguard'] : ['vanguard', 'backguard'];
  return <div className="unit-rows">{rows.map((row) => <UnitRow key={row} row={row} {...props} />)}</div>;
}

export function UtilityZone({ cards, onHover }: { cards: CardInstance[]; onHover: (card: CardInstance) => void }) {
  return (
    <section className="utility-zone" aria-label="Utility zone">
      <span className="utility-label">Utilities <small>unlimited</small></span>
      <div className="utility-cards">
        {cards.length === 0 ? <span className="utility-empty">Continuous and Equipment cards remain here</span> : cards.map((card) => <CardTile compact key={card.instanceId} instance={card} onHover={onHover} />)}
      </div>
    </section>
  );
}
