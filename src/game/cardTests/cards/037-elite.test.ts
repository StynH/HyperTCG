import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '037-elite',
  scenarios: [
    s.attack('elite-pulse-volley', { expect: [s.lastDamage(30), s.hpChange('defender', -30)] }),
    s.attack('elite-overwatch-volley', { expect: [s.lastDamage(50), s.hpChange('defender', -50)] }),
  ],
});
