import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '085-soldier',
  scenarios: [
    s.attack('combine-soldier-standard-issue', { expect: [s.lastDamage(10), s.hpChange('defender', -10)] }),
    s.attack('combine-soldier-squad-fire', {
      setup: { units: [
        { ref: 'infantry1', cardId: '085-soldier', player: 0, row: 'vanguard', index: 1 },
        { ref: 'infantry2', cardId: '085-soldier', player: 0, row: 'vanguard', index: 2 },
      ] },
      expect: [s.lastDamage(40), s.hpChange('defender', -40)],
    }),
  ],
});
