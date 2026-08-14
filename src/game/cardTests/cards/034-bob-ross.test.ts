import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '034-bob-ross',
  scenarios: [
    s.friendlyAttack('035-cremator', 'cremator-scorched-earth', {
      covers: ['activated:bob-ross-no-mistakes-only-happy-accidents-0'],
      effectRoll: 1,
      choices: [{ ability: { source: 'source', abilityId: 'bob-ross-no-mistakes-only-happy-accidents-0' } }],
      expect: [s.usedAction('source', 'bob-ross-no-mistakes-only-happy-accidents-0')],
    }),
    s.attack('bob-ross-serene-presence', { choices: [{ refs: ['ally'] }], expect: [s.condition('ally', 'tranquil')] }),
    s.attack('bob-ross-beat-the-devil-out-of-it', { expect: [s.lastDamage(20), s.hpChange('defender', -20)] }),
  ],
});
