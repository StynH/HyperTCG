import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '061-one-punch',
  scenarios: [s.utility({
    setup: { units: [{ ref: 'ally', cardId: '022-patlu', player: 0, row: 'vanguard', index: 1 }] },
    choices: [{ refs: ['ally'] }],
    expect: [s.modifierTotal('ally', undefined, 'attack-damage', 30)],
  })],
});
