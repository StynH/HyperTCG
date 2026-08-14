import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '026-yoko-littner',
  scenarios: [
    s.continuous('yoko-littner-covering-fire-0', { setup: { sourceRow: 'backguard' }, expect: [s.modifierTotal('ally', undefined, 'attack-damage', 10)] }),
    s.attack('yoko-sidearm', { expect: [s.lastDamage(20), s.hpChange('defender', -20)] }),
    s.attack('yoko-superconducting-rifle', { choices: [{ refs: ['defender'] }], expect: [s.hpChange('defender', -20)] }),
    s.attack('yoko-overcharged-round', { defenseRoll: 1, expect: [s.lastDamage(40), s.hpChange('defender', -40)] }),
  ],
});
