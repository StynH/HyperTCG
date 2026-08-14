import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '075-metrocop',
  scenarios: [
    s.attack('metrocop-stun-stick', { expect: [s.lastDamage(10), s.hpChange('defender', -10)] }),
    s.attack('metrocop-apply-pressure', { expect: [s.lastDamage(20), s.hpChange('defender', -20)] }),
  ],
});
