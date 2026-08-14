import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

const swiftSwordsman = 'squidward-mercenary-swift-swordsman-0';
const unseenBlade = 'squidward-mercenary-unseen-blade';

export default defineGameplayCardTest({
  cardId: '104-squidward-mercenary',
  scenarios: [
    s.opponentPlayUnit('played-unit', 'vanguard', 3, {
      name: 'Swift Swordsman may sacrifice a controlled Muon Energy to damage the newly played Vanguard Unit',
      covers: [`trigger:${swiftSwordsman}`],
      setup: {
        defaultEnergyCopies: 0,
        cards: [{ ref: 'played-unit', cardId: '069-conscript', player: 1, zone: 'hand' }],
        energies: [
          { ref: 'muon-payment', player: 0, type: 'muon' },
          { ref: 'opponent-gluon', player: 1, type: 'gluon' },
        ],
      },
      choices: [{ choose: 'maximum' }],
      expect: [
        s.zone('played-unit', 'vanguard'),
        s.hp('played-unit', 30),
        s.zone('muon-payment', 'vanquished'),
        s.zoneCountChange(0, 'energies', -1),
        s.zoneCountChange(0, 'vanquished', 1),
      ],
    }),
    s.opponentPlayUnit('played-unit', 'vanguard', 3, {
      name: 'Swift Swordsman may be declined without sacrificing Energy or dealing Damage',
      covers: [`trigger:${swiftSwordsman}`],
      setup: {
        defaultEnergyCopies: 0,
        cards: [{ ref: 'played-unit', cardId: '069-conscript', player: 1, zone: 'hand' }],
        energies: [
          { ref: 'muon-payment', player: 0, type: 'muon' },
          { ref: 'opponent-gluon', player: 1, type: 'gluon' },
        ],
      },
      choices: [{ choose: 'none' }],
      expect: [s.hp('played-unit', 50), s.zoneCountChange(0, 'energies', 0), s.zoneCountChange(0, 'vanquished', 0)],
    }),
    s.opponentPlayUnit('played-unit', 'backguard', 3, {
      name: 'Swift Swordsman ignores Units played to the opposing Backguard',
      covers: [`trigger:${swiftSwordsman}`],
      setup: {
        defaultEnergyCopies: 0,
        cards: [{ ref: 'played-unit', cardId: '069-conscript', player: 1, zone: 'hand' }],
        energies: [
          { ref: 'muon-payment', player: 0, type: 'muon' },
          { ref: 'opponent-gluon', player: 1, type: 'gluon' },
        ],
      },
      expect: [s.zone('played-unit', 'backguard'), s.hp('played-unit', 50), s.zone('muon-payment', 'energies')],
    }),
    s.attack(unseenBlade, {
      name: 'Unseen Blade becomes Critical at DR 7 and afflicts an Exhausted defender with Cowering',
      setup: { units: [{ ref: 'defender', cardId: '069-conscript', player: 1, row: 'vanguard', index: 0, hp: 1000, isReady: false }] },
      effectRoll: 7,
      criticalRoll: 10,
      defenseRoll: 94,
      expect: [s.lastDamage(100), s.hpChange('defender', -100), s.condition('defender', 'cowering')],
    }),
    s.attack(unseenBlade, {
      name: 'Unseen Blade stays non-Critical below DR 7 and does not Cower a Ready defender',
      setup: { units: [{ ref: 'defender', cardId: '069-conscript', player: 1, row: 'vanguard', index: 0, hp: 1000, isReady: true }] },
      effectRoll: 6,
      criticalRoll: 10,
      defenseRoll: 94,
      expect: [s.lastDamage(50), s.hpChange('defender', -50), s.condition('defender', 'cowering', false)],
    }),
  ],
});
