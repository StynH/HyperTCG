import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '038-eminem',
  scenarios: [
    s.attack('eminem-lose-yourself', { effectRoll: 9, choices: [{ refs: ['defender'] }], expect: [s.condition('defender', 'cowering'), s.ready('source', true)] }),
    s.attack('eminem-lose-yourself', { name: 'Lose Yourself Exhausts Eminem below DR 9', effectRoll: 8, choices: [{ refs: ['defender'] }], expect: [s.ready('source', false)] }),
    s.attack('eminem-panic', { expect: [s.modifierTotal('source', undefined, 'defense', 30), s.zoneCountChange(0, 'hand', 1)] }),
  ],
});
