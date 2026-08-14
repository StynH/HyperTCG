import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '066-andy-king',
  scenarios: [s.attack('andy-king-civic-duty', { expect: [s.zoneCountChange(0, 'hand', 1)] })],
});
