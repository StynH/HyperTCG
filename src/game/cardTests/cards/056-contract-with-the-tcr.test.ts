import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

const threeXTremists = { units: [
  { ref: 'ally', cardId: '034-bob-ross', player: 0 as const, row: 'vanguard' as const, index: 1 },
  { ref: 'ally2', cardId: '038-eminem', player: 0 as const, row: 'vanguard' as const, index: 2 },
  { ref: 'ally3', cardId: '023-squidward', player: 0 as const, row: 'backguard' as const, index: 1 },
] };

export default defineGameplayCardTest({
  cardId: '056-contract-with-the-tcr',
  scenarios: [
    s.continuous('contract-with-the-tcr-type', { setup: threeXTremists, expect: [s.modifier('ally', undefined, 'add-card-type', true, 'TCR')] }),
    s.activated('contract-with-the-tcr-draw', { setup: threeXTremists, expect: [s.zoneCountChange(0, 'hand', 1)] }),
    s.utility({ expect: [s.zone('source', 'utilities')] }),
  ],
});
