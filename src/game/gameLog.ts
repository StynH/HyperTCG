import { getCard } from '../data/catalog';
import type {
  CardInstance, GameLogEntry, GameLogSubject, GameState, PlayerId, UnitInPlay,
} from './types';

export type GameLogInput = Omit<GameLogEntry, 'sequence'>;

export function appendGameLog(state: GameState, entry: GameLogInput): GameState {
  const sequence = ++state.logSequence;
  state.log = [{ ...entry, sequence }, ...state.log].slice(0, 24);
  return state;
}

export function cardLogSubject(
  card: Pick<CardInstance, 'instanceId' | 'cardId'>,
  playerId?: PlayerId,
): GameLogSubject {
  return {
    kind: 'card',
    name: getCard(card.cardId).name,
    instanceId: card.instanceId,
    cardId: card.cardId,
    playerId,
  };
}

export function playerLogSubject(state: GameState, playerId: PlayerId): GameLogSubject {
  return { kind: 'player', name: state.players[playerId].name, playerId };
}

export function rulesLogSubject(name = 'Game rules'): GameLogSubject {
  return { kind: 'rules', name };
}

export function findLogSubject(state: GameState, instanceId?: string): GameLogSubject | undefined {
  if (!instanceId) return undefined;
  if (instanceId === 'rules') return rulesLogSubject();
  for (const playerId of [0, 1] as const) {
    const player = state.players[playerId];
    const cards: Array<CardInstance | UnitInPlay | null> = [
      ...player.deck,
      ...player.hand,
      ...player.vanguard,
      ...player.backguard,
      ...player.utilities,
      ...player.energies,
      ...player.vanquished,
    ];
    const card = cards.find((candidate) => candidate?.instanceId === instanceId);
    if (card) return cardLogSubject(card, playerId);
  }
  return undefined;
}
