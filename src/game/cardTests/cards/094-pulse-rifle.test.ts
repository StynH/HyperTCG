import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '094-pulse-rifle',
  scenarios: [s.attack('pulse-rifle-controlled-burst', {
    covers: ['utility', 'attack:pulse-rifle-controlled-burst'],
    setup: { units: [{ ref: 'ally', cardId: '069-conscript', player: 0, row: 'vanguard', index: 1 }] },
    choices: [{ refs: ['ally'] }],
    expect: [s.attached('source', 'ally'), s.lastDamage(30), s.hpChange('defender', -30)],
  })],
});
