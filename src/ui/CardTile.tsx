import { getCard } from '../data/catalog';
import type { CardInstance, UnitInPlay } from '../game/types';

interface CardTileProps {
  instance: CardInstance | UnitInPlay;
  currentHp?: number;
  isReady?: boolean;
  isSelected?: boolean;
  isTarget?: boolean;
  compact?: boolean;
  onHover: (instance: CardInstance | UnitInPlay) => void;
  onClick?: () => void;
}

export function CardTile({ instance, currentHp, isReady = true, isSelected, isTarget, compact, onHover, onClick }: CardTileProps) {
  const card = getCard(instance.cardId);
  return (
    <button
      className={`card-tile ${compact ? 'compact' : ''} ${!isReady ? 'exhausted' : ''} ${isSelected ? 'selected' : ''} ${isTarget ? 'targetable' : ''}`}
      onMouseEnter={() => onHover(instance)}
      onFocus={() => onHover(instance)}
      onClick={onClick}
      aria-label={`${card.name}${!isReady ? ', Exhausted' : ''}`}
      type="button"
    >
      <img src={card.image} alt={card.name} draggable="false" />
      {currentHp !== undefined && (
        <span className="hp-chip"><small>HP</small>{Math.max(0, currentHp)}</span>
      )}
      {!isReady && <span className="status-chip">Exhausted</span>}
    </button>
  );
}
