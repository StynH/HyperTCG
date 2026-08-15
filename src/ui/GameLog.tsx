import type { RollResult } from '../game/types';
import { CrosshairIcon } from './MakerGraphics';

export function GameLog({ log, roll }: { log: string[]; roll: RollResult | null }) {
  const rollValues = roll?.rolls.map(({ sides, value }) => `d${sides} ${value}`).join(' · ');
  return (
    <aside className="game-log glass">
      <div className="log-heading"><span>Rift feed</span><i>LIVE</i></div>
      {roll && <div className="roll-card"><CrosshairIcon size={22} /><div><b>{rollValues}</b><span>{roll.summary}</span></div></div>}
      <ol>{log.slice(0, 6).map((entry, index) => <li key={`${entry}-${index}`}><time>{index === 0 ? 'NOW' : `-${index}`}</time><span>{entry}</span></li>)}</ol>
    </aside>
  );
}
