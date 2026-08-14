import { getCard } from '../data/catalog';
import { getEffectScript } from '../data/effects';
import { createDeck } from './deck';
import {
  canActivate, dispatchGameEvent, expireModifiers, hasModifier, modifierTotal, payCardCost,
  paymentForCost, resolveEffectChoice, startActivatedEffects, startAttackEffects, startEffects,
  startUtilityScript, utilityConditionError,
} from './effectRuntime';
import type { AttackScript, EffectOperation } from './effectTypes';
import type {
  AttackDefinition, BoardAddress, CardInstance, CostType, EnergyInPlay, GameResult,
  GameState, PlayerId, PlayerState, RowName, UnitInPlay,
} from './types';

const emptyRow = () => Array<UnitInPlay | null>(5).fill(null);
const otherPlayer = (player: PlayerId): PlayerId => player === 0 ? 1 : 0;
const cloneState = (state: GameState): GameState => structuredClone(state);

function createPlayer(name: string, seed: number): PlayerState {
  const deck = createDeck(seed);
  return {
    name,
    hp: 250,
    deck: deck.slice(5),
    hand: deck.slice(0, 5),
    vanguard: emptyRow(),
    backguard: emptyRow(),
    utilities: [],
    energies: [],
    vanquished: [],
    hasPlayedEnergy: false,
    energyPlaysThisTurn: 0,
    hasTakenFirstTurn: false,
    turnCount: 0,
  };
}

export function createGame(): GameState {
  const players: [PlayerState, PlayerState] = [createPlayer('You', 4421), createPlayer('Rift Automaton', 9917)];
  players[0].turnCount = 1;
  return {
    players,
    activePlayer: 0,
    round: 1,
    log: ['Match initialized. Your first turn begins — no draw and no attacks.'],
    lastRoll: null,
    winner: null,
    isOpponentActing: false,
    actionSequence: 0,
    usedActions: {},
    modifiers: [],
    pendingChoice: null,
    pendingTurn: null,
  };
}

function withLog(state: GameState, message: string): GameState {
  state.log = [message, ...state.log].slice(0, 24);
  return state;
}

function removeFromHand(player: PlayerState, instanceId: string): CardInstance | null {
  const index = player.hand.findIndex((card) => card.instanceId === instanceId);
  if (index < 0) return null;
  return player.hand.splice(index, 1)[0];
}

export function energyPayment(cost: readonly CostType[], energies: EnergyInPlay[]): string[] | null {
  const available = energies.filter(({ isTapped }) => !isTapped);
  const selected: EnergyInPlay[] = [];
  for (const required of cost.filter((energy) => energy !== 'any')) {
    const match = available.find((energy) => energy.energyType === required && !selected.includes(energy));
    if (!match) return null;
    selected.push(match);
  }
  for (const _ of cost.filter((energy) => energy === 'any')) {
    const match = available.find((energy) => !selected.includes(energy));
    if (!match) return null;
    selected.push(match);
  }
  return selected.map(({ instanceId }) => instanceId);
}

function payAttackCost(state: GameState, player: PlayerId, cost: readonly CostType[]): boolean {
  const payment = paymentForCost(state, player, cost);
  if (!payment) return false;
  state.players[player].energies.forEach((energy) => {
    if (payment.includes(energy.instanceId)) energy.isTapped = true;
  });
  return true;
}

function actionBlocked(state: GameState): string | null {
  if (state.pendingChoice) return 'Resolve the pending choice first.';
  return null;
}

export function playEnergy(state: GameState, playerId: PlayerId, instanceId: string): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.activePlayer !== playerId || state.winner !== null) return { state, error: 'It is not your turn.' };
  const next = cloneState(state);
  const player = next.players[playerId];
  const allowed = 1 + modifierTotal(next, null, playerId, 'extra-energy-play');
  if (player.energyPlaysThisTurn >= allowed) return { state, error: 'You have used every Energy play available this turn.' };
  const held = player.hand.find((item) => item.instanceId === instanceId);
  if (!held || getCard(held.cardId).kind !== 'energy') return { state, error: 'That card is not an Energy.' };
  const removed = removeFromHand(player, instanceId)!;
  const definition = getCard(removed.cardId);
  player.energies.push({ ...removed, energyType: definition.energyType!, isTapped: false });
  player.energyPlaysThisTurn += 1;
  player.hasPlayedEnergy = player.energyPlaysThisTurn > 0;
  return { state: withLog(next, player.name + ' played ' + definition.name + '.') };
}

