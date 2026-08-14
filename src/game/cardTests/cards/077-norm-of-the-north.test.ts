import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '077-norm-of-the-north',
  scenarios: [
    s.attack('norm-bear-hug', { effectRoll: 4, expect: [s.lastDamage(20), s.condition('defender', 'paralyzed')] }),
    s.attack('norm-bear-hug', { name: 'Bear Hug does not Paralyze below DR 4', effectRoll: 3, expect: [s.condition('defender', 'paralyzed', false)] }),
    s.attack('norm-arctic-slam', { expect: [s.lastDamage(40), s.hpChange('defender', -40)] }),
  ],
});
