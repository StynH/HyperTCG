import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '015-earth-prime',
  scenarios: [
    s.utility({ expect: [s.zone('source', 'utilities')] }),
    s.activated('earth-prime-search-0', { setup: { cards: [{ ref: 'ass', cardId: '042-prime-infiltrator', player: 0, zone: 'deck', top: true }] }, choices: [{ refs: ['ass'] }], expect: [s.zone('ass', 'hand')] }),
  ],
});