export function playUnit(state: GameState, address: BoardAddress, instanceId: string): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.activePlayer !== address.player || state.winner !== null) return { state, error: 'It is not your turn.' };
  const next = cloneState(state);
  const player = next.players[address.player];
  if (player[address.row][address.index]) return { state, error: 'That position is occupied.' };
  if (address.row === 'backguard' && hasModifier(next, null, address.player, 'cannot-play-backguard')) {
    return { state, error: 'Units cannot be played to your Backguard right now.' };
  }
  const held = player.hand.find((item) => item.instanceId === instanceId);
  if (!held) return { state, error: 'That card is no longer in your hand.' };
  const card = getCard(held.cardId);
  if (card.kind !== 'unit') return { state, error: 'Only Units can enter a Unit position.' };
  if (card.unitTreatment === 'super' && [...player.vanguard, ...player.backguard].some((unit) => unit && getCard(unit.cardId).unitTreatment === 'super')) {
    return { state, error: 'You can control only one SUPER Unit.' };
  }
  if (!payCardCost(next, address.player, card.id, 'play')) return { state, error: 'You do not have the required Ready Energy.' };
  const removed = removeFromHand(player, instanceId)!;
  player[address.row][address.index] = {
    ...removed,
    currentHp: card.hp,
    isReady: true,
    enteredTurn: player.turnCount,
    conditions: [],
  };
  withLog(next, player.name + ' played ' + card.name + ' to the ' + address.row + '.');
  dispatchGameEvent(next, { name: 'played', sourceId: removed.instanceId, targetId: removed.instanceId, controller: address.player });
  return { state: next };
}

export function playUtility(state: GameState, playerId: PlayerId, instanceId: string): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.winner !== null) return { state, error: 'The match is over.' };
  const held = state.players[playerId].hand.find((item) => item.instanceId === instanceId);
  if (!held) return { state, error: 'That card is no longer in your hand.' };
  const card = getCard(held.cardId);
  if (card.kind !== 'utility') return { state, error: 'That card is not a Utility.' };
  if (state.activePlayer !== playerId && card.utilityType !== 'free') return { state, error: 'Only Free Effects can be played during the opposing turn.' };
  const conditionError = utilityConditionError(state, playerId, instanceId);
  if (conditionError) return { state, error: conditionError };
  const next = cloneState(state);
  if (!payCardCost(next, playerId, card.id, 'utility')) return { state, error: 'You do not have the required Ready Energy.' };
  const removed = removeFromHand(next.players[playerId], instanceId)!;
  if (card.utilityType === 'continuous' || card.utilityType === 'equipment') next.players[playerId].utilities.push(removed);
  else next.players[playerId].vanquished.push(removed);
  withLog(next, next.players[playerId].name + ' played ' + card.name + '.');
  startUtilityScript(next, playerId, instanceId);
  return { state: next };
}

export function rotateUnit(state: GameState, address: BoardAddress): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.activePlayer !== address.player || state.winner !== null) return { state, error: 'It is not your turn.' };
  const next = cloneState(state);
  const player = next.players[address.player];
  const unit = player[address.row][address.index];
  if (!unit?.isReady) return { state, error: 'Only a Ready Unit can Rotate.' };
  if (unit.conditions.some(({ name }) => name === 'paralyzed')) return { state, error: 'A Paralyzed Unit cannot Rotate.' };
  if (hasModifier(next, unit.instanceId, null, 'cannot-rotate')
    && !hasModifier(next, unit.instanceId, null, 'ignore-rotation-prevention')) return { state, error: 'That Unit cannot Rotate right now.' };
  const destination: RowName = address.row === 'vanguard' ? 'backguard' : 'vanguard';
  const openIndex = player[destination].findIndex((slot) => slot === null);
  if (openIndex < 0) return { state, error: 'The ' + destination + ' is full.' };
  player[address.row][address.index] = null;
  unit.isReady = false;
  player[destination][openIndex] = unit;
  withLog(next, getCard(unit.cardId).name + ' Rotated to the ' + destination + ' and became Exhausted.');
  dispatchGameEvent(next, { name: 'unit-rotated', sourceId: unit.instanceId, targetId: unit.instanceId, controller: address.player });
  return { state: next };
}

