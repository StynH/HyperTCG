import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '083-scout-droid',
  scenarios: [
    s.attack('scout-droid-recon-sweep', {
      setup: { cards: [{ ref: 'top-machine', cardId: '068-cleaning-droid', player: 0, zone: 'deck', top: true }] },
      choices: [{ refs: ['top-machine'] }],
      expect: [s.zone('top-machine', 'hand')],
    }),
    s.attack('scout-droid-recon-sweep', { name: 'Recon Sweep bottoms all four when no Machine is chosen', choices: [{ choose: 'none' }], expect: [s.zoneCountChange(0, 'hand', 0)] }),
    s.attack('scout-droid-spark', { expect: [s.lastDamage(10), s.hpChange('defender', -10)] }),
  ],
});
