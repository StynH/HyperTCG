import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '070-demoman',
  scenarios: [
    s.attack('demoman-sticky-trap', { effectRoll: 4, choices: [{ refs: ['defender'] }], expect: [s.hpChange('defender', -40)] }),
    s.attack('demoman-grenade-launcher', { effectRoll: 1, expect: [s.lastDamage(20), s.hpChange('defender', -20), s.hpChange('source', -20)] }),
    s.attack('demoman-grenade-launcher', { name: 'Grenade Launcher does not recoil above DR 1', effectRoll: 2, expect: [s.hpChange('source', 0)] }),
  ],
});
