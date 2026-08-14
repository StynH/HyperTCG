import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

const citizen = { units: [{ ref: 'ally', cardId: '067-civilian', player: 0 as const, row: 'vanguard' as const, index: 1 }] };

export default defineGameplayCardTest({
  cardId: '040-geert-wilders',
  scenarios: [
    s.continuous('geert-wilders-populist-appeal-0', { setup: citizen, expect: [s.modifierTotal('ally', undefined, 'defense', 10), s.modifierTotal('ally', undefined, 'attack-damage', 10)] }),
    s.attack('wilders-loud-rhetoric', { setup: citizen, expect: [s.modifierTotal('ally', undefined, 'defense', 30)] }),
    s.attack('wilders-border-control', { expect: [s.modifier(undefined, 1, 'cannot-play-backguard')] }),
  ],
});
