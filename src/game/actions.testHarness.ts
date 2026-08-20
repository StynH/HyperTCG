import { applyGameAction, listLegalActions } from './actions';
import { chooseHeuristicAction, chooseRandomLegalAction, runHeuristicOpponentStep } from './ai/heuristicOpponent';
import { createGame, playUtility, useAttack } from './engine';
import {
  addAllTestEnergy, addTestEnergy, addTestUnit, createCleanTestState, deterministicRandom, testInstanceId,
} from './testing/gameFixture';

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

export function runActionSelfTests(): TestResult[] {
  return [
    run('enumerates only executable ordinary actions', () => {
      const state = createCleanTestState();
      addTestUnit(state, 0, 'vanguard', 0, '019-lola-bunny');
      addTestUnit(state, 0, 'vanguard', 1, '069-conscript');
      addTestUnit(state, 1, 'vanguard', 0, '067-civilian');
      addAllTestEnergy(state, 0);
      state.players[0].hand.push(
        { instanceId: testInstanceId('held-energy'), cardId: 'energy-gluon', owner: 0 },
        { instanceId: testInstanceId('held-unit'), cardId: '069-conscript', owner: 0 },
        { instanceId: testInstanceId('held-utility'), cardId: '089-battle-medicine', owner: 0 },
      );

      const actions = listLegalActions(state, 0);
      for (const kind of ['play-energy', 'play-unit', 'play-utility', 'rotate-unit', 'attack', 'activate-ability', 'end-turn'] as const) {
        expect(actions.some((action) => action.kind === kind), `Action list omitted ${kind}`);
      }
      for (const action of actions) {
        const result = applyGameAction(state, action, deterministicRandom(0.6, 0.6, 0.6));
        expect(!result.error, `${action.kind} was enumerated but failed: ${result.error}`);
      }
    }),
    run('exposes AI target choices through the canonical action surface', () => {
      const state = createCleanTestState();
      state.activePlayer = 1;
      state.isOpponentActing = true;
      const unitId = addTestUnit(state, 1, 'vanguard', 0, '078-pilot');
      addTestEnergy(state, 1, 'electron');
      addTestEnergy(state, 1, 'gluon');
      const equipment = { instanceId: testInstanceId('ai-equipment'), cardId: '096-tcr-v02-strike-gun', owner: 1 as const };
      state.players[1].hand.push(equipment);

      const played = playUtility(state, 1, equipment.instanceId);
      expect(played.state.pendingChoice?.player === 1, 'AI Equipment target was auto-selected inside the effect runtime');
      const actions = listLegalActions(played.state, 1);
      expect(actions.length === 1 && actions[0].kind === 'resolve-choice', 'AI choice did not become a canonical action');
      const resolved = applyGameAction(played.state, actions[0], deterministicRandom());
      expect(!resolved.error, resolved.error ?? 'AI target choice failed');
      expect(resolved.state.players[1].utilities[0]?.attachedTo === unitId, 'AI Equipment was not attached to its chosen target');
    }),
    run('prefers a valuable attack target over a full-health alternative', () => {
      const state = createCleanTestState();
      state.activePlayer = 1;
      state.isOpponentActing = true;
      addTestUnit(state, 1, 'vanguard', 0, '069-conscript');
      const vulnerable = addTestUnit(state, 0, 'vanguard', 0, '067-civilian');
      addTestUnit(state, 0, 'vanguard', 1, '067-civilian');
      state.players[0].vanguard[0]!.currentHp = 10;
      state.players[0].deck.push({ instanceId: testInstanceId('draw'), cardId: 'energy-gluon', owner: 0 });
      addTestEnergy(state, 1, 'gluon');

      const action = chooseHeuristicAction(state, 1, deterministicRandom(0));
      expect(action?.kind === 'attack', `Expected an attack, received ${action?.kind ?? 'no action'}`);
      expect(state.players[action.target!.player][action.target!.row][action.target!.index]?.instanceId === vulnerable,
        'Heuristic opponent ignored the vulnerable target');
    }),
    run('resolves an AI-owned pending choice as one visible opponent step', () => {
      const state = createCleanTestState();
      state.activePlayer = 1;
      state.isOpponentActing = true;
      const unitId = addTestUnit(state, 1, 'vanguard', 0, '078-pilot');
      addTestEnergy(state, 1, 'electron');
      addTestEnergy(state, 1, 'gluon');
      const equipment = { instanceId: testInstanceId('step-equipment'), cardId: '096-tcr-v02-strike-gun', owner: 1 as const };
      state.players[1].hand.push(equipment);
      const played = playUtility(state, 1, equipment.instanceId).state;

      const resolved = runHeuristicOpponentStep(played, deterministicRandom(0));
      expect(resolved.pendingChoice === null, 'Opponent step left its target choice unresolved');
      expect(resolved.players[1].utilities[0]?.attachedTo === unitId, 'Opponent step chose the wrong Equipment target');
    }),
    run('exposes AI reactions instead of auto-playing the first matching card', () => {
      const state = createCleanTestState();
      addTestUnit(state, 0, 'vanguard', 0, '069-conscript');
      addTestUnit(state, 1, 'vanguard', 0, '017-cyclops-tactician');
      addTestUnit(state, 1, 'backguard', 0, '069-conscript');
      addTestEnergy(state, 0, 'gluon');
      addTestEnergy(state, 1, 'muon');
      addTestEnergy(state, 1, 'photon');
      const escape = { instanceId: testInstanceId('ai-narrow-escape'), cardId: '093-narrow-escape', owner: 1 as const };
      state.players[1].hand.push(escape);

      const attacked = useAttack(
        state,
        { player: 0, row: 'vanguard', index: 0 },
        0,
        { player: 1, row: 'vanguard', index: 0 },
        deterministicRandom(0.5, 0.5),
      );
      expect(attacked.state.pendingChoice?.player === 1, 'AI reaction was resolved inside the effect runtime');
      const reactions = listLegalActions(attacked.state, 1);
      expect(reactions.some((action) => action.kind === 'resolve-choice' && action.selectedIds[0] === 'pass'),
        'AI reaction window omitted Pass priority');
      expect(reactions.some((action) => action.kind === 'resolve-choice' && action.selectedIds[0] === escape.instanceId),
        'AI reaction window omitted its playable Free Effect');
      for (const reaction of reactions) {
        const result = applyGameAction(attacked.state, reaction, deterministicRandom(0.5, 0.5));
        expect(!result.error, `Enumerated AI reaction failed: ${result.error}`);
      }
    }),
    run('finishes seeded random legal-action soak matches without stalls', () => {
      for (const [index, deckIds] of [
        ['scorched-earth', 'grave-return'],
        ['machine-syndicate', 'xtremists-ascendant'],
        ['hyperversal-ascension', 'infantry-doctrine'],
      ].entries()) {
        const random = seededRandom(1000 + index);
        let state = createGame({ playerDeckId: deckIds[0], opponentDeckId: deckIds[1] });
        for (let step = 0; state.winner === null && step < 3000; step += 1) {
          const actor = state.pendingChoice?.player ?? state.pendingMulligan?.player ?? state.activePlayer;
          const action = chooseRandomLegalAction(state, actor, random);
          expect(action, `No legal action for player ${actor} at soak step ${step}`);
          const result = applyGameAction(state, action, random);
          expect(!result.error, `${action.kind} failed during soak: ${result.error}`);
          state = result.state;
        }
        expect(state.winner !== null, `Soak match ${deckIds.join(' vs ')} did not finish`);
      }
    }),
  ];
}
