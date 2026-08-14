import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '088-trooper',
  scenarios: [
    s.attack('trooper-service-rifle', { expect: [s.lastDamage(10), s.hpChange('defender', -10)] }),
    s.attack('trooper-formation-fire', {
      setup: { units: [
        { ref: 'infantry1', cardId: '088-trooper', player: 0, row: 'vanguard', index: 1 },
        { ref: 'infantry2', cardId: '088-trooper', player: 0, row: 'vanguard', index: 2 },
      ] },
      expect: [s.lastDamage(40), s.hpChange('defender', -40)],
    }),
  ],
});
