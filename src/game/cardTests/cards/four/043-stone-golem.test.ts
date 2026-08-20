import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '043-stone-golem',
  scenarios: [
    s.attack('stone-golem-stone-fist', { expect: [s.lastDamage(50), s.hpChange('defender', -50)] }),
  ],
});
