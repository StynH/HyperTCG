import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '007-endymion',
  scenarios: [
    s.activated('endymion-lord-of-the-spectres-0', { setup: { cards: [{ ref: 'dead-spectre', cardId: '040-digi-spectre', player: 0, zone: 'vanquished' }] }, choices: [{ refs: ['dead-spectre'] }], expect: [s.zone('dead-spectre', 'hand')] }),
    s.attack('endymion-sovereign-haunt', { expect: [s.lastDamage(50), s.condition('defender', 'cursed', true)] }),
  ],
});