export interface AvailableAttack {
  attack: AttackDefinition;
  script: AttackScript;
  providerCardId: string;
}

export function availableAttacks(state: GameState, unitInstanceId: string): AvailableAttack[] {
  const owner = ([0, 1] as const).find((player) =>
    [...state.players[player].vanguard, ...state.players[player].backguard].some((unit) => unit?.instanceId === unitInstanceId));
  if (owner === undefined) return [];
  const unit = [...state.players[owner].vanguard, ...state.players[owner].backguard].find((item) => item?.instanceId === unitInstanceId)!;
  const definition = getCard(unit.cardId);
  const own = definition.attacks.map((attack) => ({
    attack,
    script: getEffectScript(definition.id).attacks!.find(({ id }) => id === attack.id)!,
    providerCardId: definition.id,
  }));
  const equipment = state.players[owner].utilities.flatMap((utility) => {
    if (utility.attachedTo !== unitInstanceId) return [];
    const equipmentCard = getCard(utility.cardId);
    const attack = equipmentCard.utilityAttack;
    if (!attack?.name) return [];
    return [{
      attack,
      script: getEffectScript(equipmentCard.id).attacks!.find(({ id }) => id === attack.id)!,
      providerCardId: equipmentCard.id,
    }];
  });
  return [...own, ...equipment];
}

function isDamagingAttack(attack: AttackDefinition) {
  return /^\d/.test(attack.damage);
}

export function useAttack(
  state: GameState,
  source: BoardAddress,
  attackIndex: number,
  target: BoardAddress | null,
  random: () => number = Math.random,
): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.activePlayer !== source.player || state.winner !== null) return { state, error: 'It is not your turn.' };
  if (!state.players[source.player].hasTakenFirstTurn) return { state, error: 'You cannot attack on your first turn.' };
  const attacker = state.players[source.player][source.row][source.index];
  if (!attacker?.isReady) return { state, error: 'Choose a Ready Unit.' };
  if (attacker.conditions.some(({ name }) => name === 'paralyzed' || name === 'cowering')) return { state, error: 'That Condition prevents this Unit from attacking.' };
  if (hasModifier(state, attacker.instanceId, null, 'cannot-attack')) return { state, error: 'That Unit cannot attack right now.' };
  const option = availableAttacks(state, attacker.instanceId)[attackIndex];
  if (!option) return { state, error: 'That attack does not exist.' };
  const { attack, script } = option;
  if (source.row === 'backguard' && attack.damage !== 'BG') return { state, error: 'Only BG attacks may be used from the Backguard.' };
  const defenderId = otherPlayer(source.player);
  const defendingUnits = [...state.players[defenderId].vanguard, ...state.players[defenderId].backguard].filter(Boolean);
  if (isDamagingAttack(attack)) {
    if (!target && defendingUnits.length) return { state, error: 'Choose an opposing Vanguard Unit.' };
    if (target && (target.player !== defenderId || target.row !== 'vanguard')) return { state, error: 'Damaging attacks target the opposing Vanguard.' };
    if (target && !state.players[target.player][target.row][target.index]) return { state, error: 'That target is no longer present.' };
  }
  const next = cloneState(state);
  if (!payAttackCost(next, source.player, attack.cost)) return { state, error: 'You do not have the required Ready Energy.' };
  const nextAttacker = next.players[source.player][source.row][source.index]!;
  nextAttacker.isReady = false;
  const targetId = target ? next.players[target.player][target.row][target.index]?.instanceId ?? null : null;
  withLog(next, getCard(nextAttacker.cardId).name + ' used ' + attack.name + '.');
  startAttackEffects(next, source.player, nextAttacker.instanceId, targetId, defenderId, attack, script, random);
  return { state: next };
}

