import { ENERGY_TYPES, type EnergyInPlay } from '../game/types';
import { MakerEnergyOrb } from './MakerGraphics';

export function EnergyZone({ energies }: { energies: EnergyInPlay[] }) {
  const ready = energies.filter((energy) => !energy.isTapped).length;
  const groups = ENERGY_TYPES.map((type) => {
    const matching = energies.filter((energy) => energy.energyType === type);
    return { type, total: matching.length, ready: matching.filter((energy) => !energy.isTapped).length };
  }).filter(({ total }) => total > 0);
  return (
    <section className="energy-zone glass" aria-label={`${ready} of ${energies.length} Energy ready`}>
      <div className="energy-heading"><span>Energy</span><b>{ready}<small> / {energies.length} ready</small></b></div>
      <div className="energy-pool">
        {groups.length === 0 ? <span className="energy-empty">None in play</span> : groups.map((group) => (
          <span className={`energy-group ${group.ready === 0 ? 'spent' : ''}`} key={group.type}>
            <MakerEnergyOrb energy={group.type} size={22} />
            <b>{group.ready}<small>/{group.total}</small></b>
          </span>
        ))}
      </div>
    </section>
  );
}
