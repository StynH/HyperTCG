import { defineGameplayCardTest } from '../../gameplayTestTypes';
import * as s from '../../scenarioBuilders';

export default defineGameplayCardTest({
  cardId: '019-the-losing-battle',
  scenarios: [
    s.opponentAttack('001-aleph-atomic-titan', 'aleph-atomic-titan-titan-fist', 'ally', { setup: { units: [{ ref: 'ally', cardId: '037-aleph-striker', player: 0, row: 'vanguard', index: 1, hp: 100 }], energies: [{ ref: 'oe', player: 1, type: 'boson' }] }, choices: [{ refs: ['source'] }], expect: [s.hp('ally', 80)] }),
  ],
});
