import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '004-cyclops-super',
  scenarios: [
    s.continuous('cyclops-lead-the-x-tremists-0', {
      setup: { units: [{ ref: 'ally', cardId: '034-bob-ross', player: 0, row: 'vanguard', index: 1 }] },
      expect: [s.modifierTotal('ally', undefined, 'attack-damage', 10)],
    }),
    s.attack('cyclops-super-pinpoint-beam', { defenseRoll: 1, expect: [s.lastDamage(30), s.hpChange('defender', -30)] }),
    s.attack('cyclops-super-wide-aperture', { expect: [s.lastDamage(60), s.hpChange('defender', -60)] }),
    s.attack('cyclops-super-visor-release', { expect: [s.lastDamage(90), s.modifier('source', undefined, 'cannot-attack')] }),
  ],
});
