import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '013-citadel',
  scenarios: [
    s.continuous('citadel-fortification', {
      setup: { units: [{ ref: 'ally', cardId: '069-conscript', player: 0, row: 'vanguard', index: 1 }] },
      expect: [s.modifierTotal('ally', undefined, 'defense', 20)],
    }),
    s.activated('citadel-deployment', { choices: [{ refs: ['deck-unit'] }, { optionIds: ['slot:0:backguard:2'] }], expect: [s.zone('deck-unit', 'backguard'), s.ready('deck-unit', true)] }),
    s.utility({ expect: [s.zone('source', 'utilities')] }),
  ],
});
