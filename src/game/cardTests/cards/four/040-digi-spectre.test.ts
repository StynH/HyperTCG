import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '040-digi-spectre',
  scenarios: [
    s.trigger('digi-spectre-network-haunt-0', 'played', { eventTarget: 'source', setup: { units: [{ ref: 'spectre', cardId: '041-hidden-spectre', player: 0, row: 'backguard', index: 2 }] }, expect: [s.zoneCountChange(0, 'hand', 1)] }),
    s.attack('digi-spectre-data-spike', { expect: [s.lastDamage(30), s.hpChange('defender', -30)] }),
  ],
});
