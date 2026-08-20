import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '051-resonating-health-crystal',
  scenarios: [
    s.utility({ choices: [{ refs: ['ally'] }], expect: [s.attached('source', 'ally')] }),
    s.activated('resonating-health-crystal-heal-0', { setup: { units: [{ ref: 'ally', cardId: '025-isu-carrier', player: 0, row: 'vanguard', index: 1, hp: 50 }] }, expect: [s.hpChange('ally', 10)] }),
  ],
});
