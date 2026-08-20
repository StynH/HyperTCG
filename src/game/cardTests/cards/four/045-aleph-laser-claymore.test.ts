import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '045-aleph-laser-claymore',
  scenarios: [
    s.opponentAttack('001-aleph-atomic-titan', 'aleph-atomic-titan-titan-fist', 'ally', { setup: { units: [{ ref: 'ally', cardId: '037-aleph-striker', player: 0, row: 'vanguard', index: 1, hp: 1000 }] }, choices: [{ refs: ['source'] }], expect: [s.hp('opponent-attacker', 170)] }),
  ],
});
