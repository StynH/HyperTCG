import { getCard } from '../data/catalog';
import type { GameLogEntry, GameLogSubject, RollResult } from '../game/types';
import { CrosshairIcon } from './MakerGraphics';

function SubjectMark({ subject, small = false }: { subject: GameLogSubject; small?: boolean }) {
  if (subject.cardId) {
    return <img className={`feed-subject-mark ${small ? 'small' : ''}`} src={getCard(subject.cardId).image} alt="" />;
  }
  return (
    <span className={`feed-subject-mark text ${small ? 'small' : ''}`} aria-hidden="true">
      {subject.kind === 'rules' ? 'HV' : subject.name.slice(0, 2).toUpperCase()}
    </span>
  );
}

function FeedEntry({ entry, index }: { entry: GameLogEntry; index: number }) {
  const source = entry.source ?? { kind: 'rules' as const, name: 'Game rules' };
  return (
    <li className={`feed-event ${entry.kind}`}>
      <time>{index === 0 ? 'NOW' : `-${String(index).padStart(2, '0')}`}</time>
      <article>
        <SubjectMark subject={source} />
        <div className="feed-event-copy">
          <header>
            <strong>{source.name}</strong>
            <i>{entry.kind}</i>
          </header>
          <b className="feed-action">{entry.action ?? 'Game event'}</b>
          {entry.target && (
            <div className="feed-target">
              <span aria-hidden="true">→</span>
              <SubjectMark subject={entry.target} small />
              <strong>{entry.target.name}</strong>
            </div>
          )}
          <p>{entry.message}</p>
        </div>
      </article>
    </li>
  );
}

export function GameLog({ log, roll }: { log: GameLogEntry[]; roll: RollResult | null }) {
  const rollValues = roll?.rolls.map(({ sides, value }) => `d${sides} ${value}`).join(' · ');
  return (
    <aside className="game-log glass" aria-labelledby="match-log-heading">
      <div className="log-heading"><span id="match-log-heading">Match log</span><i>RECENT</i></div>
      {roll && (
        <div className="roll-card">
          <CrosshairIcon size={22} />
          <div>
            <b>{roll.combat ? `${roll.combat.attacker.name} · ${roll.combat.attackName}` : 'Dice resolved'}</b>
            {roll.combat && <span className="roll-route">→ {roll.combat.defender.name}</span>}
            <strong>{rollValues}</strong>
            <span>{roll.summary}</span>
          </div>
        </div>
      )}
      <ol aria-live="polite">{log.slice(0, 7).map((entry, index) => <FeedEntry key={entry.sequence} entry={entry} index={index} />)}</ol>
    </aside>
  );
}
