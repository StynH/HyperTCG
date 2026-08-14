import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '052-tech-specialist',
  scenarios: [
    s.continuous('tech-specialist-systems-access-0', { setup: { units: [{ ref: 'ally', cardId: '068-cleaning-droid', player: 0, row: 'vanguard', index: 1 }] }, expect: [s.modifierTotal('ally', undefined, 'defense', 10)] }),
    s.attack('tech-specialist-recalibrate', {
      setup: { units: [{ ref: 'ally', cardId: '068-cleaning-droid', player: 0, row: 'vanguard', index: 1, isReady: false }] },
      choices: [{ refs: ['ally'] }],
      expect: [s.ready('ally', true)],
    }),
    s.attack('tech-specialist-overclock', {
      setup: { units: [{ ref: 'ally', cardId: '068-cleaning-droid', player: 0, row: 'vanguard', index: 1 }] },
      choices: [{ refs: ['ally'] }],
      expect: [s.modifierTotal('ally', undefined, 'attack-damage', 20)],
    }),
  ],
});
