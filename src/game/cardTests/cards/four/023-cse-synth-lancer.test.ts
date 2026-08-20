import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '023-cse-synth-lancer',
  scenarios: [
    s.attack('cse-synth-lancer-lance-charge', { name: 'Lance Charge hits a Weakened Unit harder', setup: { units: [{ ref: 'defender', cardId: '069-conscript', player: 1, row: 'vanguard', index: 0, hp: 1000, conditions: [{ name: 'weakened' }] }] }, expect: [s.lastDamage(70)] }),
    s.attack('cse-synth-lancer-lance-charge', { name: 'Lance Charge deals its base otherwise', expect: [s.lastDamage(50)] }),
  ],
});
