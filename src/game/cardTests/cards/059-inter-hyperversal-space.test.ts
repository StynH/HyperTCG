import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '059-inter-hyperversal-space',
  scenarios: [s.utility({
    setup: { cards: [{ ref: 'equipment', cardId: '092-keltec-pr57', player: 0, zone: 'utilities', attachedTo: 'ally' }] },
    choices: [{ refs: ['ally'] }],
    expect: [s.zone('ally', 'hand'), s.zone('equipment', 'vanquished')],
  })],
});
