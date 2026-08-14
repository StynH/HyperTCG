import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '042-lawmaker',
  scenarios: [
    s.continuous('lawmaker-regulated-travel-0', { expect: [s.modifier('defender', undefined, 'cannot-rotate')] }),
    s.attack('lawmaker-emergency-session', {
      setup: { cards: [{ ref: 'deck-continuous', cardId: '028-energy-reactor', player: 0, zone: 'deck', top: true }] },
      choices: [{ refs: ['deck-continuous'] }],
      expect: [s.zone('deck-continuous', 'hand')],
    }),
    s.attack('lawmaker-gavel', {
      setup: { units: [{ ref: 'leader', cardId: '008-jean-luc-picard', player: 0, row: 'vanguard', index: 3 }] },
      choices: [{ refs: ['defender'] }],
      expect: [s.ready('defender', false), s.condition('defender', 'cowering')],
    }),
    s.attack('lawmaker-gavel', { name: 'Gavel does not Cower without a Leader', choices: [{ refs: ['defender'] }], expect: [s.condition('defender', 'cowering', false)] }),
  ],
});
