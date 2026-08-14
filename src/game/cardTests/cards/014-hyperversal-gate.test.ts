import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '014-hyperversal-gate',
  scenarios: [s.utility({
    choices: [
      { refs: ['deck-unit', 'deck-low-unit'] },
      { optionIds: ['slot:0:vanguard:3', 'slot:0:backguard:2'] },
      { choose: 'minimum' },
    ],
    expect: [s.zone('deck-unit', 'vanguard'), s.zone('deck-low-unit', 'backguard'), s.zoneCountChange(0, 'energies', -2)],
  })],
});
