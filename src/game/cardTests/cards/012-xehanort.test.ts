import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '012-xehanort',
  scenarios: [
    s.continuous('xehanort-the-gazing-eye-0', { expect: [s.modifier(undefined, 1, 'reveal-hand')] }),
    s.trigger('xehanort-seeker-of-darkness-1', 'unit-vanquished', {
      eventTarget: 'fallen-enemy',
      setup: { sourceHp: 10, cards: [{ ref: 'fallen-enemy', cardId: '069-conscript', player: 1, zone: 'vanquished' }] },
      expect: [s.hpChange('source', 20)],
    }),
    s.attack('xehanort-no-name', { expect: [s.lastDamage(40), s.hpChange('defender', -40)] }),
    s.attack('xehanort-time-stop', { choices: [{ refs: ['defender'] }], expect: [s.condition('defender', 'paralyzed')] }),
    s.attack('xehanort-rain-of-keyblades', { expect: [s.lastDamage(70), s.condition('defender', 'weakened')] }),
  ],
});
