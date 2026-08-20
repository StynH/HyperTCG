import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '020-the-tomb-of-the-fallen-elder',
  scenarios: [
    s.utility({ expect: [s.zone('source', 'utilities')] }),
    s.activated('tomb-recur-0', { setup: { cards: [{ ref: 'dead-sce', cardId: '039-cse-trooper', player: 0, zone: 'vanquished' }] }, choices: [{ refs: ['dead-sce'] }], expect: [s.zone('dead-sce', 'deck'), s.zoneCountChange(0, 'hand', 1)] }),
  ],
});
