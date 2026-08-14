import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '081-salesman',
  scenarios: [
    s.attack('salesman-hard-sell', { choices: [{ refs: ['hand-card'] }], expect: [s.zone('hand-card', 'deck'), s.zoneCountChange(0, 'hand', 0)] }),
    s.attack('salesman-briefcase-swing', { expect: [s.lastDamage(10), s.hpChange('defender', -10)] }),
  ],
});
