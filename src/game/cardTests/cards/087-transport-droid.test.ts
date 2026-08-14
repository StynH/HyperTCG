import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '087-transport-droid',
  scenarios: [
    s.attack('transport-droid-load-cargo', { choices: [{ refs: ['vanquished-unit'] }], expect: [s.zone('vanquished-unit', 'hand')] }),
    s.attack('transport-droid-heavy-haul', { choices: [{ refs: ['ally'] }], expect: [s.row('ally', 'backguard'), s.ready('ally', true)] }),
  ],
});
