import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '095-stun-baton',
  scenarios: [
    s.attack('stun-baton-compliance-shock', {
      covers: ['utility', 'attack:stun-baton-compliance-shock'],
      effectRoll: 5,
      setup: { units: [{ ref: 'ally', cardId: '085-soldier', player: 0, row: 'vanguard', index: 1 }] },
      choices: [{ refs: ['ally'] }, { refs: ['defender'] }],
      expect: [s.attached('source', 'ally'), s.condition('defender', 'cowering')],
    }),
    s.attack('stun-baton-compliance-shock', {
      name: 'Compliance Shock does not Cower below DR 5',
      effectRoll: 4,
      setup: { units: [{ ref: 'ally', cardId: '085-soldier', player: 0, row: 'vanguard', index: 1 }] },
      choices: [{ refs: ['ally'] }, { refs: ['defender'] }],
      expect: [s.condition('defender', 'cowering', false)],
    }),
  ],
});
