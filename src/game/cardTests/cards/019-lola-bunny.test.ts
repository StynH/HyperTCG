import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '019-lola-bunny',
  scenarios: [
    s.activated('lola-bunny-unit-registration-0', {
      setup: { cards: [{ ref: 'deck-x', cardId: '034-bob-ross', player: 0, zone: 'deck', top: true }] },
      choices: [{ refs: ['deck-x'] }],
      expect: [s.zone('deck-x', 'hand')],
    }),
    s.attack('lola-fast-break', { choices: [{ refs: ['ally'] }], expect: [s.zoneCountChange(0, 'hand', 1), s.row('ally', 'backguard'), s.ready('ally', true)] }),
    s.attack('lola-assist', { effectRoll: 4, expect: [s.zoneCountChange(0, 'hand', 2)] }),
    s.attack('lola-assist', { name: 'Assist draws nothing below DR 4', effectRoll: 3, expect: [s.zoneCountChange(0, 'hand', 0)] }),
  ],
});
