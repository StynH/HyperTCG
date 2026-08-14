import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '050-stanley-pines',
  scenarios: [
    s.activated('stanley-pines-mystery-shack-0', { choices: [{ choose: 'maximum' }], expect: [s.usedAction('source', 'stanley-pines-mystery-shack-0'), s.zoneCountChange(1, 'deck', 0)] }),
    s.attack('stanley-sell-them-junk', { choices: [{ refs: ['vanquished-utility'] }], expect: [s.zone('vanquished-utility', 'hand')] }),
    s.attack('stanley-brass-knuckles', { expect: [s.lastDamage(20), s.hpChange('defender', -20)] }),
  ],
});
