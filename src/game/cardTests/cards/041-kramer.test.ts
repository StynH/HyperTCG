import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '041-kramer',
  scenarios: [
    s.continuous('kramer-management-0', {
      setup: { cards: [{ ref: 'hand-xperience', cardId: '022-patlu', player: 0, zone: 'hand' }] },
      expect: [s.modifierTotal('hand-xperience', undefined, 'play-cost', -1)],
    }),
    s.attack('kramer-wrong-garage', {
      effectRoll: 4,
      setup: { cards: [{ ref: 'deck-xperience', cardId: '022-patlu', player: 0, zone: 'deck', top: true }] },
      choices: [{ refs: ['deck-xperience'] }],
      expect: [s.zone('deck-xperience', 'hand')],
    }),
    s.attack('kramer-wrong-garage', { name: 'Wrong Garage does not search below DR 4', effectRoll: 3, expect: [s.zoneCountChange(0, 'hand', 0)] }),
  ],
});
