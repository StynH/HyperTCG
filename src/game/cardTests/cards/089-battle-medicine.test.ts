import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '089-battle-medicine',
  scenarios: [s.utility({
    setup: { units: [{ ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1, hp: 10, conditions: [{ name: 'cowering' }, { name: 'infected', amount: 10 }] }] },
    choices: [{ refs: ['ally'] }],
    expect: [s.hpChange('ally', 30), s.condition('ally', 'cowering', false), s.condition('ally', 'infected', false)],
  })],
});
