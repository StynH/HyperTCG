import type { ConditionName, GameEventName, ModifierKind } from '../effectTypes';
import type { CardZone } from '../effectTypes';
import type { EnergyType, PlayerId, RowName } from '../types';

export interface TestUnitSetup {
  ref: string;
  cardId: string;
  player: PlayerId;
  row: RowName;
  index: number;
  hp?: number;
  isReady?: boolean;
  conditions?: Array<{ name: ConditionName; amount?: number }>;
}

export interface TestCardSetup {
  ref: string;
  cardId: string;
  player: PlayerId;
  zone: 'deck' | 'hand' | 'utilities' | 'energies' | 'vanquished';
  owner?: PlayerId;
  isTapped?: boolean;
  attachedTo?: string;
  top?: boolean;
  completion?: number;
  done?: boolean;
}

export interface TestSetup {
  sourceZone?: RowName | 'hand';
  sourceRow?: RowName;
  sourceHp?: number;
  sourceReady?: boolean;
  sourceConditions?: Array<{ name: ConditionName; amount?: number }>;
  // Construction sources start in the Utility zone with this much Completion
  // already accrued, so a single advance can be tuned to complete it or not.
  sourceCompletion?: number;
  sourceDone?: boolean;
  units?: readonly TestUnitSetup[];
  cards?: readonly TestCardSetup[];
  playerHp?: Partial<Record<PlayerId, number>>;
  activePlayer?: PlayerId;
  sparseBoard?: boolean;
  defaultEnergyCopies?: number;
  energies?: readonly { ref: string; player: PlayerId; type: EnergyType; owner?: PlayerId; isTapped?: boolean }[];
  modifiers?: readonly {
    source: string;
    target?: string;
    player?: PlayerId;
    kind: ModifierKind;
    amount?: number;
    text?: string;
  }[];
  usedActions?: readonly { source: string; actionId: string }[];
  turnEvents?: readonly {
    event: GameEventName;
    source?: string;
    target?: string;
    controller: PlayerId;
    sourceController?: PlayerId;
    damageType?: 'attack' | 'effect' | 'condition';
    amount?: number;
    critical?: boolean;
  }[];
}

export type TestAction =
  | { kind: 'attack'; attackId: string; target?: string | null; effectRoll?: number; criticalRoll?: number; defenseRoll?: number; surplus?: number }
  | { kind: 'ability'; abilityId: string }
  | { kind: 'trigger'; event: GameEventName; eventSource?: string; eventTarget?: string; controller?: PlayerId; damageType?: 'attack' | 'effect' | 'condition'; amount?: number; critical?: boolean }
  | { kind: 'utility' }
  | { kind: 'energy' }
  | { kind: 'opponent-attack'; attackerCardId: string; attackId: string; target: string; effectRoll?: number; criticalRoll?: number; defenseRoll?: number }
  | { kind: 'friendly-attack'; attackerCardId: string; attackId: string; target?: string | null; effectRoll?: number; criticalRoll?: number; defenseRoll?: number }
  | { kind: 'opponent-play-unit'; card: string; row: RowName; index: number }
  | { kind: 'advance-construction' }
  | { kind: 'continuous' };

export interface TestChoice {
  refs?: readonly string[];
  optionIds?: readonly string[];
  choose?: 'minimum' | 'maximum' | 'none';
  ability?: { source: string; abilityId: string };
  captureAs?: string;
}

export type GameplayExpectation =
  | { kind: 'hp-change'; ref: string; amount: number }
  | { kind: 'hp'; ref: string; value: number }
  | { kind: 'player-hp-change'; player: PlayerId; amount: number }
  | { kind: 'condition'; ref: string; condition: ConditionName; present: boolean; amount?: number }
  | { kind: 'ready'; ref: string; value: boolean }
  | { kind: 'zone'; ref: string; zone: CardZone }
  | { kind: 'zone-position'; ref: string; zone: 'deck' | 'hand' | 'utilities' | 'energies' | 'vanquished'; position: 'top' | 'bottom'; within: number }
  | { kind: 'row'; ref: string; row: RowName }
  | { kind: 'zone-count-change'; player: PlayerId; zone: CardZone; amount: number }
  | { kind: 'modifier-total'; ref?: string; player?: PlayerId; modifier: ModifierKind; amount: number }
  | { kind: 'modifier'; ref?: string; player?: PlayerId; modifier: ModifierKind; present: boolean; text?: string }
  | { kind: 'last-damage'; amount: number }
  | { kind: 'attached'; equipment: string; unit: string }
  | { kind: 'attack-available'; ref: string; attackId: string; present: boolean }
  | { kind: 'energy-tapped-change'; player: PlayerId; amount: number }
  | { kind: 'used-action'; ref: string; abilityId: string; used: boolean }
  | { kind: 'log'; includes: string }
  | { kind: 'error'; includes?: string }
  | { kind: 'winner'; player: PlayerId | null }
  | { kind: 'owner'; ref: string; player: PlayerId }
  | { kind: 'attack-blocked'; ref: string; includes?: string }
  | { kind: 'remains-exhausted-next-turn'; ref: string };

export interface GameplayScenario {
  name: string;
  covers: readonly string[];
  setup?: TestSetup;
  action: TestAction;
  choices?: readonly TestChoice[];
  expect: readonly GameplayExpectation[];
}

export interface CardGameplayTest {
  cardId: string;
  scenarios: readonly GameplayScenario[];
}

export function defineGameplayCardTest(test: CardGameplayTest): CardGameplayTest {
  return Object.freeze(test);
}
