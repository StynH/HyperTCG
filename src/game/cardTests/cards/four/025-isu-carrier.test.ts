import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '025-isu-carrier',
  scenarios: [
    s.opponentAttack('013-fission-bomb-walker', 'fission-bomb-walker-fission-bomb', 'source', { covers: ['continuous:isu-carrier-layered-hull-0'], expect: [s.hpChange('source', -80)] }),
    s.attack('isu-carrier-point-defense', { expect: [s.lastDamage(30), s.hpChange('defender', -30)] }),
  ],
});
