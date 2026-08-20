import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '005-emperor-saruman',
  scenarios: [
    s.continuous('emperor-saruman-voice-of-saruman-0', { setup: { units: [{ ref: 'weak', cardId: '069-conscript', player: 1, row: 'vanguard', index: 3, conditions: [{ name: 'weakened' }] }] }, expect: [s.modifierTotal('weak', undefined, 'defense', -20)] }),
    s.trigger('emperor-saruman-break-their-will-1', 'condition-afflicted', { eventTarget: 'weak', controller: 1, setup: { units: [{ ref: 'weak', cardId: '069-conscript', player: 1, row: 'vanguard', index: 3, conditions: [{ name: 'weakened' }] }] }, expect: [s.ready('weak', false)] }),
  ],
});
