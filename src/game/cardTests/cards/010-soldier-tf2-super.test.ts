import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '010-soldier-tf2-super',
  scenarios: [
    s.continuous('soldier-maggots-0', { setup: { units: [{ ref: 'ally', cardId: '085-soldier', player: 0, row: 'vanguard', index: 1 }] }, expect: [s.modifierTotal('ally', undefined, 'attack-damage', 10)] }),
    s.attack('soldier-tf2-super-buff-banner', { setup: { units: [{ ref: 'ally', cardId: '085-soldier', player: 0, row: 'vanguard', index: 1 }] }, expect: [s.modifierTotal('ally', undefined, 'attack-damage', 30)] }),
    s.attack('soldier-tf2-super-rocket-jump-assault', { expect: [s.lastDamage(50), s.row('source', 'backguard'), s.ready('source', true)] }),
    s.attack('soldier-tf2-super-kamikaze', { expect: [s.lastDamage(90), s.hpChange('source', -30)] }),
  ],
});
