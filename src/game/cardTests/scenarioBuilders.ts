import type { GameplayExpectation, GameplayScenario, TestChoice, TestSetup } from './gameplayTestTypes';
import type { CardZone, ConditionName, GameEventName, ModifierKind } from '../effectTypes';
import type { PlayerId, RowName } from '../types';

interface ScenarioOptions {
  name?: string;
  setup?: TestSetup;
  choices?: readonly TestChoice[];
  expect?: readonly GameplayExpectation[];
  covers?: readonly string[];
}

interface AttackOptions extends ScenarioOptions {
  target?: string | null;
  effectRoll?: number;
  criticalRoll?: number;
  defenseRoll?: number;
  surplus?: number;
}

export function attack(attackId: string, options: AttackOptions = {}): GameplayScenario {
  return {
    name: options.name ?? `${attackId} produces its intended gameplay result`,
    covers: options.covers ?? [`attack:${attackId}`],
    setup: options.setup,
    action: {
      kind: 'attack', attackId, target: options.target, effectRoll: options.effectRoll,
      criticalRoll: options.criticalRoll, defenseRoll: options.defenseRoll, surplus: options.surplus,
    },
    choices: options.choices,
    expect: options.expect ?? [],
  };
}

export function activated(abilityId: string, options: ScenarioOptions = {}): GameplayScenario {
  return {
    name: options.name ?? `${abilityId} produces its intended gameplay result`,
    covers: options.covers ?? [`activated:${abilityId}`],
    setup: options.setup,
    action: { kind: 'ability', abilityId },
    choices: options.choices,
    expect: options.expect ?? [],
  };
}

export function trigger(
  triggerId: string,
  event: GameEventName,
  options: ScenarioOptions & {
    eventSource?: string;
    eventTarget?: string;
    controller?: PlayerId;
    damageType?: 'attack' | 'effect' | 'condition';
    amount?: number;
    critical?: boolean;
  } = {},
): GameplayScenario {
  return {
    name: options.name ?? `${triggerId} fires only for its intended event`,
    covers: options.covers ?? [`trigger:${triggerId}`],
    setup: options.setup,
    action: {
      kind: 'trigger', event, eventSource: options.eventSource, eventTarget: options.eventTarget,
      controller: options.controller, damageType: options.damageType, amount: options.amount,
      critical: options.critical,
    },
    choices: options.choices,
    expect: options.expect ?? [],
  };
}

export function opponentPlayUnit(
  card: string,
  row: RowName,
  index: number,
  options: ScenarioOptions = {},
): GameplayScenario {
  return {
    name: options.name ?? 'Playing an opposing Unit opens and resolves the intended reaction window',
    covers: options.covers ?? [],
    setup: options.setup,
    action: { kind: 'opponent-play-unit', card, row, index },
    choices: options.choices,
    expect: options.expect ?? [],
  };
}

// A Construction begins the scenario already in play in the Utility zone; the
// action pays its Energy Cost once more to add 1 Completion. Tune
// `setup.sourceCompletion` so that single advance either completes it or not.
export function construction(options: ScenarioOptions = {}): GameplayScenario {
  return {
    name: options.name ?? 'Advancing the Construction produces its intended result',
    covers: options.covers ?? ['utility'],
    setup: options.setup,
    action: { kind: 'advance-construction' },
    choices: options.choices,
    expect: options.expect ?? [],
  };
}

export function continuous(continuousId: string, options: ScenarioOptions = {}): GameplayScenario {
  return {
    name: options.name ?? `${continuousId} applies its intended continuous rule`,
    covers: options.covers ?? [`continuous:${continuousId}`],
    setup: options.setup,
    action: { kind: 'continuous' },
    choices: options.choices,
    expect: options.expect ?? [],
  };
}

export function utility(options: ScenarioOptions = {}): GameplayScenario {
  return {
    name: options.name ?? 'Utility produces its intended gameplay result',
    covers: options.covers ?? ['utility'],
    setup: options.setup,
    action: { kind: 'utility' },
    choices: options.choices,
    expect: options.expect ?? [],
  };
}

export function energy(options: ScenarioOptions = {}): GameplayScenario {
  return {
    name: options.name ?? 'Energy enters play and counts as the printed Energy type',
    covers: options.covers ?? ['energy'],
    setup: options.setup,
    action: { kind: 'energy' },
    choices: options.choices,
    expect: options.expect ?? [],
  };
}

