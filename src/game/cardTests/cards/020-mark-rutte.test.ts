import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '020-mark-rutte',
  scenarios: [
    s.trigger('mark-rutte-mission-briefing-0', 'played', {
      eventTarget: 'source',
      setup: { cards: [{ ref: 'top-utility', cardId: '089-battle-medicine', player: 0, zone: 'deck', top: true }] },
      choices: [{ refs: ['top-utility'] }],
      expect: [s.zone('top-utility', 'hand')],
    }),
    s.trigger('mark-rutte-mission-briefing-0', 'played', {
      name: 'Mission Briefing bottoms all four cards when no Utility is chosen',
      eventTarget: 'source',
      setup: { cards: [{ ref: 'top-utility', cardId: '089-battle-medicine', player: 0, zone: 'deck', top: true }] },
      choices: [{ choose: 'none' }],
      expect: [s.zonePosition('top-utility', 'deck', 'bottom', 4), s.zoneCountChange(0, 'hand', 0)],
    }),
    s.attack('rutte-assignment-orders', {
      setup: {
        units: [{ ref: 'leader', cardId: '008-jean-luc-picard', player: 0, row: 'vanguard', index: 3 }],
        cards: [{ ref: 'instant-utility', cardId: '030-splinter-groups', player: 0, zone: 'deck', top: true }],
      },
      choices: [{ refs: ['instant-utility'] }],
      expect: [s.zone('instant-utility', 'hand'), s.zoneCountChange(0, 'hand', 2)],
    }),
    s.attack('rutte-assignment-orders', {
      name: 'Assignment Orders searches but does not draw without a Leader',
      setup: { cards: [{ ref: 'instant-utility', cardId: '030-splinter-groups', player: 0, zone: 'deck', top: true }] },
      choices: [{ refs: ['instant-utility'] }],
      expect: [s.zone('instant-utility', 'hand'), s.zoneCountChange(0, 'hand', 1)],
    }),
    s.attack('rutte-bureaucratic-delay', { choices: [{ refs: ['defender'] }], expect: [s.ready('defender', false)] }),
  ],
});
