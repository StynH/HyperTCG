import { getCard } from '../data/catalog';
import { createDeck } from './deck';
import type {
  AttackDefinition, BoardAddress, CardInstance, CostType, EnergyInPlay,
  GameResult, GameState, PlayerId, PlayerState, RowName, UnitInPlay,
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
    hasTakenFirstTurn: false,
  };
}

export function createGame(): GameState {
  return {
    players: [createPlayer('You', 4421), createPlayer('Rift Automaton', 9917)],
    activePlayer: 0,
    round: 1,
    log: ['Match initialized. Your first turn begins — no draw and no attacks.'],
    lastRoll: null,
    winner: null,
    isOpponentActing: false,
  };
}

function withLog(state: GameState, message: string): GameState {
  state.log = [message, ...state.log].slice(0, 16);
  return state;
}

function removeFromHand(player: PlayerState, instanceId: string): CardInstance | null {
  const index = player.hand.findIndex((card) => card.instanceId === instanceId);
  if (index < 0) return null;
  return player.hand.splice(index, 1)[0];
}

export function energyPayment(cost: readonly CostType[], energies: EnergyInPlay[]): string[] | null {
  const available = energies.filter((energy) => !energy.isTapped);
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

function payCost(player: PlayerState, cost: readonly CostType[]): boolean {
  const payment = energyPayment(cost, player.energies);
  if (!payment) return false;
  player.energies.forEach((energy) => {
    if (payment.includes(energy.instanceId)) energy.isTapped = true;
  });
  return true;
}

export function playEnergy(state: GameState, playerId: PlayerId, instanceId: string): GameResult {
  if (state.activePlayer !== playerId || state.winner !== null) return { state, error: 'It is not your turn.' };
  const next = cloneState(state);
  const player = next.players[playerId];
  if (player.hasPlayedEnergy) return { state, error: 'You can normally play only one Energy per turn.' };
  const card = player.hand.find((item) => item.instanceId === instanceId);
  if (!card || getCard(card.cardId).kind !== 'energy') return { state, error: 'That card is not an Energy.' };
  const removed = removeFromHand(player, instanceId)!;
  const definition = getCard(removed.cardId);
  player.energies.push({ ...removed, energyType: definition.energyType!, isTapped: false });
  player.hasPlayedEnergy = true;
  return { state: withLog(next, `${player.name} played ${definition.name}.`) };
}

export function playUnit(state: GameState, address: BoardAddress, instanceId: string): GameResult {
  if (state.activePlayer !== address.player || state.winner !== null) return { state, error: 'It is not your turn.' };
  const next = cloneState(state);
  const player = next.players[address.player];
  if (player[address.row][address.index]) return { state, error: 'That position is occupied.' };
  const held = player.hand.find((item) => item.instanceId === instanceId);
  if (!held) return { state, error: 'That card is no longer in your hand.' };
  const card = getCard(held.cardId);
  if (card.kind !== 'unit') return { state, error: 'Only Units can enter a Unit position.' };
  if (!payCost(player, card.cost)) return { state, error: 'You do not have the required Ready Energy.' };
  const removed = removeFromHand(player, instanceId)!;
  player[address.row][address.index] = { ...removed, currentHp: card.hp, isReady: true };
  return { state: withLog(next, `${player.name} played ${card.name} to the ${address.row}.`) };
}

export function playUtility(state: GameState, playerId: PlayerId, instanceId: string): GameResult {
  if (state.activePlayer !== playerId || state.winner !== null) return { state, error: 'It is not your turn.' };
  const next = cloneState(state);
  const player = next.players[playerId];
  const held = player.hand.find((item) => item.instanceId === instanceId);
  if (!held) return { state, error: 'That card is no longer in your hand.' };
  const card = getCard(held.cardId);
  if (card.kind !== 'utility') return { state, error: 'That card is not a Utility.' };
  if (!payCost(player, card.cost)) return { state, error: 'You do not have the required Ready Energy.' };
  const removed = removeFromHand(player, instanceId)!;
  if (card.utilityType === 'instant' || card.utilityType === 'free') player.vanquished.push(removed);
  else player.utilities.push(removed);
  return { state: withLog(next, `${player.name} played ${card.name}. Its printed effect is noted for manual POC resolution.`) };
}

export function rotateUnit(state: GameState, address: BoardAddress): GameResult {
  if (state.activePlayer !== address.player || state.winner !== null) return { state, error: 'It is not your turn.' };
  const next = cloneState(state);
  const player = next.players[address.player];
  const unit = player[address.row][address.index];
  if (!unit?.isReady) return { state, error: 'Only a Ready Unit can Rotate.' };
  const destination: RowName = address.row === 'vanguard' ? 'backguard' : 'vanguard';
  const openIndex = player[destination].findIndex((slot) => slot === null);
  if (openIndex < 0) return { state, error: `The ${destination} is full.` };
  player[address.row][address.index] = null;
  player[destination][openIndex] = { ...unit, isReady: false };
  return { state: withLog(next, `${getCard(unit.cardId).name} Rotated to the ${destination} and became Exhausted.`) };
}

function attackDamage(attack: AttackDefinition): number {
  const match = attack.damage.match(/^\d+/);
  return match ? Number(match[0]) : 0;
}

function enforceVanguard(player: PlayerState, state: GameState) {
  if (player.vanguard.some(Boolean)) return;
  const backguardIndex = player.backguard.findIndex(Boolean);
  if (backguardIndex < 0) return;
  const unit = player.backguard[backguardIndex]!;
  const destination = player.vanguard.findIndex((slot) => slot === null);
  player.backguard[backguardIndex] = null;
  player.vanguard[destination] = unit;
  withLog(state, `${getCard(unit.cardId).name} was moved forward to fill the empty Vanguard.`);
}

export function useAttack(
  state: GameState,
  source: BoardAddress,
  attackIndex: number,
  target: BoardAddress | null,
  random = Math.random,
): GameResult {
  if (state.activePlayer !== source.player || state.winner !== null) return { state, error: 'It is not your turn.' };
  if (!state.players[source.player].hasTakenFirstTurn) return { state, error: 'You cannot attack on your first turn.' };
  const next = cloneState(state);
  const attackerPlayer = next.players[source.player];
  const attacker = attackerPlayer[source.row][source.index];
  if (!attacker?.isReady) return { state, error: 'Choose a Ready Unit.' };
  const card = getCard(attacker.cardId);
  const attack = card.attacks[attackIndex];
  if (!attack) return { state, error: 'That attack does not exist.' };
  const isBackguardAttack = attack.damage === 'BG';
  if (source.row === 'backguard' && !isBackguardAttack) return { state, error: 'Only BG attacks may be used from the Backguard.' };
  if (!payCost(attackerPlayer, attack.cost)) return { state, error: 'You do not have the required Ready Energy.' };
  attacker.isReady = false;

  const defenderId = otherPlayer(source.player);
  const defenderPlayer = next.players[defenderId];
  const hasDefendingUnits = [...defenderPlayer.vanguard, ...defenderPlayer.backguard].some(Boolean);
  if (!target && hasDefendingUnits) return { state, error: 'Choose an opposing Vanguard Unit.' };
  if (target && (target.player !== defenderId || target.row !== 'vanguard')) return { state, error: 'Normal attacks target the opposing Vanguard.' };

  const printedDamage = attackDamage(attack);
  if (printedDamage === 0) {
    next.lastRoll = { attack: 0, damage: 0, summary: `${attack.name} resolved as a non-damaging attack.` };
    return { state: withLog(next, `${card.name} used ${attack.name}. Resolve its printed effect manually in this POC.`) };
  }

  const d20 = Math.floor(random() * 20) + 1;
  if (d20 === 1) {
    next.lastRoll = { attack: d20, damage: 0, summary: 'Natural 1 — attack failed.' };
    return { state: withLog(next, `${card.name}'s ${attack.name} failed on a natural 1.`) };
  }
  let damage = d20 === 20 ? printedDamage * 2 : printedDamage;
  if (!target) {
    defenderPlayer.hp = Math.max(0, defenderPlayer.hp - damage);
    next.lastRoll = { attack: d20, damage, summary: d20 === 20 ? 'Critical direct hit!' : 'Direct hit.' };
    if (defenderPlayer.hp === 0) next.winner = source.player;
    return { state: withLog(next, `${card.name} dealt ${damage} direct Damage with ${attack.name}.`) };
  }

  const defendingUnit = defenderPlayer[target.row][target.index];
  if (!defendingUnit) return { state, error: 'That target is no longer present.' };
  const defendingCard = getCard(defendingUnit.cardId);
  const d100 = Math.floor(random() * 100) + 1;
  let defenseLabel = 'failed Defense';
  if (d100 <= 5) {
    damage = 0;
    defenseLabel = 'Critical Defense';
  } else if (d100 >= 95) {
    damage *= 2;
    defenseLabel = 'Critical Defense Failure';
  } else if (d100 <= defendingCard.defense) {
    damage = Math.floor(damage / 2);
    defenseLabel = 'successful Defense';
  }
  defendingUnit.currentHp -= damage;
  next.lastRoll = { attack: d20, defense: d100, damage, summary: `${defenseLabel} — ${damage} Damage.` };
  withLog(next, `${card.name}'s ${attack.name} hit ${defendingCard.name} for ${damage} Damage (d20 ${d20}, d100 ${d100}).`);
  if (defendingUnit.currentHp <= 0) {
    defenderPlayer[target.row][target.index] = null;
    defenderPlayer.vanquished.push({ instanceId: defendingUnit.instanceId, cardId: defendingUnit.cardId });
    withLog(next, `${defendingCard.name} was Vanquished.`);
    enforceVanguard(defenderPlayer, next);
  }
  return { state: next };
}

function drawCard(state: GameState, playerId: PlayerId) {
  const player = state.players[playerId];
  const drawn = player.deck.shift();
  if (!drawn) {
    state.winner = otherPlayer(playerId);
    withLog(state, `${player.name} decked out.`);
    return;
  }
  player.hand.push(drawn);
}

function readyPlayer(player: PlayerState) {
  player.hasPlayedEnergy = false;
  player.energies.forEach((energy) => { energy.isTapped = false; });
  [...player.vanguard, ...player.backguard].forEach((unit) => { if (unit) unit.isReady = true; });
}

function startTurn(state: GameState, playerId: PlayerId) {
  const player = state.players[playerId];
  readyPlayer(player);
  if (player.hasTakenFirstTurn) drawCard(state, playerId);
  state.activePlayer = playerId;
}

function firstAffordableHandCard(player: PlayerState, kind: 'unit' | 'utility') {
  return player.hand.find((held) => {
    const card = getCard(held.cardId);
    return card.kind === kind && energyPayment(card.cost, player.energies) !== null;
  });
}

export function runOpponentTurn(state: GameState, random = Math.random): GameState {
  let next = cloneState(state);
  const opponent = next.players[1];
  const energy = opponent.hand.find((held) => getCard(held.cardId).kind === 'energy');
  if (energy && !opponent.hasPlayedEnergy) next = playEnergy(next, 1, energy.instanceId).state;

  const unit = firstAffordableHandCard(next.players[1], 'unit');
  if (unit) {
    const row: RowName = next.players[1].vanguard.some((slot) => slot === null) ? 'vanguard' : 'backguard';
    const index = next.players[1][row].findIndex((slot) => slot === null);
    if (index >= 0) next = playUnit(next, { player: 1, row, index }, unit.instanceId).state;
  }
  const utility = firstAffordableHandCard(next.players[1], 'utility');
  if (utility) next = playUtility(next, 1, utility.instanceId).state;

  if (opponent.hasTakenFirstTurn) {
    for (let index = 0; index < 5 && next.winner === null; index += 1) {
      const attacker = next.players[1].vanguard[index];
      if (!attacker?.isReady) continue;
      const attackIndex = getCard(attacker.cardId).attacks.findIndex((attack) =>
        attackDamage(attack) > 0 && energyPayment(attack.cost, next.players[1].energies) !== null,
      );
      if (attackIndex < 0) continue;
      const targetIndex = next.players[0].vanguard.findIndex(Boolean);
      const target = targetIndex >= 0 ? { player: 0 as const, row: 'vanguard' as const, index: targetIndex } : null;
      next = useAttack(next, { player: 1, row: 'vanguard', index }, attackIndex, target, random).state;
    }
  }
  next.players[1].hasTakenFirstTurn = true;
  if (next.winner === null) {
    next.round += 1;
    startTurn(next, 0);
    withLog(next, `Round ${next.round}. Your Energy and Units are Ready.`);
  }
  next.isOpponentActing = false;
  return next;
}

export function endPlayerTurn(state: GameState): GameResult {
  if (state.activePlayer !== 0 || state.winner !== null) return { state, error: 'You cannot end the turn now.' };
  const next = cloneState(state);
  next.players[0].hasTakenFirstTurn = true;
  startTurn(next, 1);
  next.isOpponentActing = true;
  return { state: withLog(next, 'Opponent turn. The Rift Automaton is evaluating the board…') };
}
