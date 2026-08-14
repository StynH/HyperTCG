import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '062-overwatch-directive',
  scenarios: [
    s.trigger('overwatch-directive-fire', 'unit-rotated', { eventTarget: 'defender', controller: 1, expect: [s.hpChange('defender', -10)] }),
    s.trigger('overwatch-directive-fire', 'unit-rotated', { name: 'Overwatch Directive does not damage a friendly rotating Unit', eventTarget: 'ally', controller: 0, expect: [s.hpChange('ally', 0)] }),
    s.utility({ expect: [s.zone('source', 'utilities')] }),
  ],
});
