import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '047-peter-griffin',
  scenarios: [
    s.attack('peter-freakin-sweet', { expect: [s.lastDamage(30), s.hpChange('defender', -30)] }),
    s.attack('peter-chicken-fight', { expect: [s.lastDamage(40), s.hpChange('defender', -40)] }),
  ],
});
