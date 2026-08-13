export const ENERGY_TYPES = ['gluon', 'photon', 'electron', 'muon', 'boson', 'neutrino'] as const;
export type EnergyType = (typeof ENERGY_TYPES)[number];
export type CostType = EnergyType | 'any';
export type RowName = 'vanguard' | 'backguard';
export type PlayerId = 0 | 1;

export interface AbilityDefinition {
  id: string;
  name: string;
  text: string;
}

export interface AttackDefinition {
  id: string;
  name: string;
  cost: readonly CostType[];
  dice: readonly { id: string; die: number }[];
  damage: string;
  effect: string;
}

export interface CardDefinition {
  id: string;
  kind: 'unit' | 'utility' | 'energy';
  name: string;
  subtitle: string;
  type: string;
  flavor: string;
  hp: number;
  defense: number;
  cost: readonly CostType[];
  abilities: readonly AbilityDefinition[];
  attacks: readonly AttackDefinition[];
  primary: CostType | null;
  image: string;
  utilityType: 'instant' | 'continuous' | 'equipment' | 'free';
  utilityCondition: string;
  utilityEffect: string;
  rarity: string;
  setId: string;
  number: number;
  total: number;
  energyType?: EnergyType;
}

export interface CardInstance {
  instanceId: string;
  cardId: string;
}

export interface UnitInPlay extends CardInstance {
  currentHp: number;
  isReady: boolean;
}

export interface EnergyInPlay extends CardInstance {
  energyType: EnergyType;
  isTapped: boolean;
}

export interface PlayerState {
  name: string;
  hp: number;
  deck: CardInstance[];
  hand: CardInstance[];
  vanguard: Array<UnitInPlay | null>;
  backguard: Array<UnitInPlay | null>;
  utilities: CardInstance[];
  energies: EnergyInPlay[];
  vanquished: CardInstance[];
  hasPlayedEnergy: boolean;
  hasTakenFirstTurn: boolean;
}

export interface RollResult {
  attack: number;
  defense?: number;
  damage: number;
  summary: string;
}

export interface GameState {
  players: [PlayerState, PlayerState];
  activePlayer: PlayerId;
  round: number;
  log: string[];
  lastRoll: RollResult | null;
  winner: PlayerId | null;
  isOpponentActing: boolean;
}

export interface BoardAddress {
  player: PlayerId;
  row: RowName;
  index: number;
}

export type GameResult = { state: GameState; error?: string };