export function opponentAttack(
  attackerCardId: string,
  attackId: string,
  target: string,
  options: ScenarioOptions & { effectRoll?: number; criticalRoll?: number; defenseRoll?: number } = {},
): GameplayScenario {
  return {
    name: options.name ?? `${attackId} opens and resolves the intended reaction window`,
    covers: options.covers ?? ['utility'],
    setup: options.setup,
    action: {
      kind: 'opponent-attack', attackerCardId, attackId, target,
      effectRoll: options.effectRoll, criticalRoll: options.criticalRoll, defenseRoll: options.defenseRoll,
    },
    choices: options.choices,
    expect: options.expect ?? [],
  };
}

export function friendlyAttack(
  attackerCardId: string,
  attackId: string,
  options: ScenarioOptions & { target?: string | null; effectRoll?: number; criticalRoll?: number; defenseRoll?: number } = {},
): GameplayScenario {
  return {
    name: options.name ?? `${attackId} interacts with the card during a real friendly attack`,
    covers: options.covers ?? [],
    setup: options.setup,
    action: {
      kind: 'friendly-attack', attackerCardId, attackId, target: options.target,
      effectRoll: options.effectRoll, criticalRoll: options.criticalRoll, defenseRoll: options.defenseRoll,
    },
    choices: options.choices,
    expect: options.expect ?? [],
  };
}

export const hpChange = (ref: string, amount: number): GameplayExpectation => ({ kind: 'hp-change', ref, amount });
export const hp = (ref: string, value: number): GameplayExpectation => ({ kind: 'hp', ref, value });
export const playerHpChange = (player: PlayerId, amount: number): GameplayExpectation => ({ kind: 'player-hp-change', player, amount });
export const condition = (ref: string, name: ConditionName, present = true, amount?: number): GameplayExpectation => ({ kind: 'condition', ref, condition: name, present, amount });
export const ready = (ref: string, value: boolean): GameplayExpectation => ({ kind: 'ready', ref, value });
export const zone = (ref: string, targetZone: CardZone): GameplayExpectation => ({ kind: 'zone', ref, zone: targetZone });
export const zonePosition = (ref: string, targetZone: 'deck' | 'hand' | 'utilities' | 'energies' | 'vanquished', position: 'top' | 'bottom', within = 1): GameplayExpectation => ({ kind: 'zone-position', ref, zone: targetZone, position, within });
export const row = (ref: string, targetRow: RowName): GameplayExpectation => ({ kind: 'row', ref, row: targetRow });
export const zoneCountChange = (player: PlayerId, targetZone: CardZone, amount: number): GameplayExpectation => ({ kind: 'zone-count-change', player, zone: targetZone, amount });
export const modifierTotal = (ref: string | undefined, player: PlayerId | undefined, modifier: ModifierKind, amount: number): GameplayExpectation => ({ kind: 'modifier-total', ref, player, modifier, amount });
export const modifier = (ref: string | undefined, player: PlayerId | undefined, kind: ModifierKind, present = true, text?: string): GameplayExpectation => ({ kind: 'modifier', ref, player, modifier: kind, present, text });
export const lastDamage = (amount: number): GameplayExpectation => ({ kind: 'last-damage', amount });
export const attached = (equipment: string, unit: string): GameplayExpectation => ({ kind: 'attached', equipment, unit });
export const attackAvailable = (ref: string, attackId: string, present = true): GameplayExpectation => ({ kind: 'attack-available', ref, attackId, present });
export const tappedChange = (player: PlayerId, amount: number): GameplayExpectation => ({ kind: 'energy-tapped-change', player, amount });
export const usedAction = (ref: string, abilityId: string, used = true): GameplayExpectation => ({ kind: 'used-action', ref, abilityId, used });
export const logIncludes = (includes: string): GameplayExpectation => ({ kind: 'log', includes });
export const error = (includes?: string): GameplayExpectation => ({ kind: 'error', includes });
export const winner = (player: PlayerId | null): GameplayExpectation => ({ kind: 'winner', player });
export const owner = (ref: string, player: PlayerId): GameplayExpectation => ({ kind: 'owner', ref, player });
export const attackBlocked = (ref: string, includes?: string): GameplayExpectation => ({ kind: 'attack-blocked', ref, includes });
export const remainsExhaustedNextTurn = (ref: string): GameplayExpectation => ({ kind: 'remains-exhausted-next-turn', ref });
