import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '079-retrieval-machine',
  scenarios: [
    s.attack('retrieval-machine-salvage', { choices: [{ refs: ['vanquished-unit'] }], expect: [s.zone('vanquished-unit', 'hand')] }),
    s.attack('retrieval-machine-grapple', { effectRoll: 3, expect: [s.lastDamage(20), s.row('defender', 'backguard')] }),
    s.attack('retrieval-machine-grapple', { name: 'Grapple does not Rotate below DR 3', effectRoll: 2, expect: [s.row('defender', 'vanguard')] }),
  ],
});
