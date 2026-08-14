import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '065-2d',
  scenarios: [
    s.attack('2d-off-key', { expect: [s.lastDamage(10), s.hpChange('defender', -10)] }),
    s.attack('2d-on-melancholy-hill', {
      setup: { sourceHp: 10, units: [{ ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1, hp: 10 }] },
      expect: [s.hpChange('source', 10), s.hpChange('ally', 10)],
    }),
  ],
});
