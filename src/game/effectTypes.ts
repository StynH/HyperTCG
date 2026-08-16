import type { CostType, PlayerId, RowName } from './types';

export type ConditionName = 'paralyzed' | 'cowering' | 'weakened' | 'infected' | 'doomed' | 'cursed' | 'tranquil';
export type CardZone = 'deck' | 'hand' | 'vanguard' | 'backguard' | 'utilities' | 'energies' | 'vanquished';
export type ControllerRef = 'actor' | 'opponent' | 'source-controller' | 'event-controller' | 'event-opponent';
export type CardRef = string;

export interface CardSelector {
  zone: CardZone | readonly CardZone[];
  ref?: CardRef;
  controller?: ControllerRef;
  kind?: 'unit' | 'utility' | 'energy';
  energyType?: Exclude<CostType, 'any'>;
  cardType?: string;
  subtitle?: string | readonly string[];
  utilityType?: 'instant' | 'continuous' | 'equipment' | 'free';
  row?: RowName;
  ready?: boolean;
  hasCondition?: ConditionName | 'any';
  costAtMost?: number;
  costExactly?: number;
  exclude?: CardRef | readonly CardRef[];
  top?: number;
  anyOf?: readonly CardSelector[];
  attachedTo?: CardRef;
  equipmentSlotsAvailable?: boolean;
  hasModifier?: { kind: ModifierKind; source?: CardRef; text?: string };
}

export type ValueExpression = number
  | { value: 'dr' | 'surplus' | 'x-cost' | 'attack-damage' | 'event-damage' | 'condition-amount' }
  | { count: CardSelector }
  | { countEvents: { event: GameEventName; controller?: ControllerRef; sourceController?: ControllerRef } }
  | { add: readonly ValueExpression[] }
  | { multiply: readonly ValueExpression[] };

