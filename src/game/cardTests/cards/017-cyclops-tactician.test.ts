import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '017-cyclops-tactician',
  scenarios: [
    s.activated('cyclops-field-discipline-0', {
      setup: { units: [{ ref: 'ally', cardId: '034-bob-ross', player: 0, row: 'vanguard', index: 1 }] },
      choices: [{ refs: ['ally'] }],
      expect: [s.row('ally', 'backguard'), s.ready('ally', true)],
    }),
    s.attack('cyclops-optic-blast', { expect: [s.lastDamage(30), s.row('defender', 'backguard')] }),
    s.attack('cyclops-tactical-reposition', { choices: [{ refs: ['ally', 'ally2'] }], expect: [s.row('ally', 'backguard'), s.row('ally2', 'backguard'), s.ready('ally', true), s.zoneCountChange(0, 'hand', 1)] }),
  ],
});
