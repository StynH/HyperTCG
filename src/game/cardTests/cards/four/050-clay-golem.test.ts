import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '050-clay-golem',
  scenarios: [
    s.attack('clay-golem-slam', { expect: [s.lastDamage(30), s.hpChange('defender', -30)] }),
  ],
});
