import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '021-crystal-golem',
  scenarios: [
    s.opponentAttack('001-aleph-atomic-titan', 'aleph-atomic-titan-titan-fist', 'source', { covers: ['trigger:crystal-golem-resonant-shell-0'], defenseRoll: 3, expect: [s.hp('opponent-attacker', 180)] }),
    s.attack('crystal-golem-crystal-shard', { expect: [s.lastDamage(40), s.hpChange('defender', -40)] }),
  ],
});
