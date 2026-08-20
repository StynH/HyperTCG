import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '031-cse-siphoning-laser',
  scenarios: [
    s.utility({ expect: [s.zone('source', 'utilities')] }),
    s.continuous('cse-siphoning-laser-tap-0', { expect: [s.modifier(undefined, 1, 'energy-enters-exhausted', true)] }),
  ],
});
