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
  const maxHp = card.kind === 'unit' ? card.hp : undefined;
  const shownHp = currentHp === undefined ? undefined : Math.max(0, currentHp);
  const isDamaged = shownHp !== undefined && maxHp !== undefined && shownHp < maxHp;
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
      {shownHp !== undefined && (
        <span className={`hp-chip ${isDamaged ? 'damaged' : ''}`}>
          <small>HP</small>
          <b>{shownHp}</b>
          {isDamaged && <em>/{maxHp}</em>}
        </span>
      )}
      {!isReady && <span className="status-chip">Exhausted</span>}
      {'conditions' in instance && instance.conditions.length > 0 && (
        <span className="status-chip condition-chip">
          {instance.conditions.map(({ name, amount }) => `${name}${amount === undefined ? '' : ` ${amount}`}`).join(' · ')}
        </span>
      )}
    </button>
  );
}
