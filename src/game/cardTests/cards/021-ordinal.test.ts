import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

const combineUnits = { units: [
  { ref: 'ally', cardId: '085-soldier', player: 0 as const, row: 'vanguard' as const, index: 1 },
  { ref: 'ally2', cardId: '069-conscript', player: 0 as const, row: 'vanguard' as const, index: 2 },
] };

export default defineGameplayCardTest({
  cardId: '021-ordinal',
  scenarios: [
    s.continuous('ordinal-ordinal-command-0', { setup: combineUnits, expect: [s.modifierTotal('ally', undefined, 'attack-damage', 10)] }),
    s.attack('ordinal-redeploy', { setup: combineUnits, choices: [{ refs: ['ally', 'ally2'] }], expect: [s.row('ally', 'backguard'), s.row('ally2', 'backguard'), s.ready('ally', true), s.ready('ally2', true)] }),
    s.attack('ordinal-tactical-overlay', { setup: combineUnits, expect: [s.modifierTotal('ally', undefined, 'defense', 20), s.modifierTotal('ally2', undefined, 'defense', 20)] }),
  ],
});
