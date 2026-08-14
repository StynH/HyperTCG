import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '011-terra',
  scenarios: [
    s.continuous('terra-darkness-within-0', { setup: { sourceConditions: [{ name: 'infected', amount: 10 }] }, expect: [s.modifierTotal('source', undefined, 'attack-damage', 20)] }),
    s.attack('terra-earthshaker', { setup: { sourceConditions: [{ name: 'infected', amount: 10 }] }, expect: [s.lastDamage(50), s.hpChange('defender', -50)] }),
    s.attack('terra-earthshaker', { name: 'Earthshaker remains 30 Damage without a Condition', expect: [s.lastDamage(30)] }),
    s.attack('terra-rock-breaker', { choices: [{ refs: ['enemy2'] }], expect: [s.lastDamage(40), s.hpChange('enemy2', -20)] }),
    s.attack('terra-fatal-mode', { expect: [s.lastDamage(100), s.condition('source', 'cursed')] }),
  ],
});
