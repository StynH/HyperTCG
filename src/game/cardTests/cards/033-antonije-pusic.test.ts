import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '033-antonije-pusic',
  scenarios: [
    s.attack('pusic-clearance-denied', { choices: [{ refs: ['opponent-hand-utility'] }], expect: [s.zone('opponent-hand-utility', 'deck'), s.logIncludes('Revealed')] }),
    s.attack('pusic-counterintelligence', { expect: [s.zoneCountChange(0, 'hand', 1), s.logIncludes('Revealed')] }),
  ],
});
