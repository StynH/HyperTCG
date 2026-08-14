import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '093-narrow-escape',
  scenarios: [s.opponentAttack('069-conscript', 'conscript-ordered-forward', 'ally', {
    setup: { units: [{ ref: 'ally', cardId: '034-bob-ross', player: 0, row: 'vanguard', index: 1, hp: 100 }] },
    choices: [{ refs: ['source'] }],
    expect: [s.hpChange('ally', 0), s.row('ally', 'backguard'), s.ready('ally', true), s.zone('source', 'vanquished')],
  })],
});
