import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '039-engineer',
  scenarios: [
    s.activated('engineer-field-repair-0', {
      setup: { units: [{ ref: 'ally', cardId: '068-cleaning-droid', player: 0, row: 'vanguard', index: 1, hp: 10 }] },
      choices: [{ refs: ['ally'] }],
      expect: [s.hpChange('ally', 10)],
    }),
    s.attack('engineer-sentry-deployment', { choices: [{ refs: ['deck-machine'] }, { optionIds: ['slot:0:backguard:2'] }], expect: [s.zone('deck-machine', 'backguard'), s.ready('deck-machine', true)] }),
    s.attack('engineer-arc-welder', { effectRoll: 5, expect: [s.lastDamage(20), s.condition('defender', 'paralyzed')] }),
    s.attack('engineer-arc-welder', { name: 'Arc Welder does not Paralyze below DR 5', effectRoll: 4, expect: [s.condition('defender', 'paralyzed', false)] }),
  ],
});
