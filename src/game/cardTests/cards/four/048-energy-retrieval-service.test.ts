import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '048-energy-retrieval-service',
  scenarios: [
    s.utility({ setup: { cards: [{ ref: 've1', cardId: 'energy-boson', player: 0, zone: 'vanquished' }, { ref: 've2', cardId: 'energy-muon', player: 0, zone: 'vanquished' }] }, choices: [{ refs: ['ve1', 've2'] }], expect: [s.zone('ve1', 'hand'), s.zone('ve2', 'hand')] }),
  ],
});
