import type { CostType } from '../game/types';
import { MakerEnergyOrb } from './MakerGraphics';

export function Cost({
  cost,
  isGenericCostVariable = false,
}: {
  cost: readonly string[];
  isGenericCostVariable?: boolean;
}) {
  const colored = cost.filter((type) => type !== 'any');
  const genericCount = cost.length - colored.length;
  if (!colored.length && !genericCount && !isGenericCostVariable) return <span className="free-cost">FREE</span>;
  return (
    <span className="cost-row">
      {colored.map((type, index) => <MakerEnergyOrb key={`${type}-${index}`} energy={type as CostType} size={18} />)}
      {isGenericCostVariable
        ? <MakerEnergyOrb energy="any" size={18} count="X" />
        : genericCount > 0 && <MakerEnergyOrb energy="any" size={18} count={genericCount} />}
    </span>
  );
}
