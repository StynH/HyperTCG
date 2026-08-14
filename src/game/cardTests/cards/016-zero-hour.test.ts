import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '016-zero-hour',
  scenarios: [s.opponentAttack('069-conscript', 'conscript-ordered-forward', 'ally', {
    setup: { units: [{ ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1, hp: 10, isReady: false }] },
    choices: [{ refs: ['source'] }],
    expect: [s.zone('source', 'vanquished'), s.hp('ally', 30), s.ready('ally', true)],
  })],
});
