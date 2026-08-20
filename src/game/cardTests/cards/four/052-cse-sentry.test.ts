import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '052-cse-sentry',
  scenarios: [
    s.continuous('cse-sentry-bulwark-protocol-0', { setup: { cards: [{ ref: 'con', cardId: '009-project-catasthor', player: 0, zone: 'utilities' }] }, expect: [s.modifierTotal('source', undefined, 'attack-damage-taken', -20)] }),
    s.attack('cse-sentry-sentry-fire', { name: 'Sentry Fire punishes a Conditioned opposing board', setup: { units: [{ ref: 'cond', cardId: '069-conscript', player: 1, row: 'vanguard', index: 3, conditions: [{ name: 'weakened' }] }] }, expect: [s.lastDamage(40)] }),
    s.attack('cse-sentry-sentry-fire', { name: 'Sentry Fire deals its base against a clean board', expect: [s.lastDamage(20)] }),
  ],
});
