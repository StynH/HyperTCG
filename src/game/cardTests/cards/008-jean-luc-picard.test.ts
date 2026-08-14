import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '008-jean-luc-picard',
  scenarios: [
    s.continuous('jean-luc-picard-supreme-leader-0', {
      setup: { units: [{ ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1 }] },
      expect: [s.modifierTotal('ally', undefined, 'defense', 10), s.modifier('ally', undefined, 'cannot-afflict-condition', true, 'cowering')],
    }),
    s.attack('picard-make-it-so', { expect: [s.zoneCountChange(0, 'hand', 2)] }),
    s.attack('picard-red-alert', {
      setup: { sourceHp: 10, units: [{ ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1, hp: 10 }] },
      expect: [s.hpChange('source', 30), s.hpChange('ally', 30)],
    }),
  ],
});
