import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

const strategistBoard = { units: [
  { ref: 'ally', cardId: '034-bob-ross', player: 0 as const, row: 'vanguard' as const, index: 1 },
  { ref: 'ally2', cardId: '038-eminem', player: 0 as const, row: 'vanguard' as const, index: 2 },
  { ref: 'ally3', cardId: '023-squidward', player: 0 as const, row: 'backguard' as const, index: 1 },
] };

export default defineGameplayCardTest({
  cardId: '003-barack-obama',
  scenarios: [
    s.continuous('barack-obama-de-facto-strategist-0', { setup: strategistBoard, expect: [s.modifierTotal('ally', undefined, 'defense', 20)] }),
    s.attack('obama-let-me-be-clear', { choices: [{ refs: ['hand-card'] }], expect: [s.zone('hand-card', 'deck'), s.zoneCountChange(0, 'hand', 1)] }),
    s.attack('obama-negotiated-terms', { choices: [{ refs: ['defender'] }], expect: [s.condition('defender', 'cowering'), s.modifier('defender', undefined, 'cannot-rotate')] }),
  ],
});
