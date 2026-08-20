import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '026-prime-collector',
  scenarios: [
    s.trigger('prime-collector-collection-fee-0', 'unit-vanquished', { eventSource: 'source', eventTarget: 'victim', setup: { cards: [{ ref: 'victim', cardId: '069-conscript', player: 0, zone: 'vanquished' }], modifiers: [{ source: 'source', target: 'victim', kind: 'marked', text: 'bounty' }] }, expect: [s.zoneCountChange(0, 'hand', 1)] }),
    s.attack('prime-collector-close-account', { expect: [s.lastDamage(30), s.hpChange('defender', -30)] }),
  ],
});
