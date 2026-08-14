import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '064-transhuman-conditioning',
  scenarios: [
    s.continuous('transhuman-conditioning-immunity', {
      setup: { units: [{ ref: 'ally', cardId: '069-conscript', player: 0, row: 'vanguard', index: 1 }] },
      expect: [s.modifier('ally', undefined, 'cannot-afflict-condition', true, 'cowering'), s.modifier('ally', undefined, 'cannot-afflict-condition', true, 'weakened')],
    }),
    s.continuous('transhuman-conditioning-defense', {
      setup: { units: [{ ref: 'ally', cardId: '069-conscript', player: 0, row: 'vanguard', index: 1 }] },
      expect: [s.modifierTotal('ally', undefined, 'defense', 10)],
    }),
    s.utility({ expect: [s.zone('source', 'utilities')] }),
  ],
});
