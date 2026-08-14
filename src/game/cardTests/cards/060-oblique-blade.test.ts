import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '060-oblique-blade',
  scenarios: [
    s.attack('oblique-blade-riposte', {
      covers: ['utility', 'attack:oblique-blade-riposte'],
      effectRoll: 7,
      choices: [{ refs: ['ally'] }],
      expect: [s.attached('source', 'ally'), s.lastDamage(30), s.ready('ally', true)],
    }),
    s.attack('oblique-blade-riposte', {
      name: 'Riposte Exhausts the equipped Unit below DR 7',
      effectRoll: 6,
      choices: [{ refs: ['ally'] }],
      expect: [s.ready('ally', false)],
    }),
  ],
});
