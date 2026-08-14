import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '027-copycats',
  scenarios: [s.utility({
    setup: { units: [{ ref: 'ally', cardId: '022-patlu', player: 0, row: 'vanguard', index: 1, isReady: false }] },
    expect: [s.ready('ally', true), s.modifier('ally', undefined, 'add-card-type', true, 'X-Tremists')],
  })],
});
