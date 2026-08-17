import { getCard } from '../data/catalog';
import { describeCardModifiers } from '../game/effectRuntime';
import type { BoardAddress, CardInstance, GameState, PlayerId, PlayerState, RowName, UnitInPlay } from '../game/types';
import { CardTile } from './CardTile';

interface UnitRowsProps {
  state: GameState;
  player: PlayerState;
  playerId: PlayerId;
  selected?: BoardAddress | null;
  legalUnitPlacement?: boolean;
  targetMode?: boolean;
  onSlotClick: (address: BoardAddress) => void;
  onHover: (instance: CardInstance | UnitInPlay) => void;
  selectedUtilityId?: string;
  onUtilityClick: (instance: PlayerState['utilities'][number], playerId: PlayerId) => void;
}

function EquipmentBay({ unit, equipment, selectedId, playerId, onHover, onClick }: {
  unit: UnitInPlay;
  equipment: PlayerState['utilities'];
  selectedId?: string;
  playerId: PlayerId;
  onHover: (instance: CardInstance) => void;
  onClick: (instance: PlayerState['utilities'][number], playerId: PlayerId) => void;
}) {
  return (
    <div className="equipment-bay" aria-label={`Equipment attached to ${getCard(unit.cardId).name}`}>
      <span className="equipment-bay-label" aria-hidden="true">EQ</span>
      <div className="equipment-slots">
        {[0, 1].map((index) => {
          const item = equipment[index];
          if (!item) return <span className="equipment-slot-empty" aria-hidden="true" key={index} />;
          const card = getCard(item.cardId);
          return (
            <button
              type="button"
              className={`equipment-card ${selectedId === item.instanceId ? 'selected' : ''}`}
              key={item.instanceId}
              title={`${card.name} — equipped to ${getCard(unit.cardId).name}`}
              aria-label={`${card.name}, equipped to ${getCard(unit.cardId).name}`}
              onMouseEnter={() => onHover(item)}
              onFocus={() => onHover(item)}
              onClick={() => onClick(item, playerId)}
            >
              <img src={card.image} alt="" />
            </button>
          );
        })}
      </div>
    </div>
  );
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
          const equipment = unit ? props.player.utilities.filter(({ attachedTo }) => attachedTo === unit.instanceId) : [];
          return (
            <div className={`unit-slot ${!unit && props.legalUnitPlacement ? 'legal' : ''} ${targetable ? 'legal-target' : ''}`} key={`${row}-${index}`}>
              <div className="unit-card-frame">
                {unit ? (
                  <CardTile instance={unit} currentHp={unit.currentHp} isReady={unit.isReady} isSelected={selected} isTarget={targetable} modifiers={describeCardModifiers(props.state, unit.instanceId)} onHover={props.onHover} onClick={() => props.onSlotClick(address)} />
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
              {unit
                ? <EquipmentBay unit={unit} equipment={equipment} selectedId={props.selectedUtilityId} playerId={props.playerId} onHover={props.onHover} onClick={props.onUtilityClick} />
                : <div className="equipment-bay-placeholder" aria-hidden="true" />}
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

export function UtilityZone({ cards, playerId, selectedId, onHover, onClick }: {
  cards: PlayerState['utilities'];
  playerId: PlayerId;
  selectedId?: string;
  onHover: (card: CardInstance) => void;
  onClick: (card: PlayerState['utilities'][number], playerId: PlayerId) => void;
}) {
  const fieldCards = cards.filter(({ attachedTo }) => !attachedTo);
  return (
    <section className="utility-zone" aria-label="Utility zone">
      <span className="utility-label">Field <small>utilities</small></span>
      <div className="utility-cards">
        {fieldCards.length === 0
          ? <span className="utility-empty">No unattached Utilities in play</span>
          : fieldCards.map((card) => <CardTile compact key={card.instanceId} instance={card} isSelected={selectedId === card.instanceId} onHover={onHover} onClick={() => onClick(card, playerId)} />)}
      </div>
    </section>
  );
}
