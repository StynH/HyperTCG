import { defineGameplayCardTest } from '../gameplayTestTypes';
import * as s from '../scenarioBuilders';

const watching = 'master-of-puppets-watching-from-the-shadows-0';
const cataclysmicCharge = 'master-of-puppets-cataclysmic-charge';

export default defineGameplayCardTest({
  cardId: '105-the-master-of-puppets',
  scenarios: [
    s.trigger(watching, 'unit-vanquished', {
      name: 'The third opposing Vanquish plays the Master from hand for free and stops further attacks that turn',
      setup: {
        sourceZone: 'hand',
        activePlayer: 1,
        units: [{ ref: 'opponent-attacker', cardId: '069-conscript', player: 1, row: 'vanguard', index: 2 }],
        turnEvents: [
          { event: 'unit-vanquished', source: 'opponent-attacker', target: 'vanquished-unit', controller: 0, sourceController: 1 },
          { event: 'unit-vanquished', source: 'opponent-attacker', target: 'vanquished-unit', controller: 0, sourceController: 1 },
        ],
      },
      eventSource: 'opponent-attacker',
      eventTarget: 'vanquished-unit',
      controller: 0,
      damageType: 'attack',
      choices: [{ refs: ['source'] }, { optionIds: ['slot:0:vanguard:0'] }],
      expect: [
        s.row('source', 'vanguard'),
        s.modifier(undefined, 1, 'cannot-attack'),
        s.attackBlocked('opponent-attacker', 'cannot attack'),
      ],
    }),
    s.trigger(watching, 'unit-vanquished', {
      name: 'Watching from the Shadows ignores a Vanquish not caused by the opponent even after the threshold was reached',
      covers: [`trigger:${watching}`],
      setup: {
        sourceZone: 'hand',
        activePlayer: 1,
        units: [{ ref: 'opponent-attacker', cardId: '069-conscript', player: 1, row: 'vanguard', index: 2 }],
        turnEvents: [
          { event: 'unit-vanquished', source: 'opponent-attacker', target: 'vanquished-unit', controller: 0, sourceController: 1 },
          { event: 'unit-vanquished', source: 'opponent-attacker', target: 'vanquished-unit', controller: 0, sourceController: 1 },
          { event: 'unit-vanquished', source: 'opponent-attacker', target: 'vanquished-unit', controller: 0, sourceController: 1 },
        ],
      },
      eventSource: 'source',
      eventTarget: 'vanquished-unit',
      controller: 0,
      damageType: 'effect',
      expect: [s.zone('source', 'hand'), s.modifier(undefined, 1, 'cannot-attack', false)],
    }),
    s.trigger(watching, 'unit-vanquished', {
      name: 'Watching from the Shadows does not fire before three Units have been Vanquished by the opponent',
      covers: [`trigger:${watching}`],
      setup: {
        sourceZone: 'hand',
        activePlayer: 1,
        units: [{ ref: 'opponent-attacker', cardId: '069-conscript', player: 1, row: 'vanguard', index: 2 }],
        turnEvents: [
          { event: 'unit-vanquished', source: 'opponent-attacker', target: 'vanquished-unit', controller: 0, sourceController: 1 },
        ],
      },
      eventSource: 'opponent-attacker',
      eventTarget: 'vanquished-unit',
      controller: 0,
      damageType: 'attack',
      expect: [s.zone('source', 'hand'), s.modifier(undefined, 1, 'cannot-attack', false)],
    }),
    s.attack(cataclysmicCharge, {
      name: 'Cataclysmic Charge takes control of an opposing Energy Exhausted and permanently unable to Ready',
      target: null,
      setup: {
        sparseBoard: true,
        defaultEnergyCopies: 0,
        energies: [
          { ref: 'payment-1', player: 0, type: 'gluon' },
          { ref: 'payment-2', player: 0, type: 'photon' },
          { ref: 'payment-3', player: 0, type: 'electron' },
          { ref: 'payment-4', player: 0, type: 'muon' },
          { ref: 'opposing-energy', player: 1, type: 'boson' },
        ],
      },
      choices: [{ choose: 'minimum', captureAs: 'captured-energy' }],
      expect: [
        s.zoneCountChange(0, 'energies', 1),
        s.zoneCountChange(1, 'energies', -1),
        s.zone('captured-energy', 'energies'),
        s.owner('captured-energy', 1),
        s.ready('captured-energy', false),
        s.modifier('captured-energy', undefined, 'cannot-ready'),
        s.tappedChange(0, 5),
        s.remainsExhaustedNextTurn('captured-energy'),
        s.winner(null),
      ],
    }),
    s.attack(cataclysmicCharge, {
      name: 'Cataclysmic Charge wins upon controlling the fifth Energy taken this way',
      target: null,
      setup: {
        defaultEnergyCopies: 1,
        cards: [
          { ref: 'captured-1', cardId: 'energy-gluon', player: 0, owner: 1, zone: 'energies', isTapped: true },
          { ref: 'captured-2', cardId: 'energy-photon', player: 0, owner: 1, zone: 'energies', isTapped: true },
          { ref: 'captured-3', cardId: 'energy-electron', player: 0, owner: 1, zone: 'energies', isTapped: true },
          { ref: 'captured-4', cardId: 'energy-muon', player: 0, owner: 1, zone: 'energies', isTapped: true },
        ],
        modifiers: [
          { source: 'source', target: 'captured-1', kind: 'cannot-ready' },
          { source: 'source', target: 'captured-2', kind: 'cannot-ready' },
          { source: 'source', target: 'captured-3', kind: 'cannot-ready' },
          { source: 'source', target: 'captured-4', kind: 'cannot-ready' },
        ],
      },
      choices: [{ choose: 'minimum', captureAs: 'captured-5' }],
      expect: [s.winner(0), s.zone('captured-5', 'energies'), s.modifier('captured-5', undefined, 'cannot-ready')],
    }),
  ],
});
