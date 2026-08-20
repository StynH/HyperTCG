import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '049-fcr-rpg-launcher',
  scenarios: [
    s.attack('fcr-rpg-launcher-armor-crack', { covers: ['attack:fcr-rpg-launcher-armor-crack', 'utility'], name: 'Armor Crack tears into an expensive Unit', setup: { units: [{ ref: 'rebel', cardId: '037-aleph-striker', player: 0, row: 'vanguard', index: 3 }, { ref: 'defender', cardId: '025-isu-carrier', player: 1, row: 'vanguard', index: 0, hp: 1000 }] }, choices: [{ refs: ['rebel'] }], expect: [s.attached('source', 'rebel'), s.lastDamage(60)] }),
    s.attack('fcr-rpg-launcher-armor-crack', { name: 'Armor Crack deals its base against a cheap Unit', setup: { units: [{ ref: 'rebel', cardId: '037-aleph-striker', player: 0, row: 'vanguard', index: 3 }] }, choices: [{ refs: ['rebel'] }], expect: [s.lastDamage(30)] }),
  ],
});
