import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '046-fcr-trench-drone',
  scenarios: [
    s.continuous('fcr-trench-drone-dug-in-0', { setup: { energies: [{ ref: 'oe', player: 1, type: 'boson' }] }, expect: [s.modifierTotal('source', undefined, 'attack-damage-taken', -20)] }),
    s.attack('fcr-trench-drone-covering-fire', { expect: [s.lastDamage(20), s.hpChange('defender', -20)] }),
  ],
});
