import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '080-rover',
  scenarios: [s.attack('rover-ram', { expect: [s.lastDamage(30), s.hpChange('defender', -30)] })],
});
