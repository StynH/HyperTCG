import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '072-grunt',
  scenarios: [s.attack('grunt-heavy-swing', { expect: [s.lastDamage(40), s.hpChange('defender', -40)] })],
});
