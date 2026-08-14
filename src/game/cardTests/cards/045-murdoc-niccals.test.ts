import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '045-murdoc-niccals',
  scenarios: [
    s.activated('murdoc-niccals-reluctant-pilot-0', { expect: [s.row('source', 'backguard'), s.ready('source', true)] }),
    s.attack('murdoc-bass-feedback', { effectRoll: 3, expect: [s.lastDamage(20), s.hpChange('source', -10)] }),
    s.attack('murdoc-bass-feedback', { name: 'Bass Feedback gains Damage above DR 3', effectRoll: 4, expect: [s.lastDamage(40), s.hpChange('source', 0)] }),
    s.attack('murdoc-get-in-the-ship', { expect: [s.row('source', 'backguard'), s.ready('source', true), s.row('ally2', 'backguard')] }),
  ],
});
