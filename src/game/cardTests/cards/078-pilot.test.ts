import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '078-pilot',
  scenarios: [
    s.attack('pilot-evasive-pattern', { choices: [{ refs: ['ally'] }], expect: [s.row('ally', 'backguard'), s.ready('ally', true)] }),
    s.attack('pilot-strafing-run', { expect: [s.lastDamage(20), s.hpChange('defender', -20)] }),
  ],
});
