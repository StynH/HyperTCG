import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '035-isu-warp-gate',
  scenarios: [
    s.construction({ setup: { sourceCompletion: 0 }, expect: [s.zone('source', 'utilities')] }),
    s.trigger('isu-warp-gate-completed-0', 'played', { eventSource: 'rebel', controller: 0, setup: { sourceDone: true, units: [{ ref: 'rebel', cardId: '037-aleph-striker', player: 0, row: 'vanguard', index: 1 }], energies: [{ ref: 'tap-e', player: 0, type: 'muon', isTapped: true }] }, choices: [{ refs: ['tap-e'] }], expect: [s.ready('tap-e', true)] }),
  ],
});
