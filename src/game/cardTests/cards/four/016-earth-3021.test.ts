import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '016-earth-3021',
  scenarios: [
    s.utility({ expect: [s.zone('source', 'utilities')] }),
    s.trigger('earth-3021-ramp-0', 'construction-advanced', { controller: 0, setup: { energies: [{ ref: 'tap-e', player: 0, type: 'gluon', isTapped: true }] }, choices: [{ refs: ['tap-e'] }], expect: [s.ready('tap-e', true)] }),
  ],
});
