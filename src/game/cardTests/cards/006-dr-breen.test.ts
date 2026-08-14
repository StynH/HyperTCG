import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '006-dr-breen',
  scenarios: [
    s.continuous('dr-breen-harmonious-development-0', {
      setup: { units: [{ ref: 'ally', cardId: '069-conscript', player: 0, row: 'vanguard', index: 1 }] },
      expect: [s.modifierTotal('ally', undefined, 'defense', 10)],
    }),
    s.friendlyAttack('069-conscript', 'conscript-ordered-forward', {
      covers: ['continuous:dr-breen-overwatch-command-1'],
      setup: {
        units: [
          { ref: 'ally', cardId: '069-conscript', player: 0, row: 'vanguard', index: 1 },
          { ref: 'defender', cardId: '069-conscript', player: 1, row: 'vanguard', index: 0, conditions: [{ name: 'cowering' }] },
        ],
      },
      expect: [s.lastDamage(20), s.hpChange('defender', -20)],
    }),
    s.attack('breen-instrument-of-our-doctrine', { choices: [{ refs: ['deck-unit'] }], expect: [s.zone('deck-unit', 'hand')] }),
    s.attack('breen-address-to-the-citizenry', {
      setup: { units: [{ ref: 'ally', cardId: '069-conscript', player: 0, row: 'vanguard', index: 1 }] },
      expect: [s.modifierTotal('ally', undefined, 'attack-damage-taken', -10), s.modifier('ally', undefined, 'cannot-afflict-condition', true, 'any')],
    }),
  ],
});
