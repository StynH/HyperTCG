import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '003-emperor-metron',
  scenarios: [
    s.activated('emperor-metron-grand-design-0', { setup: { cards: [{ ref: 'con', cardId: '035-isu-warp-gate', player: 0, zone: 'utilities', completion: 0 }] }, choices: [{ refs: ['con'] }], expect: [s.zoneCountChange(0, 'hand', 1)] }),
    s.trigger('emperor-metron-knowledge-beyond-worlds-1', 'construction-done', { controller: 0, expect: [s.zoneCountChange(0, 'hand', 1)] }),
  ],
});
