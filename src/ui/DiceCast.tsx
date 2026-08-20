import { useEffect, useRef, useState } from 'react';
import { getCard } from '../data/catalog';
import { rollDie } from '../game/random';
import type { DieRollResult, RollResult } from '../game/types';

interface VisibleCast {
  roll: RollResult;
  revealedCount: number;
  values: number[];
}

const DIE_LABELS: Record<DieRollResult['kind'], string> = {
  effect: 'Effect die',
  critical: 'Critical d20',
  defense: 'Defense Check',
};

interface RollOutcome {
  label: string;
  detail: string;
  tone: 'neutral' | 'effect' | 'success' | 'danger' | 'warning';
  mark: string;
}

const RESOLVED_OUTCOMES: Record<NonNullable<DieRollResult['outcome']>, RollOutcome> = {
  'effect-value': { label: 'Effect value set', detail: 'Apply [DR] to the card effect', tone: 'effect', mark: '◆' },
  'attack-failed': { label: 'Attack failed', detail: 'Natural 1 · no effects or Damage', tone: 'danger', mark: '×' },
  'attack-normal': { label: 'Attack proceeds', detail: 'Resolve effects and Damage', tone: 'neutral', mark: '→' },
  'critical-hit': { label: 'Critical Hit', detail: 'Damage doubled before Defense', tone: 'success', mark: '×2' },
  'critical-prevented': { label: 'Critical prevented', detail: 'Natural 20 · Critical Hit not applied', tone: 'warning', mark: '!' },
  'critical-defense': { label: 'Critical Defense', detail: 'Damage negated', tone: 'success', mark: '0' },
  'defense-success': { label: 'Successful Defense', detail: 'Damage halved, rounded down', tone: 'success', mark: '½' },
  'defense-failure': { label: 'Failed Defense', detail: 'Take normal Damage', tone: 'danger', mark: '×' },
  'critical-defense-failure': { label: 'Critical Defense Failure', detail: 'Damage doubled', tone: 'danger', mark: '×2' },
};

function fallbackOutcome(die: DieRollResult, value: number): RollOutcome {
  if (die.kind === 'defense') {
    if (value <= 5) return RESOLVED_OUTCOMES['critical-defense'];
    if (value >= 95) return RESOLVED_OUTCOMES['critical-defense-failure'];
    return value <= (die.target ?? 0) ? RESOLVED_OUTCOMES['defense-success'] : RESOLVED_OUTCOMES['defense-failure'];
  }
  if (die.kind === 'critical' && value === 1) return RESOLVED_OUTCOMES['attack-failed'];
  if (die.kind === 'critical' && value === 20) return RESOLVED_OUTCOMES['critical-hit'];
  if (die.kind === 'critical') return RESOLVED_OUTCOMES['attack-normal'];
  return RESOLVED_OUTCOMES['effect-value'];
}

function rollRule(die: DieRollResult) {
  if (die.kind === 'critical') return '1 fails · 20 is Critical';
  if (die.kind === 'defense') return `Roll ${die.target ?? 0} or less · 1–5 / 95–100 override`;
  return 'Result becomes [DR]';
}

function rollOutcome(die: DieRollResult, value: number, isRevealed: boolean): RollOutcome {
  if (!isRevealed) {
    return { label: 'Rolling…', detail: rollRule(die), tone: 'neutral', mark: '…' };
  }
  return die.outcome ? RESOLVED_OUTCOMES[die.outcome] : fallbackOutcome(die, value);
}

function RollCheck({ die, value, delay, index, isRevealed }: {
  die: DieRollResult;
  value: number;
  delay: number;
  index: number;
  isRevealed: boolean;
}) {
  const outcome = rollOutcome(die, value, isRevealed);
  return (
    <article role="listitem" className={`roll-check roll-${die.kind} tone-${outcome.tone} ${isRevealed ? 'is-locked' : 'is-casting'}`} style={{ '--die-delay': `${delay}ms` } as React.CSSProperties}>
      <header>
        <span className="roll-check-number">0{index + 1}</span>
        <div><small>ROLL</small><strong>{DIE_LABELS[die.kind]}</strong></div>
        <b>D{die.sides}</b>
      </header>
      <div className="roll-rule">{rollRule(die)}</div>
      <div className="roll-face">
        <span className="roll-die-emblem" aria-hidden="true">D{die.sides}</span>
        <div><small>{isRevealed ? 'ROLLED' : 'ROLLING'}</small><strong>{value}</strong></div>
        {die.kind === 'defense' && die.target !== undefined && (
          <span className="defense-target"><small>DEF</small>{die.target}</span>
        )}
      </div>
      <footer>
        <span className="roll-verdict-mark" aria-hidden="true">{outcome.mark}</span>
        <div><b>{outcome.label}</b><span>{outcome.detail}</span></div>
      </footer>
    </article>
  );
}

