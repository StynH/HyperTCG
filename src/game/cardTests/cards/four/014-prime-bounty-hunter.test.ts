import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '014-prime-bounty-hunter',
  scenarios: [
    s.trigger('prime-bounty-hunter-paid-in-full-0', 'unit-vanquished', { eventSource: 'source', setup: { energies: [{ ref: 'tap-e', player: 0, type: 'muon', isTapped: true }] }, choices: [{ refs: ['tap-e'] }], expect: [s.ready('tap-e', true)] }),
    s.attack('prime-bounty-hunter-dead-or-alive', { name: 'Dead or Alive finishes a bountied target for more', setup: { modifiers: [{ source: 'source', target: 'defender', kind: 'marked', text: 'bounty' }] }, expect: [s.lastDamage(60)] }),
    s.attack('prime-bounty-hunter-dead-or-alive', { name: 'Dead or Alive deals its base against an unmarked target', expect: [s.lastDamage(40)] }),
  ],
});
