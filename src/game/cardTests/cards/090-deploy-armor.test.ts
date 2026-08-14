import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '090-deploy-armor',
  scenarios: [
    s.utility({
      name: 'Deploy Armor gives a Machine +40 max HP and +10 DEF',
      covers: ['utility', 'continuous:deploy-armor-hp-machine', 'continuous:deploy-armor-defense'],
      setup: { units: [{ ref: 'ally', cardId: '068-cleaning-droid', player: 0, row: 'vanguard', index: 1 }] },
      choices: [{ refs: ['ally'] }],
      expect: [s.attached('source', 'ally'), s.modifierTotal('ally', undefined, 'max-hp', 40), s.modifierTotal('ally', undefined, 'defense', 10)],
    }),
    s.utility({
      name: 'Deploy Armor gives a non-Machine +20 max HP',
      covers: ['continuous:deploy-armor-hp-other'],
      choices: [{ refs: ['ally'] }],
      expect: [s.modifierTotal('ally', undefined, 'max-hp', 20)],
    }),
  ],
});
