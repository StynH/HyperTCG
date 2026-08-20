import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '053-dragoon',
  scenarios: [
    s.activated('dragoon-the-founder-0', { setup: { sparseBoard: true, cards: [{ ref: 'xt', cardId: '027-x-tremist-jet', player: 0, zone: 'deck', top: true }] }, choices: [{ refs: ['xt'] }, { optionIds: ['slot:0:backguard:2'] }, { refs: ['hand-card'] }], expect: [s.zone('xt', 'backguard'), s.zone('hand-card', 'vanquished')] }),
    s.attack('dragoon-x-cutter', { name: 'X-Cutter unleashes 200 with six X-Tremists', setup: { sparseBoard: true, units: [{ ref: 'defender', cardId: '069-conscript', player: 1, row: 'vanguard', index: 0, hp: 1000 }, { ref: 'xt1', cardId: '027-x-tremist-jet', player: 0, row: 'vanguard', index: 1 }, { ref: 'xt2', cardId: '027-x-tremist-jet', player: 0, row: 'vanguard', index: 2 }, { ref: 'xt3', cardId: '027-x-tremist-jet', player: 0, row: 'vanguard', index: 3 }, { ref: 'xt4', cardId: '027-x-tremist-jet', player: 0, row: 'backguard', index: 0 }, { ref: 'xt5', cardId: '027-x-tremist-jet', player: 0, row: 'backguard', index: 1 }] }, criticalRoll: 20, expect: [s.lastDamage(200)] }),
    s.attack('dragoon-x-cutter', { name: 'X-Cutter scales with a small squad and cannot Critical', setup: { sparseBoard: true, units: [{ ref: 'defender', cardId: '069-conscript', player: 1, row: 'vanguard', index: 0, hp: 1000 }, { ref: 'xt1', cardId: '027-x-tremist-jet', player: 0, row: 'vanguard', index: 1 }] }, criticalRoll: 20, expect: [s.lastDamage(20)] }),
  ],
});
