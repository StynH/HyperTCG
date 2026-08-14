import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '067-civilian',
  scenarios: [s.attack('civilian-improvised-weapon', { expect: [s.lastDamage(10), s.hpChange('defender', -10)] })],
});
