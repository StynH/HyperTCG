import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '030-splinter-groups',
  scenarios: [
    s.utility({
      name: 'Splinter Groups searches up to three low-cost Units with a Leader',
      setup: { units: [{ ref: 'leader', cardId: '008-jean-luc-picard', player: 0, row: 'vanguard', index: 3 }] },
      choices: [{ refs: ['deck-unit', 'deck-low-unit', 'deck-machine'] }],
      expect: [s.zone('deck-unit', 'hand'), s.zone('deck-low-unit', 'hand'), s.zone('deck-machine', 'hand')],
    }),
    s.utility({
      name: 'Splinter Groups is limited to two Units without a Leader',
      choices: [{ refs: ['deck-unit', 'deck-low-unit'] }],
      expect: [s.zone('deck-unit', 'hand'), s.zone('deck-low-unit', 'hand'), s.zoneCountChange(0, 'hand', 1)],
    }),
  ],
});
