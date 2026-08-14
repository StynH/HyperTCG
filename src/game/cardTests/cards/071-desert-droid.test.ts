import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '071-desert-droid',
  scenarios: [
    s.attack('desert-droid-sandblast', { expect: [s.lastDamage(10), s.hpChange('defender', -10)] }),
    s.attack('desert-droid-dune-charge', { expect: [s.lastDamage(30), s.hpChange('defender', -30)] }),
  ],
});
