import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '032-decapitation-strike',
  scenarios: [
    s.utility({ name: 'Decapitation Strike vanquishes a Leader or Tactician while behind', setup: { units: [{ ref: 'boss', cardId: '017-cyclops-tactician', player: 1, row: 'vanguard', index: 3 }], energies: [{ ref: 'oe', player: 1, type: 'boson' }] }, choices: [{ refs: ['boss'] }], expect: [s.zone('boss', 'vanquished')] }),
    s.utility({ name: 'Decapitation Strike does nothing when not behind', setup: { units: [{ ref: 'boss', cardId: '017-cyclops-tactician', player: 1, row: 'vanguard', index: 3 }] }, expect: [s.zone('boss', 'vanguard')] }),
  ],
});
