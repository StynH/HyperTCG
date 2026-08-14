import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '084-sentry',
  scenarios: [
    s.attack('sentry-lock-on', { choices: [{ refs: ['defender'] }], expect: [s.modifierTotal('defender', undefined, 'defense', -20)] }),
    s.attack('sentry-turret-fire', { expect: [s.lastDamage(20), s.hpChange('defender', -20)] }),
  ],
});
