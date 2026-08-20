import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '012-combine-advisor',
  scenarios: [
    s.activated('combine-advisor-psychic-dominion-0', { setup: { units: [{ ref: 'cond', cardId: '069-conscript', player: 1, row: 'vanguard', index: 3, conditions: [{ name: 'weakened' }] }] }, choices: [{ refs: ['cond'] }], expect: [s.ready('cond', false)] }),
    s.attack('combine-advisor-telekinetic-crush', { name: 'Telekinetic Crush hits harder into a Conditioned Unit', setup: { units: [{ ref: 'defender', cardId: '069-conscript', player: 1, row: 'vanguard', index: 0, hp: 1000, conditions: [{ name: 'weakened' }] }] }, expect: [s.lastDamage(70)] }),
    s.attack('combine-advisor-telekinetic-crush', { name: 'Telekinetic Crush deals its base against an unafflicted Unit', expect: [s.lastDamage(50)] }),
  ],
});
