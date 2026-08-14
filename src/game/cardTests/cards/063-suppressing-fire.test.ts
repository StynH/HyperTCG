import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '063-suppressing-fire',
  scenarios: [s.utility({
    expect: [
      s.hpChange('defender', -10), s.hpChange('enemy2', -10),
      s.modifierTotal('defender', undefined, 'defense', -10),
      s.modifierTotal('enemy2', undefined, 'defense', -10),
    ],
  })],
});
