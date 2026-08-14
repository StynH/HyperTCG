import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '086-soldier-tf2',
  scenarios: [
    s.attack('soldier-tf2-rocket-jump', { expect: [s.row('source', 'backguard'), s.ready('source', true), s.hpChange('source', -10)] }),
    s.attack('soldier-tf2-rocket-launcher', { effectRoll: 1, expect: [s.lastDamage(30), s.hpChange('source', -10)] }),
    s.attack('soldier-tf2-rocket-launcher', { name: 'Rocket Launcher has no recoil above DR 1', effectRoll: 2, expect: [s.hpChange('source', 0)] }),
  ],
});
