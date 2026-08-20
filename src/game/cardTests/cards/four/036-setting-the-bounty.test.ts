import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '036-setting-the-bounty',
  scenarios: [
    s.utility({ choices: [{ refs: ['defender'] }], expect: [s.modifier('defender', undefined, 'marked', true)] }),
  ],
});
