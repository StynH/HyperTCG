import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '018-project-parabellum',
  scenarios: [
    s.construction({ setup: { sourceCompletion: 0 }, expect: [s.zone('source', 'utilities')] }),
    s.trigger('project-parabellum-completed-0', 'unit-vanquished', { controller: 0, eventTarget: 've', setup: { sourceDone: true, cards: [{ ref: 've', cardId: 'energy-boson', player: 0, zone: 'vanquished' }] }, expect: [s.zoneCountChange(0, 'hand', 1)] }),
  ],
});
