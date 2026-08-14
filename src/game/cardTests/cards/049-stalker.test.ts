import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '049-stalker',
  scenarios: [
    s.continuous('stalker-hollowed-0', { expect: [s.modifier('source', undefined, 'condition-immunity', true, 'any')] }),
    s.attack('stalker-rebuilt-limbs', { expect: [s.lastDamage(20), s.hpChange('defender', -20)] }),
    s.attack('stalker-conversion-protocol', { choices: [{ refs: ['enemy2'] }], expect: [s.zone('enemy2', 'vanquished')] }),
  ],
});
