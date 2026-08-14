import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '073-guard',
  scenarios: [
    s.attack('guard-riot-shield', { expect: [s.modifierTotal('source', undefined, 'attack-damage-taken', -10)] }),
    s.attack('guard-baton-strike', { expect: [s.lastDamage(20), s.hpChange('defender', -20)] }),
  ],
});
