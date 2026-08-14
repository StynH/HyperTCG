import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '092-keltec-pr57',
  scenarios: [s.attack('keltec-pr57-point-blank', {
    covers: ['utility', 'attack:keltec-pr57-point-blank'],
    choices: [{ refs: ['ally'] }],
    expect: [s.attached('source', 'ally'), s.lastDamage(20), s.hpChange('defender', -20)],
  })],
});
