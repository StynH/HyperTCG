import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '028-aleph-fcr-joint-mission',
  scenarios: [
    s.utility({ choices: [{ refs: ['defender'] }], expect: [s.modifier('defender', undefined, 'marked', true)] }),
  ],
});
