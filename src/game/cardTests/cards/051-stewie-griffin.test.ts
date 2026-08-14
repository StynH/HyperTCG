import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '051-stewie-griffin',
  scenarios: [
    s.trigger('stewie-griffin-prototype-workshop-0', 'played', { eventTarget: 'source', choices: [{ refs: ['deck-equipment'] }], expect: [s.zone('deck-equipment', 'hand')] }),
    s.attack('stewie-ray-gun', { effectRoll: 7, expect: [s.lastDamage(20), s.condition('defender', 'paralyzed')] }),
    s.attack('stewie-ray-gun', { name: 'Ray Gun does not Paralyze below DR 7', effectRoll: 6, expect: [s.condition('defender', 'paralyzed', false)] }),
    s.attack('stewie-time-machine', { choices: [{ refs: ['vanquished-unit'] }], expect: [s.zone('vanquished-unit', 'hand')] }),
  ],
});
