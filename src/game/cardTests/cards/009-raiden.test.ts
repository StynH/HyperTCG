import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '009-raiden',
  scenarios: [
    s.attack('raiden-high-frequency-blade', {
      covers: ['attack:raiden-high-frequency-blade', 'trigger:raiden-zandatsu-0'],
      setup: { sourceHp: 50, units: [{ ref: 'defender', cardId: '069-conscript', player: 1, row: 'vanguard', index: 0, hp: 10 }] },
      expect: [s.zone('defender', 'vanquished'), s.hpChange('source', 30)],
    }),
    s.attack('raiden-ripper-mode', { effectRoll: 6, expect: [s.lastDamage(80), s.ready('source', true)] }),
    s.attack('raiden-ripper-mode', { name: 'Ripper Mode Exhausts Raiden below DR 6', effectRoll: 5, expect: [s.ready('source', false)] }),
  ],
});
