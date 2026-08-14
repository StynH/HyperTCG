import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '048-sniper',
  scenarios: [
    s.attack('sniper-silent-shot', { effectRoll: 6, choices: [{ refs: ['defender'] }], expect: [s.hpChange('defender', -20), s.condition('defender', 'weakened')] }),
    s.attack('sniper-silent-shot', { name: 'Silent Shot does not Weaken below DR 6', effectRoll: 5, choices: [{ refs: ['defender'] }], expect: [s.condition('defender', 'weakened', false)] }),
    s.attack('sniper-headshot', { covers: ['attack:sniper-headshot', 'trigger:sniper-marked-target-0'], effectRoll: 18, expect: [s.lastDamage(60), s.hpChange('defender', -60)] }),
    s.attack('sniper-headshot', { name: 'Headshot is not Critical below DR 18', effectRoll: 17, expect: [s.lastDamage(30)] }),
  ],
});