export function availableActivatedAbilities(state: GameState, player: PlayerId) {
  const sources = [
    ...state.players[player].vanguard,
    ...state.players[player].backguard,
    ...state.players[player].utilities,
  ].filter((source): source is NonNullable<typeof source> => Boolean(source));
  return sources.flatMap((source) =>
    (getEffectScript(source.cardId).activated ?? [])
      .filter(({ timing, id }) => timing === 'action' && canActivate(state, player, source.instanceId, id))
      .map((ability) => ({ sourceInstanceId: source.instanceId, cardId: source.cardId, abilityId: ability.id, name: ability.name })),
  );
}

export function activateAbility(state: GameState, player: PlayerId, sourceInstanceId: string, abilityId: string): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.activePlayer !== player || state.winner !== null) return { state, error: 'It is not your turn.' };
  const next = cloneState(state);
  return startActivatedEffects(next, player, sourceInstanceId, abilityId);
}

export function chooseEffect(state: GameState, selectedIds: readonly string[]): GameResult {
  const next = cloneState(state);
  const resolved = resolveEffectChoice(next, selectedIds);
  if (!resolved.error && !resolved.state.pendingChoice && resolved.state.pendingTurn !== null) completePendingTurn(resolved.state, Math.random);
  return resolved;
}

function readyPlayer(player: PlayerState) {
  player.hasPlayedEnergy = false;
  player.energyPlaysThisTurn = 0;
  player.energies.forEach((energy) => { energy.isTapped = false; });
  [...player.vanguard, ...player.backguard].forEach((unit) => { if (unit) unit.isReady = true; });
}

function drawTurnCard(state: GameState, playerId: PlayerId) {
  const card = state.players[playerId].deck.shift();
  if (!card) {
    state.winner = otherPlayer(playerId);
    withLog(state, state.players[playerId].name + ' decked out.');
  } else {
    state.players[playerId].hand.push(card);
  }
}

function processTurnEnd(state: GameState, playerId: PlayerId, random: () => number) {
  const player = state.players[playerId];
  for (const unit of [...player.vanguard, ...player.backguard]) {
    if (!unit) continue;
    const cowering = unit.conditions.findIndex(({ name }) => name === 'cowering');
    if (cowering >= 0 && random() < 0.5) unit.conditions.splice(cowering, 1);
    const paralyzed = unit.conditions.find(({ name }) => name === 'paralyzed');
    if (paralyzed) {
      paralyzed.controllerTurns += 1;
      if (paralyzed.controllerTurns >= 2) unit.conditions = unit.conditions.filter(({ name }) => name !== 'paralyzed');
    }
  }
  const cursedEffects: EffectOperation[] = [{
    op: 'for-each',
    selector: { zone: ['vanguard', 'backguard'], controller: 'actor', kind: 'unit', hasCondition: 'cursed' },
    store: 'cursed-unit',
    effects: [
      { op: 'choose', selector: { zone: ['vanguard', 'backguard'], controller: 'actor', kind: 'unit', exclude: 'cursed-unit' }, store: 'curse-target', min: 0, max: 1, prompt: 'Cursed: choose another Unit to take 20 Damage.' },
      { op: 'damage', target: 'curse-target', amount: 20, damageType: 'condition' },
    ],
  }];
  startEffects(state, playerId, 'rules', cursedEffects, { name: 'turn-end', controller: playerId }, random);
  expireModifiers(state, playerId, 'end');
}

function beginTurn(state: GameState, playerId: PlayerId, random: () => number) {
  state.activePlayer = playerId;
  const player = state.players[playerId];
  player.turnCount += 1;
  readyPlayer(player);
  expireModifiers(state, playerId, 'start');
  if (player.hasTakenFirstTurn) drawTurnCard(state, playerId);
  const conditionEffects: EffectOperation[] = [
    {
      op: 'for-each',
      selector: { zone: ['vanguard', 'backguard'], controller: 'actor', kind: 'unit', hasCondition: 'infected' },
      store: 'infected-unit',
      effects: [{ op: 'damage', target: 'infected-unit', amount: { value: 'condition-amount' }, damageType: 'condition' }],
    },
    {
      op: 'for-each',
      selector: { zone: ['vanguard', 'backguard'], controller: 'actor', kind: 'unit', hasCondition: 'doomed' },
      store: 'doomed-unit',
      effects: [{ op: 'vanquish', target: 'doomed-unit' }],
    },
  ];
  startEffects(state, playerId, 'rules', conditionEffects, { name: 'turn-start', controller: playerId }, random);
}

