import { getCard } from '../../data/catalog';
import { chooseEffect, createGame } from '../engine';
import type { ConditionName } from '../effectTypes';
import type { EnergyType, GameState, PlayerId, RowName } from '../types';

let instanceSequence = 0;

export function testInstanceId(prefix: string): string {
  instanceSequence += 1;
  return `${prefix}-test-${instanceSequence}`;
}

export function createCleanTestState(): GameState {
  const state = createGame();
  for (const player of state.players) {
    player.deck = [];
    player.hand = [];
    player.vanguard = Array(5).fill(null);
    player.backguard = Array(5).fill(null);
    player.utilities = [];
    player.energies = [];
    player.vanquished = [];
    player.hasTakenFirstTurn = true;
  }
  state.log = [];
  state.turnEvents = [];
  return state;
}

export function addTestUnit(
  state: GameState,
  player: PlayerId,
  row: RowName,
  index: number,
  cardId: string,
): string {
  const definition = getCard(cardId);
  const instanceId = testInstanceId(cardId);
  state.players[player][row][index] = {
    instanceId,
    cardId,
    owner: player,
    currentHp: definition.hp,
    isReady: true,
    enteredTurn: state.players[player].turnCount,
    conditions: [],
  };
  return instanceId;
}

export function addTestCondition(
  state: GameState,
  instanceId: string,
  condition: ConditionName,
  amount?: number,
): void {
  for (const player of state.players) {
    const unit = [...player.vanguard, ...player.backguard]
      .find((candidate) => candidate?.instanceId === instanceId);
    if (unit) unit.conditions.push({ name: condition, amount, appliedTurn: player.turnCount, controllerTurns: 0 });
  }
}

export function addTestEnergy(state: GameState, player: PlayerId, type: EnergyType): string {
  const instanceId = testInstanceId(`energy-${type}`);
  state.players[player].energies.push({
    instanceId,
    cardId: `energy-${type}`,
    owner: player,
    energyType: type,
    isTapped: false,
  });
  return instanceId;
}

export function addAllTestEnergy(state: GameState, player: PlayerId): void {
  for (const type of ['gluon', 'photon', 'electron', 'muon', 'boson', 'neutrino'] as const) {
    for (let copy = 0; copy < 8; copy += 1) addTestEnergy(state, player, type);
  }
}

export function deterministicRandom(...values: number[]): () => number {
  let index = 0;
  return () => values[index++] ?? 0.6;
}

export function resolveAllTestChoices(state: GameState): GameState {
  let current = state;
  for (let guard = 0; current.pendingChoice && guard < 50; guard += 1) {
    const choice = current.pendingChoice;
    const selected = choice.options.slice(0, choice.min).map(({ id }) => id);
    const result = chooseEffect(current, selected);
    if (result.error) throw new Error(result.error);
    current = result.state;
  }
  if (current.pendingChoice) throw new Error('Choice continuation did not terminate after 50 decisions.');
  return current;
}

export function populateTestZones(state: GameState): void {
  addTestUnit(state, 0, 'vanguard', 0, '017-cyclops-tactician');
  addTestUnit(state, 0, 'vanguard', 1, '034-bob-ross');
  addTestUnit(state, 0, 'vanguard', 2, '038-eminem');
  addTestUnit(state, 0, 'vanguard', 3, '078-pilot');
  addTestUnit(state, 0, 'backguard', 0, '069-conscript');
  const conditioned = addTestUnit(state, 0, 'backguard', 1, '023-squidward');
  addTestCondition(state, conditioned, 'cowering');
  addTestUnit(state, 1, 'vanguard', 0, '069-conscript');
  addTestUnit(state, 1, 'vanguard', 1, '035-cremator');
  addTestUnit(state, 1, 'backguard', 0, '067-civilian');
  addTestUnit(state, 1, 'backguard', 1, '078-pilot');

  const deckCardIds = [
    '069-conscript', '089-battle-medicine', '068-cleaning-droid', '078-pilot',
    '090-deploy-armor', '067-civilian', '023-squidward', '094-pulse-rifle',
  ];
  state.players[0].deck = Array.from({ length: 32 }, (_, index) => ({
    instanceId: testInstanceId('deck'),
    cardId: deckCardIds[index % deckCardIds.length],
  }));
  state.players[1].deck = state.players[0].deck.map((card) => ({
    ...card,
    instanceId: testInstanceId('opponent-deck'),
  }));
  state.players[0].vanquished.push(
    { instanceId: testInstanceId('vanquished-unit'), cardId: '068-cleaning-droid' },
    { instanceId: testInstanceId('vanquished-utility'), cardId: '089-battle-medicine' },
  );
}
