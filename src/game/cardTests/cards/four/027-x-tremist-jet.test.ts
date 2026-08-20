import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '027-x-tremist-jet',
  scenarios: [
    s.activated('x-tremist-jet-extraction-0', { setup: { units: [{ ref: 'xt', cardId: '027-x-tremist-jet', player: 0, row: 'backguard', index: 0 }] }, choices: [{ refs: ['xt'] }], expect: [s.zone('xt', 'hand')] }),
    s.attack('x-tremist-jet-strafing-run', { expect: [s.lastDamage(40), s.row('source', 'backguard'), s.ready('source', false)] }),
  ],
});
