import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '042-prime-infiltrator',
  scenarios: [
    s.attack('prime-infiltrator-silent-takedown', { covers: ['attack:prime-infiltrator-silent-takedown', 'continuous:prime-infiltrator-inside-job-0'], target: 'enemy3', expect: [s.lastDamage(20), s.hpChange('enemy3', -20)] }),
  ],
});
