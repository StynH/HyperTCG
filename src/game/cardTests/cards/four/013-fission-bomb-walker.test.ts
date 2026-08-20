import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '013-fission-bomb-walker',
  scenarios: [
    s.attack('fission-bomb-walker-fission-bomb', { setup: { energies: [{ ref: 'my-e', player: 0, type: 'boson' }] }, choices: [{ refs: ['my-e'] }], expect: [s.lastDamage(100), s.zone('my-e', 'vanquished')] }),
  ],
});
