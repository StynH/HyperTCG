import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '047-crushing-grip',
  scenarios: [
    s.utility({ choices: [{ refs: ['defender'] }], expect: [s.modifierTotal('defender', undefined, 'defense', -30), s.modifier('defender', undefined, 'cannot-rotate', true)] }),
  ],
});
