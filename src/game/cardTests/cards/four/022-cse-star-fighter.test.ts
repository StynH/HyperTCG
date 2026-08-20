import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '022-cse-star-fighter',
  scenarios: [
    s.attack('cse-star-fighter-interdiction-run', { name: 'Interdiction Run ignores Defense against an Exhausted Unit', setup: { units: [{ ref: 'defender', cardId: '069-conscript', player: 1, row: 'vanguard', index: 0, hp: 1000, isReady: false }] }, defenseRoll: 20, expect: [s.lastDamage(40)] }),
    s.attack('cse-star-fighter-interdiction-run', { name: 'Interdiction Run is halved by a Ready Unit Defense', defenseRoll: 20, expect: [s.lastDamage(20)] }),
  ],
});
