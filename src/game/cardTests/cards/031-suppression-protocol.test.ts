import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '031-suppression-protocol',
  scenarios: [
    s.utility({ choices: [{ refs: ['defender'] }], expect: [s.condition('defender', 'paralyzed'), s.condition('defender', 'weakened')] }),
    s.utility({ name: 'Suppression Protocol does not Weaken a non-Citizen non-Infantry Unit', choices: [{ refs: ['enemy3'] }], expect: [s.condition('enemy3', 'paralyzed'), s.condition('enemy3', 'weakened', false)] }),
  ],
});
