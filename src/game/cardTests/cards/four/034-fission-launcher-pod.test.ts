import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '034-fission-launcher-pod',
  scenarios: [
    s.attack('fission-launcher-pod-fission-launch', { covers: ['attack:fission-launcher-pod-fission-launch', 'utility'], setup: { units: [{ ref: 'rebel', cardId: '037-aleph-striker', player: 0, row: 'vanguard', index: 3 }], energies: [{ ref: 'my-e', player: 0, type: 'boson' }] }, choices: [{ refs: ['rebel'] }, { refs: ['my-e'] }], expect: [s.attached('source', 'rebel'), s.lastDamage(80), s.zone('my-e', 'vanquished')] }),
  ],
});
