import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

const titanomachy = 'lucille-de-labora-titanomachy-0';
const retaliation = 'lucille-de-labora-titanomachy-critical-retaliation';

export default defineGameplayCardTest({
  cardId: '103-lucille-de-labora',
  scenarios: [
    s.opponentAttack('069-conscript', 'conscript-ordered-forward', 'source', {
      name: 'Titanomachy prevents the first Attack Damage Vanquish during each opposing turn',
      covers: [`trigger:${titanomachy}`],
      setup: {
        sourceHp: 10,
        units: [{ ref: 'opponent-attacker', cardId: '069-conscript', player: 1, row: 'vanguard', index: 2 }],
      },
      criticalRoll: 10,
      defenseRoll: 94,
      expect: [
        s.hp('source', 10),
        s.zone('source', 'vanguard'),
        s.zone('opponent-attacker', 'vanguard'),
        s.usedAction('source', titanomachy),
      ],
    }),
    s.opponentAttack('069-conscript', 'conscript-ordered-forward', 'source', {
      name: 'Titanomachy cannot prevent a second non-Critical Vanquish in the same opposing turn',
      covers: [`trigger:${titanomachy}`],
      setup: {
        sourceHp: 10,
        units: [{ ref: 'opponent-attacker', cardId: '069-conscript', player: 1, row: 'vanguard', index: 2 }],
        usedActions: [{ source: 'source', actionId: titanomachy }],
      },
      criticalRoll: 10,
      defenseRoll: 94,
      expect: [s.zone('source', 'vanquished'), s.zone('opponent-attacker', 'vanguard')],
    }),
    s.opponentAttack('069-conscript', 'conscript-ordered-forward', 'source', {
      name: 'A later Critical Hit Vanquishes Lucille and the attacking Unit together',
      covers: [`trigger:${retaliation}`],
      setup: {
        sourceHp: 10,
        units: [{ ref: 'opponent-attacker', cardId: '069-conscript', player: 1, row: 'vanguard', index: 2 }],
        usedActions: [{ source: 'source', actionId: titanomachy }],
      },
      criticalRoll: 20,
      defenseRoll: 94,
      expect: [s.zone('source', 'vanquished'), s.zone('opponent-attacker', 'vanquished')],
    }),
    s.attack('lucille-bring-it-down', {
      name: 'Bring It Down deals 10 Damage only for Boson Energy selected and Exhausted as its X cost',
      setup: {
        defaultEnergyCopies: 0,
        energies: [
          { ref: 'boson-1', player: 0, type: 'boson' },
          { ref: 'boson-2', player: 0, type: 'boson' },
          { ref: 'boson-3', player: 0, type: 'boson' },
          { ref: 'gluon-1', player: 0, type: 'gluon' },
        ],
      },
      choices: [{ refs: ['boson-1', 'boson-2', 'gluon-1'] }],
      criticalRoll: 10,
      defenseRoll: 94,
      expect: [s.tappedChange(0, 3), s.ready('boson-3', true), s.lastDamage(20), s.hpChange('defender', -20)],
    }),
  ],
});