function Combatant({ participant, role, vanquished }: {
  participant: NonNullable<RollResult['combat']>['attacker'] | NonNullable<RollResult['combat']>['defender'];
  role: 'Attacking Unit' | 'Defending Unit';
  vanquished?: boolean;
}) {
  const card = participant.cardId ? getCard(participant.cardId) : null;
  return (
    <article className={`combatant ${card ? '' : 'combatant-player'} ${vanquished ? 'is-vanquished' : ''}`}>
      <div className="combatant-portrait">
        {card ? <img src={card.image} alt="" /> : <span aria-hidden="true">HP</span>}
        {vanquished && <span className="combatant-skull" aria-hidden="true">☠</span>}
      </div>
      <div>
        <small>{card ? role : 'Defending player'}</small>
        <strong>{participant.name}</strong>
        {vanquished
          ? <span className="combatant-fallen">Vanquished</span>
          : card && <span>{card.type} · {card.subtitle}</span>}
      </div>
    </article>
  );
}

export function DiceCast({ roll, onResolved, onDismiss }: { roll: RollResult | null; onResolved?: (sequence: number) => void; onDismiss?: (sequence: number) => void }) {
  const lastSequence = useRef<number | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const resolvedSequence = useRef<number | null>(null);
  const [visible, setVisible] = useState<VisibleCast | null>(null);

  useEffect(() => {
    if (!roll) {
      lastSequence.current = null;
      setVisible(null);
      return;
    }
    if (lastSequence.current === roll.sequence) return;
    lastSequence.current = roll.sequence;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dieCount = roll.rolls.length;
    // Locked dice keep their real value; pending dice show a fresh shuffle face.
    const faces = (revealedCount: number, shuffle: boolean) =>
      roll.rolls.map((die, i) => (i < revealedCount || !shuffle ? die.value : rollDie(die.sides)));

    if (prefersReducedMotion) {
      setVisible({ roll, revealedCount: dieCount, values: faces(dieCount, false) });
      return;
    }

    setVisible({ roll, revealedCount: 0, values: faces(0, true) });
    const shuffleTimer = window.setInterval(() => {
      setVisible((current) => (current && current.roll === roll
        ? { ...current, values: faces(current.revealedCount, true) }
        : current));
    }, 82);

    // Reveal dice left-to-right, with an extra beat of suspense before a defense roll.
    const openingBeat = 620;
    const betweenDice = 520;
    const defenseSuspense = 360;
    const revealTimers: number[] = [];
    let elapsed = openingBeat;
    roll.rolls.forEach((die, i) => {
      if (i > 0) elapsed += betweenDice;
      if (die.kind === 'defense') elapsed += defenseSuspense;
      const revealAt = elapsed;
      revealTimers.push(window.setTimeout(() => {
        if (i === dieCount - 1) window.clearInterval(shuffleTimer);
        setVisible((current) => (current && current.roll === roll
          ? { ...current, revealedCount: i + 1, values: faces(i + 1, true) }
          : current));
      }, revealAt));
    });

    return () => {
      window.clearInterval(shuffleTimer);
      revealTimers.forEach((id) => window.clearTimeout(id));
    };
  }, [roll]);

  const overlayOpen = Boolean(visible);
  const fullyRevealed = visible ? visible.revealedCount >= visible.roll.rolls.length : false;

  // Reveal the outcome on the battlefield only once the dice have finished — while
  // the overlay covers the board — so the result never flashes ahead of the roll.
  useEffect(() => {
    if (visible && fullyRevealed && resolvedSequence.current !== visible.roll.sequence) {
      resolvedSequence.current = visible.roll.sequence;
      onResolved?.(visible.roll.sequence);
    }
  }, [visible, fullyRevealed, onResolved]);

  useEffect(() => {
    if (!overlayOpen) return;
    if (!fullyRevealed) panelRef.current?.focus();
    const containDialogFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullyRevealed) {
        if (visible) onDismiss?.(visible.roll.sequence);
        setVisible(null);
        window.requestAnimationFrame(() => previousFocus.current?.focus());
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        const action = panelRef.current?.querySelector<HTMLButtonElement>('button');
        if (action) action.focus();
        else panelRef.current?.focus();
      }
    };
    window.addEventListener('keydown', containDialogFocus);
    return () => window.removeEventListener('keydown', containDialogFocus);
  }, [overlayOpen, fullyRevealed]);

  if (!visible) return null;
  const isRevealed = fullyRevealed;
  const isCombatRoll = visible.roll.rolls.some(({ kind }) => kind === 'critical' || kind === 'defense');
  const defenderVanquished = isRevealed && Boolean(visible.roll.combat?.defender.vanquished);
  const outcomeLabel = defenderVanquished
    ? 'VANQUISHED'
    : visible.roll.damage > 0
      ? `${visible.roll.damage} DAMAGE`
      : isCombatRoll ? 'NO DAMAGE' : 'EFFECT COMPLETE';
  const outcomeTone = defenderVanquished
    ? 'vanquish'
    : visible.roll.damage > 0 ? 'damage' : isCombatRoll ? 'blocked' : 'effect';
  const outcomeSummary = defenderVanquished
    ? `${visible.roll.combat?.defender.name ?? 'The Unit'} is Vanquished — ${visible.roll.damage} Damage dealt.`
    : visible.roll.summary;
  const dismiss = () => {
    onDismiss?.(visible.roll.sequence);
    setVisible(null);
    window.requestAnimationFrame(() => previousFocus.current?.focus());
  };

  return (
    <div className={`dice-cast-overlay ${isRevealed ? 'revealed' : 'casting'}`} role="dialog" aria-modal="true" aria-labelledby="dice-cast-title" aria-describedby="dice-cast-result">
      <div className="dice-cast-grid" aria-hidden="true" />
      <section className="dice-cast-panel" ref={panelRef} tabIndex={-1}>
        <header className="dice-cast-heading">
          <div>
            <span className="dice-cast-kicker">{visible.roll.combat ? 'COMBAT ROLLS' : 'CARD EFFECT'}</span>
            <h2 id="dice-cast-title">{isRevealed ? 'Rolls complete' : 'Rolling dice'}</h2>
            <p>{visible.roll.rolls.length} {visible.roll.rolls.length === 1 ? 'roll' : 'rolls'} · Read from left to right</p>
          </div>
          <span className={`resolution-status ${isRevealed ? 'locked' : ''}`}><i aria-hidden="true" />{isRevealed ? 'DONE' : 'ROLLING'}</span>
        </header>
        {visible.roll.combat && (
          <section className="combat-matchup" aria-label={`${visible.roll.combat.attacker.name} attacks ${visible.roll.combat.defender.name} with ${visible.roll.combat.attackName}`}>
            <Combatant participant={visible.roll.combat.attacker} role="Attacking Unit" />
            <div className="combat-versus"><small>ATTACK</small><strong>{visible.roll.combat.attackName}</strong><span aria-hidden="true">→</span></div>
            <Combatant participant={visible.roll.combat.defender} role="Defending Unit" vanquished={defenderVanquished} />
          </section>
        )}
        <div className="dice-stage" role="list" aria-label="Dice checks">
          {visible.roll.rolls.map((die, index) => (
            <RollCheck key={`${die.kind}-${index}`} die={die} value={visible.values[index]} index={index} delay={index * 80} isRevealed={index < visible.revealedCount} />
          ))}
        </div>
        <div className={`combat-outcome outcome-${outcomeTone}`} id="dice-cast-result" aria-live="polite">
          <span className="outcome-mark" aria-hidden="true">{isRevealed ? (defenderVanquished ? '☠' : visible.roll.damage > 0 ? '−' : isCombatRoll ? '0' : '◆') : '…'}</span>
          <div><small>{isRevealed ? (defenderVanquished ? 'UNIT VANQUISHED' : 'RESULT') : 'ROLLING'}</small><strong>{isRevealed ? outcomeLabel : 'ROLLS IN PROGRESS'}</strong></div>
          <p>{isRevealed ? outcomeSummary : 'The rolls are shown in the order they apply.'}</p>
        </div>
        {isRevealed && <div className="dice-cast-actions"><button className="dice-cast-continue" type="button" autoFocus onClick={dismiss}>Continue battle <span aria-hidden="true">→</span></button><small>ESC</small></div>}
      </section>
    </div>
  );
}
