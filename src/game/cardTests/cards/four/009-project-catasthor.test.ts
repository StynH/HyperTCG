import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '009-project-catasthor',
  scenarios: [
    s.construction({ setup: { sourceCompletion: 2 }, expect: [s.zone('source', 'utilities')] }),
    s.activated('project-catasthor-completed-0', { setup: { sourceDone: true }, choices: [{ refs: ['defender'] }], expect: [s.zone('defender', 'vanquished')] }),
  ],
});
