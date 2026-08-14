import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '032-zephyr-strike',
  scenarios: [s.utility({
    setup: { units: [{ ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1, isReady: false }] },
    choices: [{ refs: ['ally'] }],
    expect: [s.ready('ally', true), s.modifierTotal('ally', undefined, 'attack-damage', 20)],
  })],
});
