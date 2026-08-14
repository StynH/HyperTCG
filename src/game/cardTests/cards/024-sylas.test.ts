import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '024-sylas',
  scenarios: [
    s.continuous('sylas-chainbreaker-0', { expect: [s.modifier('source', undefined, 'cannot-afflict-condition', true, 'paralyzed'), s.modifier('source', undefined, 'ignore-rotation-prevention')] }),
    s.attack('sylas-kingslayer', {
      setup: { units: [{ ref: 'defender', cardId: '008-jean-luc-picard', player: 1, row: 'vanguard', index: 0, hp: 1000 }] },
      expect: [s.lastDamage(50), s.hpChange('defender', -50)],
    }),
    s.attack('sylas-kingslayer', { name: 'Kingslayer remains 20 Damage against a non-Leader', expect: [s.lastDamage(20)] }),
    s.attack('sylas-chain-lash', { effectRoll: 6, expect: [s.lastDamage(40), s.modifier('defender', undefined, 'cannot-rotate')] }),
    s.attack('sylas-chain-lash', { name: 'Chain Lash allows Rotation below DR 6', effectRoll: 5, expect: [s.modifier('defender', undefined, 'cannot-rotate', false)] }),
  ],
});
