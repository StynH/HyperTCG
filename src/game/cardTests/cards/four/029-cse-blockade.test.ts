import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '029-cse-blockade',
  scenarios: [
    s.utility({ expect: [s.zone('source', 'utilities')] }),
    s.continuous('cse-blockade-tax-0', { expect: [s.modifier(undefined, 1, 'cannot-play-backguard', true)] }),
  ],
});
