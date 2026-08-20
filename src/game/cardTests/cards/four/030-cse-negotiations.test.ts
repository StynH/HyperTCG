import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '030-cse-negotiations',
  scenarios: [
    s.utility({ choices: [{ refs: ['defender'] }], expect: [s.condition('defender', 'weakened', true), s.modifier('defender', undefined, 'cannot-rotate', true)] }),
  ],
});
