import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '055-clearmind',
  scenarios: [s.utility({
    setup: { units: [
      { ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1, conditions: [{ name: 'cowering' }] },
      { ref: 'ally2', cardId: '034-bob-ross', player: 0, row: 'vanguard', index: 2, conditions: [{ name: 'infected', amount: 10 }] },
    ] },
    choices: [{ refs: ['ally'] }],
    expect: [s.condition('ally', 'cowering', false), s.condition('ally2', 'infected', false), s.condition('ally', 'tranquil')],
  })],
});
