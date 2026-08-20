import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '038-combine-grub',
  scenarios: [
    s.trigger('combine-grub-metamorphic-stock-0', 'unit-vanquished', { eventTarget: 'source', setup: { cards: [{ ref: 'mystic', cardId: '012-combine-advisor', player: 0, zone: 'deck', top: true }] }, choices: [{ refs: ['mystic'] }], expect: [s.zone('mystic', 'hand')] }),
  ],
});
