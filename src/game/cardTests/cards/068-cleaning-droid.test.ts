import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '068-cleaning-droid',
  scenarios: [s.attack('cleaning-droid-scrub', {
    setup: { units: [{ ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1, conditions: [{ name: 'cowering' }, { name: 'infected', amount: 10 }] }] },
    choices: [{ refs: ['ally'] }],
    expect: [s.condition('ally', 'cowering', false), s.condition('ally', 'infected', false)],
  })],
});
