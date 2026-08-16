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
  effect: 'Effect roll',
  critical: 'Attack roll',
  defense: 'Defense roll',
};

function defenseOutcome(value: number, defense = 0) {
  if (value <= 5) return { label: 'Critical defense', detail: 'Damage prevented', tone: 'success' };
  if (value >= 95) return { label: 'Critical failure', detail: 'Damage doubled', tone: 'danger' };
  if (value <= defense) return { label: 'Defense holds', detail: 'Damage halved', tone: 'success' };
  return { label: 'Defense broken', detail: 'Full damage', tone: 'danger' };
}

function rollOutcome(die: DieRollResult, value: number, isRevealed: boolean) {
  if (!isRevealed) {
    return die.kind === 'defense' && die.target !== undefined
      ? { label: `Defend on ${die.target} or less`, detail: 'Comparing roll to Unit DEF', tone: 'neutral' }
      : { label: 'Rolling...', detail: `Casting d${die.sides}`, tone: 'neutral' };
  }
  if (die.kind === 'defense') return defenseOutcome(value, die.target);
  if (die.kind === 'critical' && value === 1) return { label: 'Attack failed', detail: 'Natural 1', tone: 'danger' };
  if (die.kind === 'critical' && value === 20) return { label: 'Critical hit', detail: 'Natural 20', tone: 'success' };
  if (die.kind === 'critical') return { label: 'Attack confirmed', detail: 'No critical modifier', tone: 'neutral' };
  return { label: 'Effect value', detail: `Result ${value}`, tone: 'effect' };
}

function RollCheck({ die, value, delay, isRevealed }: {
  die: DieRollResult;
  value: number;
  delay: number;
  isRevealed: boolean;
}) {
  const outcome = rollOutcome(die, value, isRevealed);
  return (
    <article role="listitem" className={`roll-check roll-${die.kind} tone-${outcome.tone}`} style={{ '--die-delay': `${delay}ms` } as React.CSSProperties}>
      <header>
        <span>{DIE_LABELS[die.kind]}</span>
        <b>D{die.sides}</b>
      </header>
      <div className="roll-face">
        <span className="roll-die-emblem" aria-hidden="true">D{die.sides}</span>
        <strong>{value}</strong>
        {die.kind === 'defense' && die.target !== undefined && (
          <span className="defense-target"><small>UNIT DEF</small>{die.target}</span>
        )}
      </div>
      <footer>
        <b>{outcome.label}</b>
        <span>{outcome.detail}</span>
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
    if (visible?.phase !== 'revealed') return;
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVisible(null);
    };
    window.addEventListener('keydown', dismissOnEscape);
    return () => window.removeEventListener('keydown', dismissOnEscape);
  }, [visible?.phase]);

  if (!visible) return null;
  const isRevealed = visible.phase === 'revealed';
  const isCombatRoll = visible.roll.rolls.some(({ kind }) => kind === 'critical' || kind === 'defense');
  const outcomeLabel = visible.roll.damage > 0
    ? `${visible.roll.damage} DAMAGE`
    : isCombatRoll ? 'NO DAMAGE' : 'EFFECT RESOLVED';

  return (
    <div className={`dice-cast-overlay ${visible.phase}`} role="dialog" aria-modal="true" aria-labelledby="dice-cast-title" aria-describedby="dice-cast-result">
      <div className="dice-cast-grid" aria-hidden="true" />
      <section className="dice-cast-panel">
        <span className="dice-cast-kicker">COMBAT RESOLUTION</span>
        <h2 id="dice-cast-title">{isRevealed ? 'Outcome locked' : 'Rolling checks'}</h2>
        {visible.roll.combat && (
          <section className="combat-matchup" aria-label={`${visible.roll.combat.attacker.name} attacks ${visible.roll.combat.defender.name} with ${visible.roll.combat.attackName}`}>
            <Combatant participant={visible.roll.combat.attacker} role="Attacking Unit" />
            <div className="combat-versus" aria-hidden="true"><b>VS</b><span>{visible.roll.combat.attackName}</span></div>
            <Combatant participant={visible.roll.combat.defender} role="Defending Unit" />
          </section>
        )}
        <div className="dice-stage" role="list" aria-label="Dice checks">
          {visible.roll.rolls.map((die, index) => (
            <RollCheck key={`${die.kind}-${index}`} die={die} value={visible.values[index]} delay={index * 80} isRevealed={isRevealed} />
          ))}
        </div>
        <div className="combat-outcome" id="dice-cast-result" aria-live="polite">
          <small>{isRevealed ? 'FINAL OUTCOME' : 'RESOLVING'}</small>
          <strong>{isRevealed ? outcomeLabel : 'CHECKS IN PROGRESS'}</strong>
          <span>{isRevealed ? visible.roll.summary : 'Attack, critical, and defense rules are being resolved.'}</span>
        </div>
        {isRevealed && <button className="dice-cast-continue" type="button" autoFocus onClick={() => setVisible(null)}>Return to battle</button>}
      </section>
    </div>
  );
}
