import { useEffect, useRef, useState } from 'react';
import { getCard } from '../data/catalog';
import { rollDie } from '../game/random';
import type { DieRollResult, RollResult } from '../game/types';

type CastPhase = 'casting' | 'revealed';

interface VisibleCast {
  phase: CastPhase;
  roll: RollResult;
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
    <article role="listitem" className={`roll-check roll-${die.kind} tone-${outcome.tone}`} style={{ '--die-delay': `${delay}ms` } as React.CSSProperties}>
      <header>
        <span className="roll-check-number">0{index + 1}</span>
        <div><small>CHECK</small><strong>{DIE_LABELS[die.kind]}</strong></div>
        <b>D{die.sides}</b>
      </header>
      <div className="roll-rule">{rollRule(die)}</div>
      <div className="roll-face">
        <span className="roll-die-emblem" aria-hidden="true">D{die.sides}</span>
        <div><small>{isRevealed ? 'ROLLED' : 'CASTING'}</small><strong>{value}</strong></div>
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

function Combatant({ participant, role }: {
  participant: NonNullable<RollResult['combat']>['attacker'] | NonNullable<RollResult['combat']>['defender'];
  role: 'Attacking Unit' | 'Defending Unit';
}) {
  const card = participant.cardId ? getCard(participant.cardId) : null;
  return (
    <article className={`combatant ${card ? '' : 'combatant-player'}`}>
      <div className="combatant-portrait">
        {card ? <img src={card.image} alt="" /> : <span aria-hidden="true">HP</span>}
      </div>
      <div>
        <small>{card ? role : 'Defending player'}</small>
        <strong>{participant.name}</strong>
        {card && <span>{card.type} · {card.subtitle}</span>}
      </div>
    </article>
  );
}

export function DiceCast({ roll }: { roll: RollResult | null }) {
  const lastSequence = useRef<number | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
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
    const castingDuration = prefersReducedMotion ? 0 : 620;
    const preview = () => setVisible({
      phase: 'casting',
      roll,
      values: roll.rolls.map(({ sides }) => rollDie(sides)),
    });

    preview();
    const shuffleTimer = prefersReducedMotion ? undefined : window.setInterval(preview, 82);
    const revealTimer = window.setTimeout(() => {
      if (shuffleTimer !== undefined) window.clearInterval(shuffleTimer);
      setVisible({ phase: 'revealed', roll, values: roll.rolls.map(({ value }) => value) });
    }, castingDuration);
    return () => {
      if (shuffleTimer !== undefined) window.clearInterval(shuffleTimer);
      window.clearTimeout(revealTimer);
    };
  }, [roll]);

  useEffect(() => {
    if (!visible) return;
    if (visible.phase === 'casting') panelRef.current?.focus();
    const containDialogFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible.phase === 'revealed') {
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
  }, [visible]);

  if (!visible) return null;
  const isRevealed = visible.phase === 'revealed';
  const isCombatRoll = visible.roll.rolls.some(({ kind }) => kind === 'critical' || kind === 'defense');
  const outcomeLabel = visible.roll.damage > 0
    ? `${visible.roll.damage} DAMAGE`
    : isCombatRoll ? 'NO DAMAGE' : 'EFFECT RESOLVED';
  const outcomeTone = visible.roll.damage > 0 ? 'damage' : isCombatRoll ? 'blocked' : 'effect';
  const dismiss = () => {
    setVisible(null);
    window.requestAnimationFrame(() => previousFocus.current?.focus());
  };

  return (
    <div className={`dice-cast-overlay ${visible.phase}`} role="dialog" aria-modal="true" aria-labelledby="dice-cast-title" aria-describedby="dice-cast-result">
      <div className="dice-cast-grid" aria-hidden="true" />
      <section className="dice-cast-panel" ref={panelRef} tabIndex={-1}>
        <header className="dice-cast-heading">
          <div>
            <span className="dice-cast-kicker">{visible.roll.combat ? 'COMBAT RESOLUTION' : 'EFFECT RESOLUTION'}</span>
            <h2 id="dice-cast-title">{isRevealed ? 'Resolution complete' : 'Resolving the attack'}</h2>
            <p>{visible.roll.rolls.length} {visible.roll.rolls.length === 1 ? 'check' : 'checks'} · Read from left to right</p>
          </div>
          <span className={`resolution-status ${isRevealed ? 'locked' : ''}`}><i aria-hidden="true" />{isRevealed ? 'LOCKED' : 'ROLLING'}</span>
        </header>
        {visible.roll.combat && (
          <section className="combat-matchup" aria-label={`${visible.roll.combat.attacker.name} attacks ${visible.roll.combat.defender.name} with ${visible.roll.combat.attackName}`}>
            <Combatant participant={visible.roll.combat.attacker} role="Attacking Unit" />
            <div className="combat-versus"><small>ATTACK</small><strong>{visible.roll.combat.attackName}</strong><span aria-hidden="true">→</span></div>
            <Combatant participant={visible.roll.combat.defender} role="Defending Unit" />
          </section>
        )}
        <div className="dice-stage" role="list" aria-label="Dice checks">
          {visible.roll.rolls.map((die, index) => (
            <RollCheck key={`${die.kind}-${index}`} die={die} value={visible.values[index]} index={index} delay={index * 80} isRevealed={isRevealed} />
          ))}
        </div>
        <div className={`combat-outcome outcome-${outcomeTone}`} id="dice-cast-result" aria-live="polite">
          <span className="outcome-mark" aria-hidden="true">{isRevealed ? (visible.roll.damage > 0 ? '−' : isCombatRoll ? '0' : '◆') : '…'}</span>
          <div><small>{isRevealed ? 'FINAL OUTCOME' : 'RESOLVING'}</small><strong>{isRevealed ? outcomeLabel : 'CHECKS IN PROGRESS'}</strong></div>
          <p>{isRevealed ? visible.roll.summary : 'Effect, Critical, and Defense rules resolve in sequence.'}</p>
        </div>
        {isRevealed && <div className="dice-cast-actions"><button className="dice-cast-continue" type="button" autoFocus onClick={dismiss}>Continue battle <span aria-hidden="true">→</span></button><small>ESC</small></div>}
      </section>
    </div>
  );
}
