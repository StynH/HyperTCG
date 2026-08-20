import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '001-aleph-atomic-titan',
  scenarios: [
    s.trigger('aleph-atomic-titan-unstable-atomic-core-0', 'unit-vanquished', { damageType: 'attack', expect: [s.hpChange('defender', -30), s.hpChange('ally', -30)] }),
    s.attack('aleph-atomic-titan-titan-fist', { expect: [s.lastDamage(60), s.hpChange('defender', -60)] }),
    s.attack('aleph-atomic-titan-atomic-annihilator', { setup: { energies: [{ ref: 'my-e', player: 0, type: 'boson' }] }, choices: [{ refs: ['my-e'] }], expect: [s.lastDamage(120), s.zone('my-e', 'vanquished')] }),
  ],
});
