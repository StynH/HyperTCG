import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '007-garen-crownguard',
  scenarios: [
    s.continuous('garen-crownguard-courage-of-the-republic-0', {
      setup: { units: [{ ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1 }] },
      expect: [s.modifierTotal('ally', undefined, 'attack-damage-taken', -10)],
    }),
    s.activated('garen-crownguard-perseverance-1', { setup: { sourceHp: 100 }, expect: [s.hpChange('source', 20), s.usedAction('source', 'garen-crownguard-perseverance-1')] }),
    s.attack('garen-decisive-strike', {
      setup: { units: [{ ref: 'defender', cardId: '069-conscript', player: 1, row: 'vanguard', index: 0, hp: 10 }] },
      expect: [s.zone('defender', 'vanquished'), s.ready('source', true)],
    }),
    s.attack('garen-decisive-strike', {
      name: 'Decisive Strike Exhausts Garen when it does not Vanquish the defender',
      expect: [s.hpChange('defender', -50), s.ready('source', false)],
    }),
    s.attack('garen-demacian-justice', { defenseRoll: 1, expect: [s.lastDamage(80), s.hpChange('defender', -80)] }),
  ],
});
