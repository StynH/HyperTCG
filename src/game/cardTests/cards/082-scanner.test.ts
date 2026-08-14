import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '082-scanner',
  scenarios: [s.attack('scanner-flash-scan', { choices: [{ refs: ['deck-unit'] }], expect: [s.zone('deck-unit', 'hand')] })],
});
