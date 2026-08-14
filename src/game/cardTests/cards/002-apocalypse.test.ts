import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '002-apocalypse',
  scenarios: [
    s.continuous('apocalypse-ancient-dominion-0', { expect: [s.modifierTotal('defender', undefined, 'defense', -10)] }),
    s.trigger('apocalypse-survival-of-the-fittest-1', 'unit-vanquished', {
      eventTarget: 'fallen-combine',
      setup: { sourceHp: 100, cards: [{ ref: 'fallen-combine', cardId: '069-conscript', player: 0, zone: 'vanquished' }] },
      expect: [s.hpChange('source', 10)],
    }),
    s.attack('apocalypse-horsemen-ascend', { choices: [{ refs: ['deck-unit'] }, { optionIds: ['slot:0:backguard:2'] }], expect: [s.zone('deck-unit', 'backguard'), s.ready('deck-unit', true)] }),
    s.attack('apocalypse-plasma-cannon', { surplus: 2, expect: [s.tappedChange(0, 6), s.lastDamage(90), s.hpChange('defender', -90)] }),
  ],
});
