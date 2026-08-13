import type { CostType } from '../game/types';
import { MakerEnergyOrb } from './MakerGraphics';

export function Cost({ cost }: { cost: readonly string[] }) {
  if (!cost.length) return <span className="free-cost">FREE</span>;
  return <span className="cost-row">{cost.map((type, index) => <MakerEnergyOrb key={`${type}-${index}`} energy={type as CostType} size={18} />)}</span>;
}
