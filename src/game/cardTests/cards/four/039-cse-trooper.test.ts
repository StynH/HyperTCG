import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '039-cse-trooper',
  scenarios: [
    s.attack('cse-trooper-suppressive-fire', { expect: [s.lastDamage(20), s.condition('defender', 'weakened', true)] }),
  ],
});
