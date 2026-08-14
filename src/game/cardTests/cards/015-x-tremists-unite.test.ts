import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

const threeXTremists = { units: [
  { ref: 'ally', cardId: '034-bob-ross', player: 0 as const, row: 'vanguard' as const, index: 1, isReady: false },
  { ref: 'ally2', cardId: '038-eminem', player: 0 as const, row: 'vanguard' as const, index: 2, isReady: false },
  { ref: 'ally3', cardId: '023-squidward', player: 0 as const, row: 'backguard' as const, index: 1, isReady: false },
] };

export default defineGameplayCardTest({
  cardId: '015-x-tremists-unite',
  scenarios: [
    s.utility({ setup: threeXTremists, expect: [s.ready('ally', true), s.ready('ally2', true), s.ready('ally3', true), s.modifierTotal('ally', undefined, 'attack-damage', 20)] }),
    s.utility({ name: 'X-Tremists Unite cannot be played with fewer than three X-Tremists', setup: { sparseBoard: true }, expect: [s.error('three X-Tremists')] }),
  ],
});
