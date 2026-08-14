import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '036-disaster-spectre',
  scenarios: [
    s.attack('disaster-spectre-herald-of-ruin', { expect: [s.lastDamage(20), s.condition('defender', 'infected', true, 10)] }),
    s.attack('disaster-spectre-collapse', { effectRoll: 7, expect: [s.lastDamage(30), s.condition('defender', 'cursed')] }),
    s.attack('disaster-spectre-collapse', { name: 'Collapse does not Curse below DR 7', effectRoll: 6, expect: [s.condition('defender', 'cursed', false)] }),
  ],
});
