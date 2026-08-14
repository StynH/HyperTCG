import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '043-marksman',
  scenarios: [
    s.attack('marksman-ranged-support', { choices: [{ refs: ['defender'] }], expect: [s.hpChange('defender', -20)] }),
    s.attack('marksman-precision-shot', { effectRoll: 7, expect: [s.lastDamage(50), s.hpChange('defender', -50)] }),
    s.attack('marksman-precision-shot', { name: 'Precision Shot remains 30 Damage below DR 7', effectRoll: 6, expect: [s.lastDamage(30)] }),
  ],
});
