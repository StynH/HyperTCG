import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '025-vengeful-spectre',
  scenarios: [
    s.opponentAttack('069-conscript', 'conscript-ordered-forward', 'source', {
      covers: ['trigger:vengeful-spectre-grave-return-0'],
      setup: { sourceHp: 10, cards: [{ ref: 'other-spectre', cardId: '036-disaster-spectre', player: 0, zone: 'vanquished' }] },
      choices: [{ refs: ['other-spectre'] }],
      expect: [s.zone('source', 'vanquished'), s.zone('other-spectre', 'hand')],
    }),
    s.attack('vengeful-spectre-retribution', {
      setup: { cards: [
        { ref: 'spectre1', cardId: '036-disaster-spectre', player: 0, zone: 'vanquished' },
        { ref: 'spectre2', cardId: '046-observing-spectre', player: 0, zone: 'vanquished' },
      ] },
      expect: [s.lastDamage(40), s.hpChange('defender', -40)],
    }),
    s.attack('vengeful-spectre-mark-of-doom', { effectRoll: 18, choices: [{ refs: ['defender'] }], expect: [s.condition('defender', 'doomed')] }),
    s.attack('vengeful-spectre-mark-of-doom', { name: 'Mark of Doom does not apply below DR 18', effectRoll: 17, choices: [{ refs: ['defender'] }], expect: [s.condition('defender', 'doomed', false)] }),
  ],
});
