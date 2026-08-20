import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '010-project-voidstar-cannon',
  scenarios: [
    s.construction({ setup: { sourceCompletion: 3 }, expect: [s.zone('source', 'utilities')] }),
    s.activated('project-voidstar-cannon-completed-0', { setup: { sourceDone: true, cards: [{ ref: 'glass', cardId: '011-project-voidstar-looking-glass', player: 0, zone: 'utilities', done: true }] }, expect: [s.zone('defender', 'vanquished'), s.zone('enemy2', 'vanquished')] }),
  ],
});
