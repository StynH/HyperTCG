import { actionKey } from '../actions';
import { addTestEnergy, addTestUnit, createCleanTestState, testInstanceId } from '../testing/gameFixture';
import type { GameState } from '../types';
import { createKnownDeckObservation, sampleKnownDeckState } from './belief';
import { compileDeckProfile } from './deckProfile';
import { AI_DIFFICULTIES } from './difficulty';
import {
  chooseStrategicOpponentAction, mulliganStrategicOpeningHand, runStrategicOpponentStep,
} from './strategicOpponent';
import type { DeckListEntry } from './types';

interface TestResult { name: string; passed: boolean; error?: string }

function expect(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function run(name: string, test: () => void): TestResult {
  try {
    test();
    return { name, passed: true };
  } catch (error) {
    return { name, passed: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function seededRandom(initialSeed: number): () => number {
  let seed = initialSeed >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x1_0000_0000;
  };
}

const PLAYER_LIST: readonly DeckListEntry[] = [
  ['067-civilian', 2],
  ['089-battle-medicine', 1],
  ['094-pulse-rifle', 1],
  ['093-narrow-escape', 1],
  ['energy-gluon', 1],
];

const AI_LIST: readonly DeckListEntry[] = [
  ['069-conscript', 1],
  ['energy-gluon', 1],
  ['089-battle-medicine', 1],
  ['094-pulse-rifle', 1],
];

function hiddenDecisionState(): GameState {
  const state = createCleanTestState();
  state.activePlayer = 1;
  state.isOpponentActing = true;
  addTestUnit(state, 1, 'vanguard', 0, '069-conscript');
  addTestUnit(state, 0, 'vanguard', 0, '067-civilian');
  addTestUnit(state, 0, 'vanguard', 1, '067-civilian');
  state.players[0].vanguard[0]!.currentHp = 10;
  addTestEnergy(state, 1, 'gluon');
  state.players[1].deck = [
    { instanceId: 'real-ai-deck-0', cardId: '089-battle-medicine', owner: 1 },
    { instanceId: 'real-ai-deck-1', cardId: '094-pulse-rifle', owner: 1 },
  ];
  state.players[0].hand = [
    { instanceId: 'hidden-hand-0', cardId: '089-battle-medicine', owner: 0 },
    { instanceId: 'hidden-hand-1', cardId: 'energy-gluon', owner: 0 },
  ];
  state.players[0].deck = [
    { instanceId: 'hidden-deck-0', cardId: '094-pulse-rifle', owner: 0 },
    { instanceId: 'hidden-deck-1', cardId: '093-narrow-escape', owner: 0 },
  ];
  return state;
}

export function runAiSelfTests(): TestResult[] {
  return [
    run('compiles a generic strategic profile from any deck list', () => {
      const profile = compileDeckProfile([
        ['energy-gluon', 2],
        ['069-conscript', 1],
        ['089-battle-medicine', 1],
      ]);
      expect(profile.totalCards === 4, 'Profile card total is incorrect');
      expect(profile.kindCounts.energy === 2 && profile.kindCounts.unit === 1 && profile.kindCounts.utility === 1,
        'Profile card kinds are incorrect');
      expect(profile.energyDemand.gluon > 0, 'Profile did not learn its Gluon demand');
      expect(profile.capabilities.protection > 0, 'Profile did not recognize generic healing/protection operations');
    }),
    run('samples hidden cards from the known list without copying their identities', () => {
      const original = hiddenDecisionState();
      const changed = structuredClone(original);
      [changed.players[0].hand[0].cardId, changed.players[0].deck[0].cardId] = [
        changed.players[0].deck[0].cardId,
        changed.players[0].hand[0].cardId,
      ];

      const first = sampleKnownDeckState(original, 1, PLAYER_LIST, AI_LIST, seededRandom(77));
      const second = sampleKnownDeckState(changed, 1, PLAYER_LIST, AI_LIST, seededRandom(77));
      expect(first.players[0].hand.every(({ instanceId }) => instanceId.startsWith('belief-0-')),
        'Hidden hand retained live instance identifiers');
      expect(JSON.stringify(first.players[0].hand) === JSON.stringify(second.players[0].hand),
        'Changing the real hidden hand changed the sampled belief');
      expect(JSON.stringify(first.players[0].deck) === JSON.stringify(second.players[0].deck),
        'Changing the real deck order changed the sampled belief');
      expect(first.players[1].deck.every(({ instanceId }) => instanceId.startsWith('belief-1-')),
        'AI search retained its real future deck order');
    }),
    run('redacts hidden identities before state crosses the worker boundary', () => {
      const state = hiddenDecisionState();
      const observation = createKnownDeckObservation(state, 1, PLAYER_LIST, AI_LIST);
      expect(observation.players[0].hand.every(({ instanceId }) => instanceId.startsWith('observation-0-')),
        'Worker observation retained a live opponent hand identifier');
      expect(observation.players[0].hand.every(({ cardId }) => cardId === PLAYER_LIST[0][0]),
        'Worker observation retained an opponent hand card identity');
      expect(observation.players[0].deck.every(({ instanceId }) => instanceId.startsWith('observation-0-')),
        'Worker observation retained the real opponent deck order');
      expect(observation.players[1].deck.every(({ instanceId }) => instanceId.startsWith('observation-1-')),
        'Worker observation retained the AI future deck order');
      expect(state.players[0].hand[0].instanceId === 'hidden-hand-0', 'Observation redaction mutated live state');
    }),
    run('preserves a hand that a public continuous effect reveals', () => {
      const state = hiddenDecisionState();
      addTestUnit(state, 1, 'backguard', 0, '012-xehanort');
      const sampled = sampleKnownDeckState(state, 1, PLAYER_LIST, AI_LIST, seededRandom(11));
      expect(sampled.players[0].hand[0].instanceId === state.players[0].hand[0].instanceId,
        'A legally revealed hand was redacted');
      expect(sampled.players[0].hand[0].cardId === state.players[0].hand[0].cardId,
        'A legally revealed card identity was replaced');
    }),
    run('chooses the same action when only real hidden identities change', () => {
      const original = hiddenDecisionState();
      const changed = structuredClone(original);
      [changed.players[0].hand[0].cardId, changed.players[0].deck[0].cardId] = [
        changed.players[0].deck[0].cardId,
        changed.players[0].hand[0].cardId,
      ];
      changed.players[1].deck.reverse();
      const options = { knownPlayerDeck: PLAYER_LIST, aiDeck: AI_LIST, difficulty: 'initiate' as const };
      const first = chooseStrategicOpponentAction(original, options, seededRandom(900));
      const second = chooseStrategicOpponentAction(changed, options, seededRandom(900));
      expect(first && second, 'Strategic search returned no action');
      expect(actionKey(first.action) === actionKey(second.action), 'Strategic search read the real hidden hand');
      expect(first.simulations > 0 && first.candidates.every(({ variance }) => variance >= 0),
        'Strategic decision trace omitted its simulation statistics');
      expect(JSON.stringify(first.candidates) === JSON.stringify(second.candidates),
        'Seeded information-set search was not reproducible');
      expect(first.candidates.every(({ visits, availability }) => visits > 0 && availability >= visits),
        'Information-set search emitted invalid visit or availability statistics');
      expect(first.candidates.reduce((total, { visits }) => total + visits, 0) === first.simulations,
        'Root candidate visits do not account for the deterministic iteration budget');
    }),
    run('takes an immediate forced win before statistical search', () => {
      const state = createCleanTestState();
      state.activePlayer = 1;
      state.isOpponentActing = true;
      state.pendingChoice = {
        id: 'forced-victory',
        player: 1,
        prompt: 'Complete the victory effect.',
        min: 1,
        max: 1,
        ordered: false,
        options: [{ id: 'victory', label: 'Win' }],
        store: 'selection',
        continuation: {
          actor: 1,
          sourceInstanceId: '',
          vars: {},
          frames: [{
            effects: [{ op: 'win' }],
            index: 0,
            actor: 1,
            sourceId: '',
          }],
        },
      };
      const decision = chooseStrategicOpponentAction(state, {
        knownPlayerDeck: PLAYER_LIST,
        aiDeck: AI_LIST,
        difficulty: 'veteran',
      }, seededRandom(44));
      expect(decision?.action.kind === 'resolve-choice', 'Tactical guard missed a forced winning choice');
      expect(decision.candidates.length === 1 && decision.candidates[0].meanValue === 1_000_000,
        'Forced win was sent through noisy statistical scoring');
      const result = runStrategicOpponentStep(state, {
        knownPlayerDeck: PLAYER_LIST,
        aiDeck: AI_LIST,
        difficulty: 'veteran',
      }, seededRandom(44));
      expect(result.winner === 1, 'Opponent did not execute the forced win');
    }),
    run('evaluates and completes the opponent opening mulligan', () => {
      const state = createCleanTestState();
      state.activePlayer = 0;
      state.isOpponentActing = false;
      state.players[1].hasTakenFirstTurn = false;
      state.players[1].hand = Array.from({ length: 7 }, (_, index) => ({
        instanceId: `expensive-opening-${index}`,
        cardId: '001-aleph-atomic-titan',
        owner: 1 as const,
      }));
      state.players[1].deck = Array.from({ length: 5 }, (_, index) => ({
        instanceId: `opening-energy-${index}`,
        cardId: 'energy-boson',
        owner: 1 as const,
      }));
      const next = mulliganStrategicOpeningHand(state, {
        knownPlayerDeck: PLAYER_LIST,
        aiDeck: [['001-aleph-atomic-titan', 7], ['energy-boson', 5]],
        difficulty: 'initiate',
      }, seededRandom(33));
      expect(next.pendingMulligan === null, 'Opponent opening mulligan was left pending');
      expect(next.players[1].hand.length === 7, 'Opponent mulligan changed its opening hand size');
      expect(next.players[1].hand.some(({ cardId }) => cardId === 'energy-boson'),
        'Opponent kept an entirely unplayable opening hand');
      expect(next.log.some(({ action }) => action === 'Opening hand kept' || action === 'Opening hand redrawn'),
        'Opponent mulligan was not recorded in the public log');
    }),
    run('resolves an AI choice through strategic search and one live action', () => {
      const state = createCleanTestState();
      state.activePlayer = 1;
      state.isOpponentActing = true;
      const unitId = addTestUnit(state, 1, 'vanguard', 0, '078-pilot');
      const equipmentId = testInstanceId('strategic-equipment');
      state.players[1].utilities.push({
        instanceId: equipmentId,
        cardId: '096-tcr-v02-strike-gun',
        owner: 1,
      });
      state.pendingChoice = {
        id: 'strategic-choice',
        player: 1,
        prompt: 'Choose a Unit.',
        min: 1,
        max: 1,
        ordered: false,
        options: [{ id: unitId, label: 'Pilot', cardId: '078-pilot' }],
        store: 'target',
        continuation: {
          actor: 1,
          sourceInstanceId: equipmentId,
          vars: {},
          frames: [{
            effects: [{ op: 'attach', equipment: 'source', unit: 'target' }],
            index: 0,
            actor: 1,
            sourceId: equipmentId,
          }],
        },
      };
      const next = runStrategicOpponentStep(state, {
        knownPlayerDeck: [['067-civilian', 1]],
        aiDeck: [['078-pilot', 1], ['096-tcr-v02-strike-gun', 1]],
        difficulty: 'initiate',
      }, seededRandom(12));
      expect(next.pendingChoice === null, 'Strategic controller left its forced choice unresolved');
      expect(next.players[1].utilities[0].attachedTo === unitId, 'Strategic controller did not execute its chosen target');
    }),
    run('difficulty budgets increase monotonically without changing the rules', () => {
      for (let index = 1; index < AI_DIFFICULTIES.length; index += 1) {
        const easier = AI_DIFFICULTIES[index - 1].settings;
        const harder = AI_DIFFICULTIES[index].settings;
        expect(harder.beliefSamples >= easier.beliefSamples, 'Harder AI uses fewer belief samples');
        expect(harder.chanceSamples >= easier.chanceSamples, 'Harder AI uses fewer chance samples');
        expect(harder.iterations >= easier.iterations, 'Harder AI uses fewer Monte Carlo iterations');
        expect(harder.searchDepth >= easier.searchDepth, 'Harder AI searches less deeply');
        expect(harder.candidateLimit >= easier.candidateLimit, 'Harder AI considers fewer candidates');
        expect(harder.regretLimit <= easier.regretLimit, 'Harder AI allows larger mistakes');
      }
    }),
  ];
}
