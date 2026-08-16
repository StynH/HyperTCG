import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getCard } from '../data/catalog';
import type { CardInstance } from '../game/types';

function CardBack({ large = false }: { large?: boolean }) {
  return <span className={`vanquished-card-back ${large ? 'large' : ''}`} aria-hidden="true"><i>HV</i></span>;
}

export function VanquishedPile({ cards, playerName, onPreview, onSelect }: {
  cards: CardInstance[];
  playerName: string;
  onPreview: (card: CardInstance) => void;
  onSelect: (card: CardInstance) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const topCard = cards.at(-1);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDialog();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex]:not([tabindex="-1"])')];
      const first = focusable.at(0);
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleDialogKeys);
    return () => window.removeEventListener('keydown', handleDialogKeys);
  }, [closeDialog, isOpen]);

  const selectInDetailPanel = (instance: CardInstance) => {
    onSelect(instance);
    closeDialog();
  };

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className="vanquished-pile-trigger"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        <span className="vanquished-pile-preview">
          {!topCard || topCard.isFaceDown
            ? <CardBack />
            : <img src={getCard(topCard.cardId).image} alt="" />}
          <b>{cards.length}</b>
        </span>
        <span><strong>Vanquished</strong><small>View pile</small></span>
      </button>

      {isOpen && createPortal(
        <div className="vanquished-overlay" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) closeDialog();
        }}>
          <section
            ref={dialogRef}
            className="vanquished-dialog glass"
            role="dialog"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
          >
            <header>
              <div>
                <span>PUBLIC ZONE</span>
                <h2 id={titleId}>{playerName}'s Vanquished Pile</h2>
              </div>
              <button type="button" autoFocus aria-label="Close Vanquished Pile" onClick={closeDialog}>×</button>
            </header>
            <p id={descriptionId}>Hover or focus a face-up card to preview it in the left detail panel. Select it to keep the detail visible. Face-down cards remain hidden by rule.</p>
            <div className="vanquished-browser">
              {cards.length === 0 ? (
                <div className="vanquished-empty"><CardBack large /><strong>No Vanquished cards</strong></div>
              ) : (
                <div className="vanquished-grid">
                  {[...cards].reverse().map((instance, index) => {
                    if (instance.isFaceDown) {
                      return (
                        <article className="vanquished-entry face-down" key={instance.instanceId} aria-label={`Face-down card, position ${index + 1}`}>
                          <CardBack large />
                          <strong>Face-down card</strong>
                          <small>Identity hidden</small>
                        </article>
                      );
                    }
                    const card = getCard(instance.cardId);
                    return (
                      <button
                        type="button"
                        className="vanquished-entry"
                        key={instance.instanceId}
                        aria-label={`Preview ${card.name} in the card detail panel`}
                        onMouseEnter={() => onPreview(instance)}
                        onFocus={() => onPreview(instance)}
                        onClick={() => selectInDetailPanel(instance)}
                      >
                        <img src={card.image} alt="" />
                        <strong>{card.name}</strong>
                        <small>{card.type}</small>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}
