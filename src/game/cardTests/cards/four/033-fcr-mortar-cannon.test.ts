import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '033-fcr-mortar-cannon',
  scenarios: [
    s.attack('fcr-mortar-cannon-indirect-fire', { covers: ['attack:fcr-mortar-cannon-indirect-fire', 'utility'], setup: { units: [{ ref: 'rebel', cardId: '037-aleph-striker', player: 0, row: 'vanguard', index: 3 }] }, choices: [{ refs: ['rebel'] }], expect: [s.attached('source', 'rebel'), s.lastDamage(40)] }),
  ],
});
