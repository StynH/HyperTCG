import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '013-fission-bomb-walker',
  scenarios: [
    s.attack('fission-bomb-walker-fission-bomb', { setup: { energies: [{ ref: 'my-e', player: 0, type: 'boson' }] }, choices: [{ refs: ['my-e'] }], expect: [s.lastDamage(100), s.zone('my-e', 'vanquished')] }),
    s.attack('fission-bomb-walker-fission-bomb', { name: 'Vanquishes Energy as a cost even when the attack fails', setup: { energies: [{ ref: 'my-e', player: 0, type: 'boson' }] }, criticalRoll: 1, choices: [{ refs: ['my-e'] }], expect: [s.lastDamage(0), s.zone('my-e', 'vanquished')] }),
    s.attack('fission-bomb-walker-fission-bomb', { name: 'A completed Project Parabellum draws off the Energy sacrifice', setup: { energies: [{ ref: 'my-e', player: 0, type: 'boson' }], cards: [{ ref: 'parab', cardId: '018-project-parabellum', player: 0, zone: 'utilities', done: true }] }, choices: [{ refs: ['my-e'] }], expect: [s.zone('my-e', 'vanquished'), s.zoneCountChange(0, 'hand', 1)] }),
  ],
});
