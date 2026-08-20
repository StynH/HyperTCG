import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '011-project-voidstar-looking-glass',
  scenarios: [
    s.construction({ setup: { sourceCompletion: 1 }, expect: [s.zone('source', 'utilities')] }),
    s.continuous('project-voidstar-looking-glass-completed-0', { setup: { sourceDone: true, units: [{ ref: 'sce', cardId: '022-cse-star-fighter', player: 0, row: 'vanguard', index: 1 }] }, expect: [s.modifier('sce', undefined, 'can-target-backguard', true)] }),
  ],
});
