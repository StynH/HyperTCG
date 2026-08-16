import { useEffect, useRef, useState } from 'react';
import { getCard } from '../data/catalog';
import type { CardInstance } from '../game/types';

export function MulliganPanel({ cards, maxCards, onHover, onSubmit }: {
  cards: CardInstance[];
  maxCards: number;
  onHover: (card: CardInstance) => void;
  onSubmit: (ids: readonly string[]) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const panelRef = useRef<HTMLElement>(null);
  const handId = cards.map(({ instanceId }) => instanceId).join('|');
  useEffect(() => setSelectedIds([]), [handId]);
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusableButtons = () => [...panel.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
    focusableButtons()[0]?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const buttons = focusableButtons();
      const first = buttons[0];
      const last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    panel.addEventListener('keydown', trapFocus);
    return () => panel.removeEventListener('keydown', trapFocus);
  }, [handId]);

  const toggle = (instanceId: string) => {
    setSelectedIds((current) => {
      if (current.includes(instanceId)) return current.filter((id) => id !== instanceId);
      if (current.length >= maxCards) return current;
      return [...current, instanceId];
    });
  };

  return (
    <div className="mulligan-overlay" role="dialog" aria-modal="true" aria-labelledby="mulligan-title" aria-describedby="mulligan-description">
      <section className="mulligan-panel glass" ref={panelRef}>
        <small>MATCH SETUP</small>
        <h1 id="mulligan-title">Choose your opening hand</h1>
        <p id="mulligan-description">
          Select up to {maxCards} cards to shuffle back into your deck. You will draw the same number of replacements.
        </p>
        <div className="mulligan-status" aria-live="polite">
          <strong>{selectedIds.length} / {maxCards}</strong>
          <span>{selectedIds.length === 0 ? 'No cards selected' : 'Selected for mulligan'}</span>
        </div>
        <div className="mulligan-cards">
          {cards.map((card) => {
            const definition = getCard(card.cardId);
            const isSelected = selectedIds.includes(card.instanceId);
            return (
              <button
                type="button"
                className={isSelected ? 'selected' : ''}
                aria-pressed={isSelected}
                key={card.instanceId}
                onClick={() => toggle(card.instanceId)}
                onFocus={() => onHover(card)}
                onMouseEnter={() => onHover(card)}
              >
                <img src={definition.image} alt="" />
                <span>{definition.name}</span>
                <b aria-hidden="true">{isSelected ? 'RETURN' : 'KEEP'}</b>
              </button>
            );
          })}
        </div>
        <button className="mulligan-confirm" type="button" onClick={() => onSubmit(selectedIds)}>
          {selectedIds.length === 0
            ? 'Keep all 7 cards'
            : `Mulligan ${selectedIds.length} card${selectedIds.length === 1 ? '' : 's'}`}
        </button>
      </section>
    </div>
  );
}
