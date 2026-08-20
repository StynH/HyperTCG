import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '008-rolento',
  scenarios: [
    s.continuous('rolento-guerrilla-commander-0', { name: 'Guerrilla Commander buffs the first Rebels attack while behind', setup: { energies: [{ ref: 'oe', player: 1, type: 'boson' }] }, expect: [s.modifierTotal('source', undefined, 'attack-damage', 20)] }),
    s.activated('rolento-final-act-1', { setup: { energies: [{ ref: 'oe', player: 1, type: 'boson' }, { ref: 'oe2', player: 1, type: 'boson' }, { ref: 'my-pay', player: 0, type: 'muon' }], units: [{ ref: 'big', cardId: '025-isu-carrier', player: 1, row: 'vanguard', index: 3 }] }, choices: [{ refs: ['my-pay'] }, { refs: ['big'] }], expect: [s.zone('big', 'vanquished'), s.zone('source', 'vanquished')] }),
    s.attack('rolento-grenade-assault', { expect: [s.lastDamage(50), s.hpChange('defender', -50)] }),
  ],
});
