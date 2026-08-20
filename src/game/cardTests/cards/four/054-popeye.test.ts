import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '054-popeye',
  scenarios: [
    s.continuous('popeye-overwhelming-presence-0', { covers: ['continuous:popeye-overwhelming-presence-0'], expect: [s.modifier('ally', undefined, 'cannot-target-by-opponent', true)] }),
    s.attack('popeye-toon-force-obliterating-blow', { name: 'Toon Force quadruples on a Critical Hit', criticalRoll: 20, expect: [s.lastDamage(400)] }),
    s.attack('popeye-toon-force-obliterating-blow', { name: 'Toon Force deals its base without a Critical', expect: [s.lastDamage(100)] }),
  ],
});
