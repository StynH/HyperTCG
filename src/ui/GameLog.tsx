import type { RollResult } from '../game/types';
import { CrosshairIcon } from './MakerGraphics';

export function GameLog({ log, roll }: { log: string[]; roll: RollResult | null }) {
  return (
    <aside className="game-log glass">
      <div className="log-heading"><span>Rift feed</span><i>LIVE</i></div>
      {roll && <div className="roll-card"><CrosshairIcon size={22} /><div><b>d20 {roll.attack || '—'}{roll.defense ? ` · d100 ${roll.defense}` : ''}</b><span>{roll.summary}</span></div></div>}
      <ol>{log.slice(0, 6).map((entry, index) => <li key={`${entry}-${index}`}><time>{index === 0 ? 'NOW' : `-${index}`}</time><span>{entry}</span></li>)}</ol>
    </aside>
  );
}
