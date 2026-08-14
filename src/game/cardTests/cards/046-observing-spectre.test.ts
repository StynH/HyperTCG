import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '046-observing-spectre',
  scenarios: [
    s.continuous('observing-spectre-unseen-0', {
      setup: { units: [{ ref: 'ally', cardId: '036-disaster-spectre', player: 0, row: 'vanguard', index: 1 }] },
      expect: [s.modifierTotal('source', undefined, 'attack-damage-taken', -10)],
    }),
    s.attack('observing-spectre-watching', { choices: [{ refs: ['opponent-deck-0'] }, { choose: 'maximum' }], expect: [s.zone('opponent-deck-0', 'deck'), s.zoneCountChange(1, 'deck', 0)] }),
    s.attack('observing-spectre-cold-touch', { expect: [s.lastDamage(20), s.condition('defender', 'weakened')] }),
  ],
});
