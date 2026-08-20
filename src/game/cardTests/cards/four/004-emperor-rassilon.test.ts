import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '004-emperor-rassilon',
  scenarios: [
    s.opponentPlayUnit('opponent-hand-unit', 'vanguard', 3, { covers: ['trigger:emperor-rassilon-web-of-time-0'], expect: [s.ready('opponent-hand-unit', false)] }),
  ],
});
