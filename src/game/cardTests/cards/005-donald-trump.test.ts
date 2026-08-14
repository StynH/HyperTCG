import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '005-donald-trump',
  scenarios: [
    s.activated('donald-trump-deal-maker-0', { choices: [{ refs: ['hand-card'] }], expect: [s.zone('hand-card', 'deck'), s.zoneCountChange(0, 'hand', 1), s.usedAction('source', 'donald-trump-deal-maker-0')] }),
    s.attack('trump-build-the-wall', { expect: [s.modifier(undefined, 1, 'cannot-rotate')] }),
    s.attack('trump-executive-order', {
      setup: { cards: [{ ref: 'opponent-utility', cardId: '028-energy-reactor', player: 1, zone: 'utilities' }] },
      choices: [{ refs: ['opponent-utility'] }],
      expect: [s.zone('opponent-utility', 'vanquished')],
    }),
  ],
});
