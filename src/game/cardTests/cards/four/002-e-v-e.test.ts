import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '002-e-v-e',
  scenarios: [
    s.activated('eve-imperial-mainframe-0', { setup: { units: [{ ref: 'sce', cardId: '039-cse-trooper', player: 0, row: 'backguard', index: 2 }], cards: [{ ref: 'top-util', cardId: '044-2spooky4me', player: 0, zone: 'deck', top: true }] }, choices: [{ refs: ['top-util'] }], expect: [s.zone('top-util', 'hand')] }),
    s.trigger('eve-total-systems-access-1', 'played', { eventSource: 'played-util', controller: 0, setup: { units: [{ ref: 'sce', cardId: '039-cse-trooper', player: 0, row: 'backguard', index: 2 }], cards: [{ ref: 'played-util', cardId: '044-2spooky4me', player: 0, zone: 'vanquished' }], energies: [{ ref: 'tap-e', player: 0, type: 'gluon', isTapped: true }] }, choices: [{ refs: ['tap-e'] }], expect: [s.ready('tap-e', true)] }),
  ],
});
