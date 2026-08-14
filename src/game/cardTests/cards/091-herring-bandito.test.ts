import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '091-herring-bandito',
  scenarios: [s.attack('herring-bandito-empty-the-clip', {
    covers: ['utility', 'attack:herring-bandito-empty-the-clip'],
    effectRoll: 4,
    setup: { units: [{ ref: 'ally', cardId: '067-civilian', player: 0, row: 'vanguard', index: 1 }] },
    choices: [{ refs: ['ally'] }],
    expect: [s.attached('source', 'ally'), s.lastDamage(60), s.hpChange('defender', -60)],
  })],
});
