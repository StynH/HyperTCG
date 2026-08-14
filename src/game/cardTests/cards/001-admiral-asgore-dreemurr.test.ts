import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '001-admiral-asgore-dreemurr',
  scenarios: [
    s.continuous('admiral-asgore-dreemurr-unstoppable-advance-0', {
      expect: [s.modifier('source', undefined, 'cannot-afflict-condition', true, 'paralyzed'), s.modifier('source', undefined, 'cannot-afflict-condition', true, 'cowering')],
    }),
    s.opponentAttack('069-conscript', 'conscript-ordered-forward', 'source', {
      covers: ['trigger:admiral-asgore-dreemurr-weight-of-the-trident-1', 'continuous:admiral-asgore-dreemurr-weight-of-the-trident-1'],
      setup: { units: [{ ref: 'opponent-attacker', cardId: '069-conscript', player: 1, row: 'vanguard', index: 2, hp: 50 }] },
      expect: [s.hpChange('opponent-attacker', -10)],
    }),
    s.attack('asgore-molten-trident', { effectRoll: 1, expect: [s.lastDamage(60), s.condition('defender', 'infected', true, 10)] }),
    s.attack('asgore-molten-trident', { name: 'Molten Trident prevents Rotation on an even DR', effectRoll: 2, expect: [s.modifier('defender', undefined, 'cannot-rotate'), s.condition('defender', 'infected', false)] }),
    s.attack('asgore-spiral-of-flame', { expect: [s.lastDamage(100), s.hpChange('defender', -100), s.hpChange('enemy2', -20)] }),
  ],
});
