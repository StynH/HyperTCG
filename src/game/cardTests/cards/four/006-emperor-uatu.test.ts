import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '006-emperor-uatu',
  scenarios: [
    s.continuous('emperor-uatu-all-seeing-0', { expect: [s.modifier(undefined, 1, 'reveal-hand', true)] }),
    s.activated('emperor-uatu-foreseen-outcome-1', { covers: ['activated:emperor-uatu-foreseen-outcome-1'], choices: [{ refs: ['opponent-hand-unit'] }], expect: [s.modifier('opponent-hand-unit', undefined, 'marked', true)] }),
    s.opponentPlayUnit('opponent-hand-unit', 'vanguard', 3, { covers: ['trigger:emperor-uatu-foreseen-outcome-1'], setup: { modifiers: [{ source: 'source', target: 'opponent-hand-unit', kind: 'marked', text: 'foreseen' }] }, expect: [s.zoneCountChange(0, 'hand', 1)] }),
  ],
});
