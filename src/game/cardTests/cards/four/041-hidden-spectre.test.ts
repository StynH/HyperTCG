import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '041-hidden-spectre',
  scenarios: [
    s.continuous('hidden-spectre-hidden-0', { setup: { sourceRow: 'backguard' }, expect: [s.modifier('source', undefined, 'cannot-target-by-opponent', true)] }),
    s.attack('hidden-spectre-cold-reach', { expect: [s.lastDamage(20), s.hpChange('defender', -20)] }),
  ],
});
