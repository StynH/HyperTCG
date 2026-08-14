import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '074-junk-droid',
  scenarios: [
    s.attack('junk-droid-scrap-toss', { expect: [s.lastDamage(10), s.hpChange('defender', -10)] }),
    s.attack('junk-droid-self-destruct', { choices: [{ refs: ['defender'] }], expect: [s.zone('source', 'vanquished'), s.hpChange('defender', -30)] }),
  ],
});
