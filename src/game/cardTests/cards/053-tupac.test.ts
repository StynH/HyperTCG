import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '053-tupac',
  scenarios: [
    s.attack('tupac-all-eyez', { expect: [s.modifierTotal('source', undefined, 'defense', 20), s.logIncludes('Revealed')] }),
    s.attack('tupac-hit-em-up', { effectRoll: 7, expect: [s.lastDamage(30), s.condition('defender', 'weakened')] }),
    s.attack('tupac-hit-em-up', { name: 'Hit Em Up does not Weaken below DR 7', effectRoll: 6, expect: [s.condition('defender', 'weakened', false)] }),
  ],
});
