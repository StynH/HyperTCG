import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '017-planetary-strike',
  scenarios: [
    s.utility({ expect: [s.hpChange('defender', -40), s.hpChange('enemy2', -40)] }),
  ],
});
