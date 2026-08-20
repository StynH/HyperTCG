import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '044-2spooky4me',
  scenarios: [
    s.utility({ setup: { cards: [{ ref: 'spectre', cardId: '041-hidden-spectre', player: 0, zone: 'deck', top: true }] }, choices: [{ refs: ['spectre'] }], expect: [s.zone('spectre', 'hand')] }),
  ],
});
