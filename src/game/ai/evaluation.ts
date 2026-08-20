import { getCard } from '../../data/catalog';
import type { GameState, PlayerId, PlayerState, UnitInPlay } from '../types';
import type { DeckProfile } from './types';

const TERMINAL_VALUE = 1_000_000;

const conditionPenalty = {
  paralyzed: 42,
  cowering: 28,
  weakened: 14,
  infected: 24,
  doomed: 100,
  cursed: 22,
  tranquil: -10,
} as const;

function unitValue(unit: UnitInPlay, row: 'vanguard' | 'backguard'): number {
  const card = getCard(unit.cardId);
  const conditions = unit.conditions.reduce((total, condition) => (
    total + conditionPenalty[condition.name] + (condition.name === 'infected' ? condition.amount ?? 0 : 0)
  ), 0);
  return unit.currentHp * 1.6
    + card.defense * 0.45
    + card.cost.length * 12
    + (unit.isReady ? 16 : 0)
    + (row === 'vanguard' ? 5 : 0)
    - conditions;
}

function energyValue(player: PlayerState, profile?: DeckProfile): number {
  const totalDemand = profile
    ? Object.values(profile.energyDemand).reduce((total, demand) => total + demand, 0)
    : 0;
  return player.energies.reduce((total, energy) => {
    const demandShare = totalDemand ? (profile?.energyDemand[energy.energyType] ?? 0) / totalDemand : 0;
    return total + 48 + demandShare * 18 + (energy.isTapped ? 0 : 10);
  }, 0);
}

function handValue(player: PlayerState, profile?: DeckProfile): number {
  const totalDemand = profile
    ? Object.values(profile.energyDemand).reduce((total, demand) => total + demand, 0)
    : 0;
  const definitions = player.hand.map(({ cardId }) => getCard(cardId));
  const energyCards = definitions.filter(({ kind }) => kind === 'energy');
  const cardValue = definitions.reduce((total, card) => {
    if (card.kind === 'energy') {
      const demandShare = totalDemand && card.energyType ? (profile?.energyDemand[card.energyType] ?? 0) / totalDemand : 0;
      return total + 22 + demandShare * 16;
    }
    if (card.kind === 'unit') return total + 20 + card.hp * 0.08 + card.defense * 0.04 + card.attacks.length * 4;
    return total + 24 + card.cost.length * 2;
  }, 0);
  if (player.hasTakenFirstTurn) return cardValue;

  const openingEnergyCurve = [-120, 10, 65, 80, 55, 25, 0, -20][Math.min(energyCards.length, 7)];
  const nearCurveCards = definitions.filter((card) => card.kind !== 'energy' && card.cost.length <= energyCards.length + 1).length;
  const usefulEnergyTypes = new Set(energyCards.flatMap(({ energyType }) => (
    energyType && (profile?.energyDemand[energyType] ?? 0) > 0 ? [energyType] : []
  ))).size;
  return cardValue + openingEnergyCurve + nearCurveCards * 8 + usefulEnergyTypes * 5;
}

function playerValue(player: PlayerState, profile?: DeckProfile): number {
  const units = player.vanguard.reduce((total, unit) => total + (unit ? unitValue(unit, 'vanguard') : 0), 0)
    + player.backguard.reduce((total, unit) => total + (unit ? unitValue(unit, 'backguard') : 0), 0);
  const utilities = player.utilities.reduce((total, utility) => {
    const card = getCard(utility.cardId);
    const completion = utility.completion ?? 0;
    return total + 28 + card.cost.length * 8 + completion * 18 + (utility.isDone ? 35 : 0);
  }, 0);
  return player.hp * 5
    + handValue(player, profile)
    + player.deck.length * 0.5
    + units
    + energyValue(player, profile)
    + utilities;
}

export function evaluateGameState(
  state: GameState,
  player: PlayerId,
  profiles: Partial<Record<PlayerId, DeckProfile>> = {},
): number {
  if (state.winner !== null) return state.winner === player ? TERMINAL_VALUE : -TERMINAL_VALUE;
  const opponent: PlayerId = player === 0 ? 1 : 0;
  return playerValue(state.players[player], profiles[player]) - playerValue(state.players[opponent], profiles[opponent]);
}
