import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '054-vale',
  scenarios: [
    s.continuous('vale-comms-officer-0', { expect: [s.modifierTotal(undefined, 0, 'utility-cost', -1)] }),
    s.attack('vale-five-minutes', { choices: [{ refs: ['defender'] }], expect: [s.condition('defender', 'cowering')] }),
    s.attack('vale-orbital-relay', { choices: [{ refs: ['deck-utility'] }], expect: [s.zone('deck-utility', 'hand')] }),
    s.attack('vale-orbital-relay', { name: 'Orbital Relay bottoms all five if no Utility is chosen', choices: [{ choose: 'none' }], expect: [s.zoneCountChange(0, 'hand', 0)] }),
  ],
});
