import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '018-ebony-maw',
  scenarios: [
    s.continuous('ebony-maw-silken-counsel-0', {
      setup: { sourceRow: 'backguard', units: [{ ref: 'ally', cardId: '069-conscript', player: 0, row: 'vanguard', index: 1 }] },
      expect: [s.modifierTotal('ally', undefined, 'defense', 10)],
    }),
    s.attack('ebony-maw-whispered-persuasion', { choices: [{ refs: ['defender'] }], expect: [s.row('defender', 'backguard'), s.ready('defender', false)] }),
    s.attack('ebony-maw-your-suffering-will-be-legendary', { expect: [s.lastDamage(30), s.condition('defender', 'cursed')] }),
  ],
});