export type ConditionExpression =
  | { all: readonly ConditionExpression[] }
  | { any: readonly ConditionExpression[] }
  | { not: ConditionExpression }
  | { exists: CardSelector; atLeast?: number }
  | { matches: { ref: CardRef; selector: CardSelector } }
  | { compare: { left: ValueExpression; op: 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte'; right: ValueExpression } }
  | { parity: { value: ValueExpression; is: 'even' | 'odd' } }
  | { hasCondition: { ref: CardRef; condition: ConditionName | 'any' } }
  | { event: 'attack-damage' | 'effect-damage' | 'attack-targeted' | 'unit-vanquished' | 'unit-rotated' }
  | { eventCausedBy: CardRef }
  | { eventTarget: CardRef }
  | { eventCritical: boolean }
  | { eventController: ControllerRef }
  | { eventSourceController: ControllerRef }
  | { activePlayer: ControllerRef }
  | { hasOpenSlot: { controller: ControllerRef; rows: readonly RowName[]; atLeast?: number } };

export interface EffectChoice {
  op: 'choose';
  selector: CardSelector;
  store: CardRef;
  min?: number;
  max?: number;
  prompt: string;
  ordered?: boolean;
}

export interface EffectChooseSlots {
  op: 'choose-slots';
  controller: ControllerRef;
  rows: readonly RowName[];
  store: CardRef;
  min?: number;
  max?: number;
  countFrom?: CardRef;
  prompt: string;
}

export interface EffectMove {
  op: 'move';
  cards: CardRef | CardSelector;
  to: CardZone | 'bottom-deck' | 'top-deck' | 'hand-owner';
  controller?: ControllerRef;
  slots?: CardRef;
  ready?: boolean;
  faceDown?: boolean;
}

export type ModifierKind =
  | 'defense' | 'max-hp' | 'attack-damage' | 'attack-damage-taken' | 'play-cost'
  | 'utility-cost' | 'cannot-attack' | 'cannot-rotate' | 'cannot-afflict-condition'
  | 'condition-immunity' | 'add-card-type' | 'ignore-defense' | 'extra-energy-play'
  | 'cannot-play-backguard' | 'reveal-hand' | 'ignore-rotation-prevention' | 'reroll-effect-die'
  | 'cannot-ready';

export type ModifierDuration = 'turn' | 'active-turn' | 'opponent-next-turn' | 'controller-next-turn' | 'attack' | 'permanent';

export interface EffectModifier {
  op: 'modifier';
  target: CardRef | CardSelector | ControllerRef;
  kind: ModifierKind;
  amount?: ValueExpression;
  text?: string;
  duration: ModifierDuration;
}

export type EffectOperation =
  | EffectChoice
  | EffectChooseSlots
  | EffectMove
  | EffectModifier
  | { op: 'draw'; player?: ControllerRef; count: ValueExpression }
  | { op: 'damage'; target: CardRef | CardSelector; amount: ValueExpression; damageType?: 'effect' | 'condition' }
  | { op: 'heal'; target: CardRef | CardSelector; amount: ValueExpression }
  | { op: 'ready'; target: CardRef | CardSelector }
  | { op: 'exhaust'; target: CardRef | CardSelector }
  | { op: 'rotate'; target: CardRef | CardSelector; exhaust?: boolean }
  | { op: 'vanquish'; target: CardRef | CardSelector; faceDown?: boolean }
  | { op: 'condition'; target: CardRef | CardSelector; condition: ConditionName; amount?: ValueExpression }
  | { op: 'remove-conditions'; target: CardRef | CardSelector; conditions?: readonly ConditionName[] }
  | { op: 'if'; condition: ConditionExpression; then: readonly EffectOperation[]; else?: readonly EffectOperation[] }
  | { op: 'for-each'; selector: CardSelector; store: CardRef; effects: readonly EffectOperation[] }
  | { op: 'roll'; sides: number; store?: 'dr' }
  | { op: 'set-attack'; property: 'damage' | 'critical' | 'failed' | 'exhaust-attacker' | 'ignore-defense'; value: ValueExpression | boolean }
  | { op: 'prevent-vanquish'; target: CardRef; hp: number }
  | { op: 'attach'; equipment: CardRef; unit: CardRef }
  | { op: 'reveal'; target: CardRef | CardSelector; to?: ControllerRef }
  | { op: 'shuffle'; player?: ControllerRef }
  | { op: 'win'; player?: ControllerRef }
  | { op: 'log'; message: string };

export interface ScriptCondition {
  condition: ConditionExpression;
  message: string;
}

export interface ActivatedScript {
  id: string;
  name: string;
  timing: 'action' | 'effect-die';
  once?: 'turn';
  condition?: ConditionExpression;
  costs?: readonly EffectOperation[];
  effects: readonly EffectOperation[];
}

export type GameEventName = 'played' | 'attack-targeted' | 'attack-declared' | 'unit-rotated' | 'unit-vanquished' | 'turn-start' | 'turn-end' | 'would-vanquish';

export interface TriggeredScript {
  id: string;
  event: GameEventName;
  sourceZone?: CardZone | readonly CardZone[];
  once?: 'turn';
  condition?: ConditionExpression;
  optional?: boolean;
  effects: readonly EffectOperation[];
}

export interface ContinuousScript {
  id: string;
  condition?: ConditionExpression;
  target: CardSelector | ControllerRef;
  kind: ModifierKind;
  amount?: ValueExpression;
  text?: string;
}

export interface AttackScript {
  id: string;
  target?: CardSelector;
  surplus?: boolean;
  prepare?: readonly EffectOperation[];
  effects?: readonly EffectOperation[];
  afterDamage?: readonly EffectOperation[];
}

export interface UtilityScript {
  condition?: ScriptCondition;
  reaction?: { event: GameEventName; condition?: ConditionExpression };
  attach?: CardSelector;
  effects?: readonly EffectOperation[];
}

export interface CardEffectScript {
  version: 1;
  cardId: string;
  activated?: readonly ActivatedScript[];
  triggers?: readonly TriggeredScript[];
  continuous?: readonly ContinuousScript[];
  attacks?: readonly AttackScript[];
  utility?: UtilityScript;
  energy?: { type: Exclude<CostType, 'any'>; playablePerTurn: 1 };
}

export interface ResolvedCardLocation {
  player: PlayerId;
  zone: CardZone;
  index: number;
  row?: RowName;
}
