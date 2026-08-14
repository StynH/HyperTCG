import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '096-tcr-v02-strike-gun',
  scenarios: [
    s.attack('tcr-v02-aimed-burst', {
      covers: ['utility', 'attack:tcr-v02-aimed-burst'],
      effectRoll: 6,
      setup: { units: [{ ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1 }] },
      choices: [{ refs: ['ally'] }],
      expect: [s.attached('source', 'ally'), s.lastDamage(50), s.hpChange('defender', -50)],
    }),
    s.attack('tcr-v02-aimed-burst', {
      name: 'Aimed Burst stays at 30 Damage below DR 6',
      effectRoll: 5,
      setup: { units: [{ ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1 }] },
      choices: [{ refs: ['ally'] }],
      expect: [s.lastDamage(30)],
    }),
  ],
});
