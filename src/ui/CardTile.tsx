import { getCard } from '../data/catalog';
import type { CardModifierInfo } from '../game/effectRuntime';
import type { CardInstance, UnitInPlay } from '../game/types';
import { summarizeModifiers } from './cardModifiers';

interface CardTileProps {
  instance: CardInstance | UnitInPlay;
  currentHp?: number;
  isReady?: boolean;
  isSelected?: boolean;
  isTarget?: boolean;
  compact?: boolean;
  caption?: string;
  modifiers?: readonly CardModifierInfo[];
  onHover: (instance: CardInstance | UnitInPlay) => void;
  onClick?: () => void;
}

export function CardTile({ instance, currentHp, isReady = true, isSelected, isTarget, compact, caption, modifiers, onHover, onClick }: CardTileProps) {
  const card = getCard(instance.cardId);
  const maxHpMod = (modifiers ?? []).reduce((sum, mod) => mod.kind === 'max-hp' ? sum + (mod.amount ?? 0) : sum, 0);
  const maxHp = card.kind === 'unit' ? card.hp + maxHpMod : undefined;
  const shownHp = currentHp === undefined ? undefined : Math.max(0, currentHp);
  const isDamaged = shownHp !== undefined && maxHp !== undefined && shownHp < maxHp;
  const flags = modifiers && modifiers.length > 0 ? summarizeModifiers(modifiers) : null;
  const flagLabel = flags && (flags.buffs || flags.debuffs || flags.neutral)
    ? `, ${flags.buffs} buff${flags.buffs === 1 ? '' : 's'} and ${flags.debuffs} debuff${flags.debuffs === 1 ? '' : 's'}`
    : '';
  return (
    <button
      className={`card-tile ${compact ? 'compact' : ''} ${!isReady ? 'exhausted' : ''} ${isSelected ? 'selected' : ''} ${isTarget ? 'targetable' : ''}`}
      onMouseEnter={() => onHover(instance)}
      onFocus={() => onHover(instance)}
      onClick={onClick}
      aria-label={`${card.name}${caption ? `, ${caption}` : ''}${!isReady ? ', Exhausted' : ''}${flagLabel}`}
      type="button"
    >
      <img src={card.image} alt={card.name} draggable="false" />
      {caption && <span className="status-chip build-chip">{caption}</span>}
      {flags && (flags.buffs > 0 || flags.debuffs > 0 || flags.neutral > 0) && (
        <span className="modifier-flags" title={flags.tooltip} aria-hidden="true">
          {flags.buffs > 0 && <span className="mod-flag buff">▲{flags.buffs}</span>}
          {flags.debuffs > 0 && <span className="mod-flag debuff">▼{flags.debuffs}</span>}
          {flags.buffs === 0 && flags.debuffs === 0 && flags.neutral > 0 && <span className="mod-flag neutral">◆</span>}
        </span>
      )}
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
