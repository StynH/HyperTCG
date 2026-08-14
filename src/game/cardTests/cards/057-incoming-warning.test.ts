import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '057-incoming-warning',
  scenarios: [s.opponentAttack('069-conscript', 'conscript-ordered-forward', 'ally', {
    setup: { units: [{ ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1, hp: 100 }] },
    choices: [{ refs: ['source'] }],
    expect: [s.lastDamage(0), s.hpChange('ally', 0), s.zone('source', 'vanquished'), s.zoneCountChange(0, 'hand', 0)],
  })],
});
