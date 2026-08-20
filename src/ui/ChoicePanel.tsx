import { useEffect, useState } from 'react';
import { getCard } from '../data/catalog';
import type { ChoiceOption, PendingChoice } from '../game/types';

function cleanText(text: string) {
  return text.replace(/\*\*/g, '').replace(/__/g, '').replace(/\[(DR|PR)\]/g, '$1').replace(/\s*\n\s*/g, ' ').trim();
}

// What an option actually does, so the player isn't guessing what a card resolves to.
function optionDetail(option: ChoiceOption, isReaction: boolean): string | null {
  if (option.id === 'pass') return isReaction ? 'Decline — let the effect resolve as is.' : null;
  if (!option.cardId) return null;
  const card = getCard(option.cardId);
  if (card.kind === 'utility' && card.utilityEffect) return cleanText(card.utilityEffect);
  return null;
}

export function ChoicePanel({ choice, onSubmit }: {
  choice: PendingChoice;
  onSubmit: (ids: readonly string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => setSelected([]), [choice.id]);
  const isReaction = choice.store === '__reaction';

  const toggle = (id: string) => {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (choice.max === 1) return [id];
      if (current.length >= choice.max) return current;
      return [...current, id];
    });
  };
  const canSubmit = selected.length >= choice.min && selected.length <= choice.max;

  return (
    <div className="choice-overlay" role="dialog" aria-modal="true" aria-labelledby="choice-title">
      <section className="choice-panel glass">
        <small>{isReaction ? 'REACTION WINDOW' : 'CHOOSE CARDS'}</small>
        <h2 id="choice-title">{choice.prompt}</h2>
        <p>Choose {choice.min === choice.max ? choice.min : choice.min + '–' + choice.max}{choice.ordered ? ' in resolution order' : ''}.</p>
        <div className="choice-options">
          {choice.options.map((option) => {
            const order = selected.indexOf(option.id);
            const detail = optionDetail(option, isReaction);
            return (
              <button
                type="button"
                className={order >= 0 ? 'selected' : ''}
                key={option.id}
                onClick={() => toggle(option.id)}
              >
                {option.cardId && <img src={getCard(option.cardId).image} alt="" />}
                <span className="choice-option-body">
                  <strong>{option.label}</strong>
                  {detail && <small>{detail}</small>}
                </span>
                {order >= 0 && <b>{choice.ordered ? order + 1 : '✓'}</b>}
              </button>
            );
          })}
        </div>
        <button className="choice-confirm" type="button" disabled={!canSubmit} onClick={() => onSubmit(selected)}>
          {choice.min === 0 && selected.length === 0 ? 'Continue without choosing' : 'Confirm choice'}
        </button>
      </section>
    </div>
  );
}
