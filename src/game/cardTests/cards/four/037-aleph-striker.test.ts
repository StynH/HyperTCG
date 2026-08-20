import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '037-aleph-striker',
  scenarios: [
    s.attack('aleph-striker-opportunity-strike', { name: 'Opportunity Strike hits harder while behind on Energy', setup: { energies: [{ ref: 'oe', player: 1, type: 'boson' }] }, expect: [s.lastDamage(50)] }),
    s.attack('aleph-striker-opportunity-strike', { name: 'Opportunity Strike deals its base when not behind', expect: [s.lastDamage(30)] }),
  ],
});