function completePendingTurn(state: GameState, random: () => number) {
  const player = state.pendingTurn;
  if (player === null) return;
  state.pendingTurn = null;
  if (player === 0) state.round += 1;
  beginTurn(state, player, random);
  state.isOpponentActing = player === 1;
  withLog(state, player === 0
    ? 'Round ' + state.round + '. Your Energy and Units are Ready.'
    : 'Opponent turn. The Rift Automaton is evaluating the board…');
}

function affordable(player: PlayerState, kind: 'unit' | 'utility') {
  return player.hand.find((held) => {
    const card = getCard(held.cardId);
    return card.kind === kind && energyPayment(card.cost, player.energies) !== null;
  });
}

export function runOpponentTurn(state: GameState, random: () => number = Math.random): GameState {
  if (state.pendingChoice || state.winner !== null || state.activePlayer !== 1) return state;
  let next = cloneState(state);
  const opponent = next.players[1];
  const energy = opponent.hand.find((held) => getCard(held.cardId).kind === 'energy');
  if (energy && opponent.energyPlaysThisTurn < 1 + modifierTotal(next, null, 1, 'extra-energy-play')) {
    next = playEnergy(next, 1, energy.instanceId).state;
  }
  if (next.pendingChoice) return next;
  const unit = affordable(next.players[1], 'unit');
  if (unit) {
    const row: RowName = next.players[1].vanguard.some((slot) => slot === null) ? 'vanguard' : 'backguard';
    const index = next.players[1][row].findIndex((slot) => slot === null);
    if (index >= 0) next = playUnit(next, { player: 1, row, index }, unit.instanceId).state;
  }
  if (next.pendingChoice) return next;
  const utility = affordable(next.players[1], 'utility');
  if (utility) {
    const result = playUtility(next, 1, utility.instanceId);
    if (!result.error) next = result.state;
  }
  if (next.pendingChoice) return next;
  if (opponent.hasTakenFirstTurn) {
    for (let index = 0; index < 5; index += 1) {
      const attacker = next.players[1].vanguard[index];
      if (!attacker?.isReady) continue;
      const attackIndex = availableAttacks(next, attacker.instanceId).findIndex(({ attack }) =>
        isDamagingAttack(attack) && energyPayment(attack.cost, next.players[1].energies) !== null);
      if (attackIndex < 0) continue;
      const targetIndex = next.players[0].vanguard.findIndex(Boolean);
      const target = targetIndex >= 0 ? { player: 0 as const, row: 'vanguard' as const, index: targetIndex } : null;
      next = useAttack(next, { player: 1, row: 'vanguard', index }, attackIndex, target, random).state;
      if (next.pendingChoice || next.winner !== null) return next;
    }
  }
  processTurnEnd(next, 1, random);
  next.players[1].hasTakenFirstTurn = true;
  if (next.winner === null) {
    next.pendingTurn = 0;
    if (!next.pendingChoice) completePendingTurn(next, random);
  }
  if (!next.pendingChoice) next.isOpponentActing = false;
  return next;
}

export function endPlayerTurn(state: GameState, random: () => number = Math.random): GameResult {
  const blocked = actionBlocked(state);
  if (blocked) return { state, error: blocked };
  if (state.activePlayer !== 0 || state.winner !== null) return { state, error: 'You cannot end the turn now.' };
  const next = cloneState(state);
  processTurnEnd(next, 0, random);
  next.players[0].hasTakenFirstTurn = true;
  if (next.winner === null) {
    next.pendingTurn = 1;
    if (!next.pendingChoice) completePendingTurn(next, random);
  }
  return { state: next };
}
