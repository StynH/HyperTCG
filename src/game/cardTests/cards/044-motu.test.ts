import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '044-motu',
  scenarios: [
    s.activated('motu-samosa-surge-0', { choices: [{ choose: 'minimum' }], expect: [s.zoneCountChange(0, 'energies', -1), s.modifierTotal('source', undefined, 'attack-damage', 20)] }),
    s.attack('motu-rolling-charge', { expect: [s.lastDamage(20), s.hpChange('defender', -20)] }),
    s.attack('motu-belly-bounce', { effectRoll: 1, expect: [s.lastDamage(30), s.hpChange('source', -10)] }),
    s.attack('motu-belly-bounce', { name: 'Belly Bounce has no recoil above DR 1', effectRoll: 2, expect: [s.hpChange('source', 0)] }),
  ],
});
