import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '069-conscript',
  scenarios: [
    s.attack('conscript-ordered-forward', { expect: [s.lastDamage(10), s.hpChange('defender', -10)] }),
    s.attack('conscript-human-wave', {
      setup: { units: [
        { ref: 'infantry1', cardId: '085-soldier', player: 0, row: 'vanguard', index: 1 },
        { ref: 'infantry2', cardId: '085-soldier', player: 0, row: 'vanguard', index: 2 },
        { ref: 'infantry3', cardId: '085-soldier', player: 0, row: 'backguard', index: 1 },
      ] },
      expect: [s.lastDamage(40), s.hpChange('defender', -40)],
    }),
    s.attack('conscript-human-wave', {
      name: 'Human Wave remains 20 Damage without three other Combine Infantry',
      expect: [s.lastDamage(20), s.hpChange('defender', -20)],
    }),
  ],
});
