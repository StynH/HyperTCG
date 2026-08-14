import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

const xTeam = { units: [
  { ref: 'ally', cardId: '034-bob-ross', player: 0 as const, row: 'vanguard' as const, index: 1 },
  { ref: 'ally2', cardId: '038-eminem', player: 0 as const, row: 'vanguard' as const, index: 2 },
  { ref: 'ally3', cardId: '004-cyclops-super', player: 0 as const, row: 'backguard' as const, index: 1 },
] };

export default defineGameplayCardTest({
  cardId: '023-squidward',
  scenarios: [
    s.continuous('squidward-perpetually-miserable-0', { expect: [s.modifier('source', undefined, 'cannot-afflict-condition', true, 'cowering')] }),
    s.attack('squidward-hide-behind-bob', { expect: [s.row('source', 'backguard'), s.ready('source', true)] }),
    s.attack('squidward-panicked-flail', { effectRoll: 6, expect: [s.lastDamage(60), s.hpChange('defender', -60)] }),
    s.attack('squidward-clarinet-screech', { setup: xTeam, choices: [{ refs: ['defender'] }], expect: [s.condition('defender', 'cowering'), s.condition('enemy2', 'cowering')] }),
    s.attack('squidward-clarinet-screech', { name: 'Clarinet Screech affects only its target without three allies', choices: [{ refs: ['defender'] }], expect: [s.condition('defender', 'cowering'), s.condition('enemy2', 'cowering', false)] }),
  ],
});
