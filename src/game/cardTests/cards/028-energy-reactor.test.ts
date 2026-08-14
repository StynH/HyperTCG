import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '028-energy-reactor',
  scenarios: [
    s.continuous('energy-reactor-additional-energy', { expect: [s.modifierTotal(undefined, 0, 'extra-energy-play', 1)] }),
    s.trigger('energy-reactor-collapse', 'unit-vanquished', {
      eventTarget: 'fallen',
      damageType: 'attack',
      setup: { cards: [{ ref: 'fallen', cardId: '069-conscript', player: 0, zone: 'vanquished' }] },
      expect: [s.zone('source', 'vanquished')],
    }),
    s.utility({ expect: [s.zone('source', 'utilities')] }),
  ],
});
