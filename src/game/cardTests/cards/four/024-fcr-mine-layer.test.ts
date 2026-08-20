import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '024-fcr-mine-layer',
  scenarios: [
    s.attack('fcr-mine-layer-lay-mines', { choices: [{ refs: ['defender'] }], expect: [s.modifier('defender', undefined, 'damage-on-attack', true)] }),
  ],
});
