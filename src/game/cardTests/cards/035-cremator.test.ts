import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '035-cremator',
  scenarios: [
    s.attack('cremator-immolate', { expect: [s.lastDamage(20), s.condition('defender', 'infected', true, 10)] }),
    s.attack('cremator-scorched-earth', { effectRoll: 5, expect: [s.lastDamage(30), s.condition('defender', 'infected', true, 20)] }),
    s.attack('cremator-scorched-earth', { name: 'Scorched Earth does not Infect below DR 5', effectRoll: 4, expect: [s.condition('defender', 'infected', false)] }),
  ],
});
