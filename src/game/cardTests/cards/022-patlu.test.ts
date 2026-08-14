import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

const bruiserAlly = { units: [{ ref: 'ally', cardId: '022-patlu', player: 0 as const, row: 'vanguard' as const, index: 1 }] };

export default defineGameplayCardTest({
  cardId: '022-patlu',
  scenarios: [
    s.continuous('patlu-one-punch-doctrine-0', { setup: bruiserAlly, expect: [s.modifierTotal('source', undefined, 'attack-damage', 10)] }),
    s.attack('patlu-jab', { setup: bruiserAlly, expect: [s.lastDamage(30), s.hpChange('defender', -30)] }),
    s.attack('patlu-one-punch', { name: 'ONE PUNCH fails at DR 10', setup: bruiserAlly, effectRoll: 10, expect: [s.hpChange('defender', 0)] }),
    s.attack('patlu-one-punch', { name: 'ONE PUNCH deals 100 Damage above DR 10', setup: bruiserAlly, effectRoll: 11, expect: [s.lastDamage(100), s.hpChange('defender', -100)] }),
  ],
});
