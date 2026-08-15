import { useEffect, useRef, useState } from 'react';
import { rollDie } from '../game/random';
import type { DieRollResult, RollResult } from '../game/types';

type CastPhase = 'casting' | 'revealed';

interface VisibleCast {
  phase: CastPhase;
  roll: RollResult;
  values: number[];
}

function randomFace(sides: number) {
  return rollDie(sides);
}

const DIE_LABELS: Record<DieRollResult['kind'], string> = {
  effect: 'Effect',
  critical: 'Critical',
  defense: 'Defense',
};

function PolyhedralDie({ die, value, delay = 0 }: { die: DieRollResult; value: number; delay?: number }) {
  return (
    <div className="die-readout" style={{ '--die-delay': `${delay}ms` } as React.CSSProperties}>
      <span className="die-type">{DIE_LABELS[die.kind]} · D{die.sides}</span>
      <div className={`polyhedral-die die-${die.kind}`}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <polygon className="die-shell" points="60,4 108,32 108,88 60,116 12,88 12,32" />
          <path className="die-facets" d="M60 4 42 43l18 73m0-112 18 39-18 73M12 32l30 11-30 45m96-56L78 43l30 45M12 88l48-23 48 23M12 32l48 33 48-33" />
        </svg>
        <b>{value}</b>
      </div>
    </div>
  );
}

export function DiceCast({ roll }: { roll: RollResult | null }) {
  const lastSequence = useRef<number | null>(null);
  const [visible, setVisible] = useState<VisibleCast | null>(null);

  useEffect(() => {
    if (!roll) {
      lastSequence.current = null;
      setVisible(null);
      return;
    }
    if (lastSequence.current === roll.sequence) return;
    lastSequence.current = roll.sequence;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const castingDuration = prefersReducedMotion ? 0 : 680;
    const preview = () => setVisible({
      phase: 'casting',
      roll,
      values: roll.rolls.map(({ sides }) => randomFace(sides)),
    });

    preview();
    const shuffleTimer = prefersReducedMotion ? undefined : window.setInterval(preview, 76);
    const revealTimer = window.setTimeout(() => {
      if (shuffleTimer !== undefined) window.clearInterval(shuffleTimer);
      setVisible({
        phase: 'revealed',
        roll,
        values: roll.rolls.map(({ value }) => value),
      });
    }, castingDuration);
    return () => {
      if (shuffleTimer !== undefined) window.clearInterval(shuffleTimer);
      window.clearTimeout(revealTimer);
    };
  }, [roll?.sequence]);

  useEffect(() => {
    if (visible?.phase !== 'revealed') return;
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVisible(null);
    };
    window.addEventListener('keydown', dismissOnEscape);
    return () => window.removeEventListener('keydown', dismissOnEscape);
  }, [visible?.phase]);

  if (!visible) return null;
  const isRevealed = visible.phase === 'revealed';

  return (
    <div className={`dice-cast-overlay ${visible.phase}`} role="dialog" aria-modal="true" aria-labelledby="dice-cast-title" aria-describedby="dice-cast-result">
      <div className="dice-cast-burst" aria-hidden="true" />
      <section className="dice-cast-panel">
        <span className="dice-cast-kicker">DICE RESOLUTION</span>
        <h2 id="dice-cast-title">{isRevealed ? 'Roll resolved' : 'Casting dice'}</h2>
        <div className="dice-stage" aria-hidden="true">
          {visible.roll.rolls.map((die, index) => (
            <PolyhedralDie key={`${die.kind}-${index}`} die={die} value={visible.values[index]} delay={index * 90} />
          ))}
        </div>
        <p className="dice-cast-result" id="dice-cast-result" aria-live="polite">
          {isRevealed ? visible.roll.summary : 'The rift is deciding the outcome…'}
        </p>
        {isRevealed && <button className="dice-cast-continue" type="button" autoFocus onClick={() => setVisible(null)}>Continue</button>}
      </section>
    </div>
  );
}
