import { useEffect, useState } from 'react';
import { getCard } from '../data/catalog';
import type { PendingChoice } from '../game/types';

export function ChoicePanel({ choice, onSubmit }: {
  choice: PendingChoice;
  onSubmit: (ids: readonly string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => setSelected([]), [choice.id]);

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
        <small>EFFECT RESOLUTION</small>
        <h2 id="choice-title">{choice.prompt}</h2>
        <p>Choose {choice.min === choice.max ? choice.min : choice.min + '–' + choice.max}{choice.ordered ? ' in resolution order' : ''}.</p>
        <div className="choice-options">
          {choice.options.map((option) => {
            const order = selected.indexOf(option.id);
            return (
              <button
                type="button"
                className={order >= 0 ? 'selected' : ''}
                key={option.id}
                onClick={() => toggle(option.id)}
              >
                {option.cardId && <img src={getCard(option.cardId).image} alt="" />}
                <span>{option.label}</span>
                {order >= 0 && <b>{choice.ordered ? order + 1 : '✓'}</b>}
              </button>
            );
          })}
        </div>
        <button className="choice-confirm" type="button" disabled={!canSubmit} onClick={() => onSubmit(selected)}>
          {choice.min === 0 && selected.length === 0 ? 'Continue without choosing' : 'Resolve choice'}
        </button>
      </section>
    </div>
  );
}
