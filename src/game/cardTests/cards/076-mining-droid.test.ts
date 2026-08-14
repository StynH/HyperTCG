import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '076-mining-droid',
  scenarios: [s.attack('mining-droid-extract', { choices: [{ refs: ['deck-energy'] }], expect: [s.zone('deck-energy', 'hand')] })],
});
