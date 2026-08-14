import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '029-planet-n8318',
  scenarios: [
    s.continuous('planet-n8318-defense', {
      setup: { units: [{ ref: 'ally', cardId: '034-bob-ross', player: 0, row: 'vanguard', index: 1 }] },
      expect: [s.modifierTotal('ally', undefined, 'defense', 20)],
    }),
    s.activated('planet-n8318-rotate', {
      setup: { units: [{ ref: 'ally', cardId: '034-bob-ross', player: 0, row: 'vanguard', index: 1 }] },
      choices: [{ refs: ['ally'] }],
      expect: [s.row('ally', 'backguard'), s.ready('ally', true)],
    }),
    s.utility({ expect: [s.zone('source', 'utilities')] }),
  ],
});
