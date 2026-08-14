import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '058-infiltration-strike',
  scenarios: [s.utility({ choices: [{ refs: ['enemy3'] }], expect: [s.hpChange('enemy3', -30)] })],
});
