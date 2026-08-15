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
  isGenericCostVariable?: boolean;
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
  isGenericCostVariable?: boolean;
  abilities: readonly AbilityDefinition[];
  attacks: readonly AttackDefinition[];
  primary: CostType | null;
  image: string;
  utilityType: 'instant' | 'continuous' | 'equipment' | 'free';
  utilityCondition: string;
  utilityEffect: string;
  utilityContent?: 'effect' | 'attack';
  utilityAttack?: AttackDefinition;
  unitTreatment?: 'standard' | 'super' | 'alternative';
  rarity: string;
  setId: string;
  number: number;
  total: number;
  energyType?: EnergyType;
}

export interface CardInstance {
  instanceId: string;
  cardId: string;
  owner?: PlayerId;
}

export interface UnitInPlay extends CardInstance {
  currentHp: number;
  isReady: boolean;
  enteredTurn: number;
  conditions: Array<{
    name: import('./effectTypes').ConditionName;
    amount?: number;
    appliedTurn: number;
    controllerTurns: number;
  }>;
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
  utilities: Array<CardInstance & { attachedTo?: string }>;
  energies: EnergyInPlay[];
  vanquished: CardInstance[];
  hasPlayedEnergy: boolean;
  energyPlaysThisTurn: number;
  hasTakenFirstTurn: boolean;
  turnCount: number;
}

export interface DieRollResult {
  kind: 'effect' | 'critical' | 'defense';
  sides: number;
  value: number;
}

export interface RollResult {
  sequence: number;
  rolls: readonly DieRollResult[];
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
  actionSequence: number;
  rollSequence: number;
  usedActions: Record<string, number>;
  modifiers: RuntimeModifier[];
  pendingChoice: PendingChoice | null;
  pendingTurn: PlayerId | null;
  turnEvents: TurnEventRecord[];
}

export interface TurnEventRecord {
  name: import('./effectTypes').GameEventName;
  sourceId?: string;
  targetId?: string;
  controller: PlayerId;
  sourceController?: PlayerId;
  damageType?: 'attack' | 'effect' | 'condition';
  amount?: number;
  critical?: boolean;
}

export interface RuntimeModifier {
  id: string;
  sourceInstanceId: string;
  targetIds: string[];
  targetPlayer?: PlayerId;
  kind: import('./effectTypes').ModifierKind;
  amount?: number;
  text?: string;
  expires: { turn: number; player: PlayerId; phase: 'start' | 'end' } | { attack: number } | null;
}

export interface ChoiceOption {
  id: string;
  label: string;
  cardId?: string;
}

export interface PendingChoice {
  id: string;
  player: PlayerId;
  prompt: string;
  min: number;
  max: number;
  ordered: boolean;
  options: ChoiceOption[];
  store: string;
  event?: import('./effectRuntime').EffectEvent;
  continuation: import('./effectRuntime').EffectContinuation;
}

export interface BoardAddress {
  player: PlayerId;
  row: RowName;
  index: number;
}

export type GameResult = { state: GameState; error?: string };
