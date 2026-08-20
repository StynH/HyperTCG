/* oxlint-disable unicorn/no-thenable -- `then` is an intentional JSON DSL branch, not a Promise contract. */
import { getCard } from '../data/catalog';
import { getEffectScript } from '../data/effects';
import {
  appendGameLog, cardLogSubject, findLogSubject, playerLogSubject, rulesLogSubject,
} from './gameLog';
import type {
  CardSelector, ConditionExpression, ControllerRef, EffectOperation, GameEventName,
  ModifierDuration, ModifierKind, ResolvedCardLocation, ValueExpression,
} from './effectTypes';
import type {
  AttackDefinition, CardInstance, ChoiceOption, DieRollResult, GameState, PlayerId,
  RollResult, RuntimeModifier, UnitInPlay,
} from './types';
import { randomInteger, rollDie, secureRandom } from './random';

export interface EffectEvent {
  name: GameEventName;
  sourceId?: string;
  targetId?: string;
  controller: PlayerId;
  damageType?: 'attack' | 'effect' | 'condition';
  amount?: number;
  critical?: boolean;
}

export interface AttackRuntime {
  sequence: number;
  attackerId: string;
  defenderId: string | null;
  defendingPlayer: PlayerId;
  attackId: string;
  attackName: string;
  combat: NonNullable<RollResult['combat']>;
  effectDieSides: number;
  dr: number;
  surplus: number;
  xCost: number;
  damage: number;
  criticalRoll: number;
  defenseRoll?: number;
  defenseTarget?: number;
  isCritical: boolean;
  isFailed: boolean;
  shouldExhaust: boolean;
  ignoresDefense: boolean;
  criticalMultiplier?: number;
  cannotCrit?: boolean;
}

type StoredValue = string[] | number | boolean;

interface RuntimeFrame {
  effects: RuntimeOperation[];
  index: number;
  actor: PlayerId;
  sourceId: string;
  event?: EffectEvent;
  skipIfAttackFailed?: boolean;
  variable?: { name: string; value: string[]; previous?: StoredValue };
  initialized?: boolean;
}

type InternalOperation =
  | { internal: 'dispatch'; event: EffectEvent }
  | { internal: 'roll-effect-die'; sides: number }
  | { internal: 'offer-die-actions' }
  | { internal: 'run'; effects: readonly EffectOperation[]; skipIfAttackFailed?: boolean }
  | { internal: 'roll-critical' }
  | { internal: 'self-attack-damage' }
  | { internal: 'resolve-attack-damage' }
  | { internal: 'finish-attack' }
  | { internal: 'tap-surplus'; ref: string }
  | { internal: 'tap-energy'; ref: string; store?: 'x-cost' }
  | { internal: 'finalize-vanquish'; targetId: string; causeId?: string; damageType?: EffectEvent['damageType']; critical?: boolean; faceDown?: boolean; surplus?: number };

type RuntimeOperation = EffectOperation | InternalOperation;

export interface EffectContinuation {
  actor: PlayerId;
  sourceInstanceId: string;
  vars: Record<string, StoredValue>;
  frames: RuntimeFrame[];
  attack?: AttackRuntime;
}

interface ExecutionContext {
  actor: PlayerId;
  sourceId: string;
  event?: EffectEvent;
  continuation: EffectContinuation;
}

const otherPlayer = (player: PlayerId): PlayerId => player === 0 ? 1 : 0;
const asZones = (zone: CardSelector['zone']) => Array.isArray(zone) ? zone : [zone];
const isInternal = (operation: RuntimeOperation): operation is InternalOperation => 'internal' in operation;

export function locateCard(state: GameState, instanceId: string): ResolvedCardLocation | null {
  for (const playerId of [0, 1] as const) {
    const player = state.players[playerId];
    for (const zone of ['deck', 'hand', 'utilities', 'energies', 'vanquished'] as const) {
      const index = player[zone].findIndex((card) => card.instanceId === instanceId);
      if (index >= 0) return { player: playerId, zone, index };
    }
    for (const row of ['vanguard', 'backguard'] as const) {
      const index = player[row].findIndex((card) => card?.instanceId === instanceId);
      if (index >= 0) return { player: playerId, zone: row, row, index };
    }
  }
  return null;
}

export function findUnit(state: GameState, instanceId: string): UnitInPlay | null {
  const location = locateCard(state, instanceId);
  if (!location || (location.zone !== 'vanguard' && location.zone !== 'backguard')) return null;
  return state.players[location.player][location.zone][location.index];
}

function cardAt(state: GameState, location: ResolvedCardLocation): CardInstance | UnitInPlay | null {
  const collection = state.players[location.player][location.zone];
  return collection[location.index] ?? null;
}

function allLocations(state: GameState): ResolvedCardLocation[] {
  const locations: ResolvedCardLocation[] = [];
  for (const player of [0, 1] as const) {
    for (const zone of ['deck', 'hand', 'utilities', 'energies', 'vanquished'] as const) {
      state.players[player][zone].forEach((_, index) => locations.push({ player, zone, index }));
    }
    for (const row of ['vanguard', 'backguard'] as const) {
      state.players[player][row].forEach((card, index) => {
        if (card) locations.push({ player, zone: row, row, index });
      });
    }
  }
  return locations;
}

function controllerFor(ref: ControllerRef | undefined, context: ExecutionContext): PlayerId | null {
  if (!ref) return null;
  if (ref === 'actor' || ref === 'source-controller') return context.actor;
  if (ref === 'opponent') return otherPlayer(context.actor);
  if (ref === 'event-controller') return context.event?.controller ?? context.actor;
  return otherPlayer(context.event?.controller ?? context.actor);
}

function idsFromRef(context: ExecutionContext, ref: string | readonly string[] | undefined): string[] {
  if (!ref) return [];
  if (typeof ref !== 'string') return ref.flatMap((item) => idsFromRef(context, item));
  if (ref === 'source') return [context.sourceId];
  if (ref === 'event-target') return context.event?.targetId ? [context.event.targetId] : [];
  if (ref === 'event-source') return context.event?.sourceId ? [context.event.sourceId] : [];
  if (ref === 'attacker') return context.continuation.attack ? [context.continuation.attack.attackerId] : [];
  if (ref === 'defender') return context.continuation.attack?.defenderId ? [context.continuation.attack.defenderId] : [];
  if (ref === 'equipped-unit') {
    const location = locateCard(currentStateForLookup!, context.sourceId);
    if (!location || location.zone !== 'utilities') return [];
    const utility = currentStateForLookup!.players[location.player].utilities[location.index];
    return utility.attachedTo ? [utility.attachedTo] : [];
  }
  const stored = context.continuation.vars[ref];
  return Array.isArray(stored) ? stored : [];
}

// Selector evaluation is synchronous; this scoped state avoids threading state through
// every expression helper while keeping all lookup state local to a single engine call.
let currentStateForLookup: GameState | null = null;
const resolvingTypes = new Set<string>();

function baseTypes(state: GameState, instanceId: string): Set<string> {
  const location = locateCard(state, instanceId);
  if (!location) return new Set();
  const instance = cardAt(state, location);
  if (!instance) return new Set();
  const printed = getCard(instance.cardId).type;
  const types = new Set(printed ? [printed] : []);
  for (const modifier of state.modifiers) {
    if (modifier.kind === 'add-card-type' && modifier.targetIds.includes(instanceId) && modifier.text) types.add(modifier.text);
  }
  if (resolvingTypes.has(instanceId)) return types;
  resolvingTypes.add(instanceId);
  try {
    const targetLocation = locateCard(state, instanceId);
    if (!targetLocation) return types;
    const continuation: EffectContinuation = { actor: 0, sourceInstanceId: '', vars: {}, frames: [] };
    for (const sourceId of activeSources(state)) {
      const sourceLocation = locateCard(state, sourceId)!;
      const source = cardAt(state, sourceLocation)!;
      const context: ExecutionContext = { actor: sourceLocation.player, sourceId, continuation };
      for (const continuous of getEffectScript(source.cardId).continuous ?? []) {
        if (continuous.kind !== 'add-card-type' || typeof continuous.target === 'string' || !continuous.text) continue;
        if (continuous.condition && !evaluateCondition(state, continuous.condition, context)) continue;
        if (matchesSelector(state, targetLocation, continuous.target, context)) types.add(continuous.text);
      }
    }
  } finally {
    resolvingTypes.delete(instanceId);
  }
  return types;
}

function matchesSelectorBase(
  state: GameState,
  location: ResolvedCardLocation,
  selector: CardSelector,
  context: ExecutionContext,
): boolean {
  const instance = cardAt(state, location);
  if (!instance) return false;
  if (!asZones(selector.zone).includes(location.zone)) return false;
  if (location.zone === 'vanquished' && instance.isFaceDown) return false;
  const controller = controllerFor(selector.controller, context);
  if (controller !== null && location.player !== controller) return false;
  if (selector.ref && !idsFromRef(context, selector.ref).includes(instance.instanceId)) return false;
  const excluded = idsFromRef(context, selector.exclude);
  if (excluded.includes(instance.instanceId)) return false;
  if (selector.attachedTo) {
    if (location.zone !== 'utilities') return false;
    const attached = state.players[location.player].utilities[location.index].attachedTo;
    if (!attached || !idsFromRef(context, selector.attachedTo).includes(attached)) return false;
  }
  if (selector.equipmentSlotsAvailable && state.players[location.player].utilities.filter(({ attachedTo }) => attachedTo === instance.instanceId).length >= 2) return false;
  const definition = getCard(instance.cardId);
  if (selector.kind && definition.kind !== selector.kind) return false;
  if (selector.energyType && (location.zone !== 'energies'
    || state.players[location.player].energies[location.index].energyType !== selector.energyType)) return false;
  if (selector.cardType && !baseTypes(state, instance.instanceId).has(selector.cardType)) return false;
  const subtitles = typeof selector.subtitle === 'string' ? [selector.subtitle] : selector.subtitle;
  if (subtitles && !subtitles.includes(definition.subtitle)) return false;
  if (selector.utilityType && definition.utilityType !== selector.utilityType) return false;
  if (selector.constructionDone !== undefined) {
    if (location.zone !== 'utilities') return false;
    if (Boolean(state.players[location.player].utilities[location.index].isDone) !== selector.constructionDone) return false;
  }
  if (selector.row && location.row !== selector.row) return false;
  if (selector.costAtMost !== undefined && definition.cost.length > selector.costAtMost) return false;
  if (selector.costExactly !== undefined && definition.cost.length !== selector.costExactly) return false;
  if (selector.ready !== undefined) {
    if (location.zone === 'energies') {
      const energy = state.players[location.player].energies[location.index];
      if ((!energy.isTapped) !== selector.ready) return false;
    } else {
      const unit = findUnit(state, instance.instanceId);
      if (!unit || unit.isReady !== selector.ready) return false;
    }
  }
  if (selector.hasCondition) {
    const unit = findUnit(state, instance.instanceId);
    if (!unit) return false;
    if (selector.hasCondition === 'any' ? unit.conditions.length === 0 : !unit.conditions.some(({ name }) => name === selector.hasCondition)) return false;
  }
  if (selector.hasModifier) {
    const sources = selector.hasModifier.source ? idsFromRef(context, selector.hasModifier.source) : [];
    const found = state.modifiers.some((modifier) =>
      modifier.kind === selector.hasModifier!.kind
      && modifier.targetIds.includes(instance.instanceId)
      && (!selector.hasModifier!.text || modifier.text === selector.hasModifier!.text)
      && (!selector.hasModifier!.source || sources.includes(modifier.sourceInstanceId))
    );
    if (!found) return false;
  }
  return true;
}

function matchesSelector(
  state: GameState,
  location: ResolvedCardLocation,
  selector: CardSelector,
  context: ExecutionContext,
): boolean {
  if (!matchesSelectorBase(state, location, selector, context)) return false;
  if (!selector.anyOf?.length) return true;
  return selector.anyOf.some((variant) => matchesSelectorBase(
    state,
    location,
    { ...selector, ...variant, anyOf: undefined },
    context,
  ));
}

export function selectCards(state: GameState, selector: CardSelector, context: ExecutionContext): string[] {
  const previousState = currentStateForLookup;
  currentStateForLookup = state;
  try {
    return allLocations(state)
      .filter((location) => selector.top === undefined || !['deck', 'hand'].includes(location.zone) || location.index < selector.top)
      .filter((location) => matchesSelector(state, location, selector, context))
      .map((location) => cardAt(state, location)!.instanceId);
  } finally {
    currentStateForLookup = previousState;
  }
}

// A Construction Utility contributes nothing to the game — no aura, trigger, or
// activated ability — until its Completion counter reaches its Completion Cost.
export function isDormantConstruction(state: GameState, instanceId: string): boolean {
  const location = locateCard(state, instanceId);
  if (!location || location.zone !== 'utilities') return false;
  if (getCard(cardAt(state, location)!.cardId).utilityType !== 'construction') return false;
  return !state.players[location.player].utilities[location.index].isDone;
}

function activeSources(state: GameState): string[] {
  return allLocations(state)
    .filter(({ zone }) => zone === 'vanguard' || zone === 'backguard' || zone === 'utilities')
    .map((location) => cardAt(state, location)!.instanceId)
    .filter((instanceId) => !isDormantConstruction(state, instanceId));
}

function continuousEntries(state: GameState, targetId: string | null, targetPlayer: PlayerId | null, kind: ModifierKind, continuation?: EffectContinuation) {
  const previousState = currentStateForLookup;
  currentStateForLookup = state;
  const fallback: EffectContinuation = continuation ?? { actor: 0, sourceInstanceId: '', vars: {}, frames: [] };
  const entries: Array<{ amount: number; text?: string }> = [];
  try {
    for (const sourceId of activeSources(state)) {
      const location = locateCard(state, sourceId)!;
      const instance = cardAt(state, location)!;
      const script = getEffectScript(instance.cardId);
      const context: ExecutionContext = { actor: location.player, sourceId, continuation: fallback };
      for (const continuous of script.continuous ?? []) {
        if (continuous.kind !== kind) continue;
        if (continuous.condition && !evaluateCondition(state, continuous.condition, context)) continue;
        if (typeof continuous.target === 'string') {
          if (targetPlayer !== controllerFor(continuous.target, context)) continue;
        } else {
          if (!targetId) continue;
          const targetLocation = locateCard(state, targetId);
          if (!targetLocation || !matchesSelector(state, targetLocation, continuous.target, context)) continue;
        }
        entries.push({ amount: continuous.amount ? evaluateValue(state, continuous.amount, context) : 0, text: continuous.text });
      }
    }
  } finally {
    currentStateForLookup = previousState;
  }
  return entries;
}

function liveRuntimeModifiers(state: GameState, targetId: string | null, targetPlayer: PlayerId | null, kind: ModifierKind) {
  const resolvedPlayer = targetPlayer ?? (targetId ? locateCard(state, targetId)?.player : undefined);
  return state.modifiers.filter((modifier) =>
    modifier.kind === kind
    && ((targetId && modifier.targetIds.includes(targetId)) || modifier.targetPlayer === resolvedPlayer)
  );
}

export function modifierTotal(
  state: GameState,
  targetId: string | null,
  targetPlayer: PlayerId | null,
  kind: ModifierKind,
  continuation?: EffectContinuation,
): number {
  const resolvedPlayer = targetPlayer ?? (targetId ? locateCard(state, targetId)?.player ?? null : null);
  const runtime = liveRuntimeModifiers(state, targetId, targetPlayer, kind).reduce((sum, modifier) => sum + (modifier.amount ?? 0), 0);
  const continuous = continuousEntries(state, targetId, resolvedPlayer, kind, continuation).reduce((sum, entry) => sum + entry.amount, 0);
  return runtime + continuous;
}

export function hasModifier(
  state: GameState,
  targetId: string | null,
  targetPlayer: PlayerId | null,
  kind: ModifierKind,
  text?: string,
  continuation?: EffectContinuation,
): boolean {
  const resolvedPlayer = targetPlayer ?? (targetId ? locateCard(state, targetId)?.player ?? null : null);
  const textMatches = (entryText: string | undefined) => {
    if (entryText === 'played-this-turn') {
      if (!targetId) return false;
      const location = locateCard(state, targetId);
      const unit = findUnit(state, targetId);
      if (!location || !unit || unit.enteredTurn !== state.players[location.player].turnCount) return false;
    }
    return !text || entryText === 'any' || entryText?.split(',').includes(text);
  };
  const runtime = liveRuntimeModifiers(state, targetId, targetPlayer, kind)
    .some((modifier) => textMatches(modifier.text));
  return runtime || continuousEntries(state, targetId, resolvedPlayer, kind, continuation)
    .some((entry) => textMatches(entry.text));
}

export type ModifierDurationLabel = 'permanent' | 'temporary' | 'while-in-play' | 'attack';

export interface CardModifierInfo {
  id: string;
  kind: ModifierKind;
  amount?: number;
  text?: string;
  sourceInstanceId: string;
  sourceName: string;
  sourceCardId?: string;
  duration: ModifierDurationLabel;
  origin: 'runtime' | 'continuous';
}

function modifierSourceName(state: GameState, sourceInstanceId: string): Pick<CardModifierInfo, 'sourceName' | 'sourceCardId'> {
  const location = locateCard(state, sourceInstanceId);
  const instance = location ? cardAt(state, location) : null;
  if (!instance) return { sourceName: 'Effect' };
  return { sourceName: getCard(instance.cardId).name, sourceCardId: instance.cardId };
}

function runtimeDuration(expires: RuntimeModifier['expires']): ModifierDurationLabel {
  if (!expires) return 'permanent';
  if ('attack' in expires) return 'attack';
  return 'temporary';
}

// Enumerates every buff/debuff currently affecting a single card — both the stored
// RuntimeModifiers and the continuous effects other in-play cards project onto it —
// so the UI can show which cards are modified and by which source.
export function describeCardModifiers(state: GameState, instanceId: string): CardModifierInfo[] {
  const result: CardModifierInfo[] = [];
  for (const modifier of state.modifiers) {
    if (!modifier.targetIds.includes(instanceId)) continue;
    result.push({
      id: modifier.id,
      kind: modifier.kind,
      amount: modifier.amount,
      text: modifier.text,
      sourceInstanceId: modifier.sourceInstanceId,
      ...modifierSourceName(state, modifier.sourceInstanceId),
      duration: runtimeDuration(modifier.expires),
      origin: 'runtime',
    });
  }
  const targetLocation = locateCard(state, instanceId);
  if (!targetLocation) return result;
  const previousState = currentStateForLookup;
  currentStateForLookup = state;
  const continuation: EffectContinuation = { actor: 0, sourceInstanceId: '', vars: {}, frames: [] };
  try {
    for (const sourceId of activeSources(state)) {
      const sourceLocation = locateCard(state, sourceId)!;
      const source = cardAt(state, sourceLocation)!;
      const context: ExecutionContext = { actor: sourceLocation.player, sourceId, continuation };
      for (const continuous of getEffectScript(source.cardId).continuous ?? []) {
        if (typeof continuous.target === 'string') continue;
        if (continuous.condition && !evaluateCondition(state, continuous.condition, context)) continue;
        if (!matchesSelector(state, targetLocation, continuous.target, context)) continue;
        result.push({
          id: sourceId + ':' + continuous.id,
          kind: continuous.kind,
          amount: continuous.amount ? evaluateValue(state, continuous.amount, context) : undefined,
          text: continuous.text,
          sourceInstanceId: sourceId,
          sourceName: getCard(source.cardId).name,
          sourceCardId: source.cardId,
          duration: 'while-in-play',
          origin: 'continuous',
        });
      }
    }
  } finally {
    currentStateForLookup = previousState;
  }
  return result;
}

function evaluateValue(state: GameState, expression: ValueExpression, context: ExecutionContext): number {
  if (typeof expression === 'number') return expression;
  if ('value' in expression) {
    const attack = context.continuation.attack;
    if (expression.value === 'dr') return attack?.dr ?? Number(context.continuation.vars.dr ?? 0);
    if (expression.value === 'surplus') return attack?.surplus ?? 0;
    if (expression.value === 'x-cost') return attack?.xCost ?? 0;
    if (expression.value === 'attack-damage') return attack?.damage ?? 0;
    if (expression.value === 'condition-amount') {
      const boundId = Object.values(context.continuation.vars).reverse().find((value): value is string[] => Array.isArray(value))?.[0];
      return boundId ? findUnit(state, boundId)?.conditions.find(({ amount }) => amount !== undefined)?.amount ?? 0 : 0;
    }
    return context.event?.amount ?? 0;
  }
  if ('count' in expression) return selectCards(state, expression.count, context).length;
  if ('countEvents' in expression) {
    const controller = controllerFor(expression.countEvents.controller, context);
    const sourceController = controllerFor(expression.countEvents.sourceController, context);
    return state.turnEvents.filter((event) =>
      event.name === expression.countEvents.event
      && (controller === null || event.controller === controller)
      && (sourceController === null || event.sourceController === sourceController)
    ).length;
  }
  if ('add' in expression) return expression.add.reduce<number>((sum, item) => sum + evaluateValue(state, item, context), 0);
  return expression.multiply.reduce<number>((product, item) => product * evaluateValue(state, item, context), 1);
}

function evaluateCondition(state: GameState, condition: ConditionExpression, context: ExecutionContext): boolean {
  if ('all' in condition) return condition.all.every((item) => evaluateCondition(state, item, context));
  if ('any' in condition) return condition.any.some((item) => evaluateCondition(state, item, context));
  if ('not' in condition) return !evaluateCondition(state, condition.not, context);
  if ('exists' in condition) return selectCards(state, condition.exists, context).length >= (condition.atLeast ?? 1);
  if ('matches' in condition) {
    return idsFromRef(context, condition.matches.ref).some((id) => {
      const location = locateCard(state, id);
      return location ? matchesSelector(state, location, condition.matches.selector, context) : false;
    });
  }
  if ('compare' in condition) {
    const left = evaluateValue(state, condition.compare.left, context);
    const right = evaluateValue(state, condition.compare.right, context);
    const comparisons = {
      eq: left === right, ne: left !== right, lt: left < right, lte: left <= right,
      gt: left > right, gte: left >= right,
    };
    return comparisons[condition.compare.op];
  }
  if ('parity' in condition) return Math.abs(evaluateValue(state, condition.parity.value, context)) % 2 === (condition.parity.is === 'even' ? 0 : 1);
  if ('hasCondition' in condition) {
    return idsFromRef(context, condition.hasCondition.ref).some((id) => {
      const unit = findUnit(state, id);
      return condition.hasCondition.condition === 'any'
        ? Boolean(unit?.conditions.length)
        : Boolean(unit?.conditions.some(({ name }) => name === condition.hasCondition.condition));
    });
  }
  if ('event' in condition) {
    if (condition.event === 'attack-damage' || condition.event === 'effect-damage') {
      return context.event?.damageType === condition.event.replace('-damage', '');
    }
    return context.event?.name === condition.event;
  }
  if ('eventCausedBy' in condition) return idsFromRef(context, condition.eventCausedBy).includes(context.event?.sourceId ?? '');
  if ('eventTarget' in condition) return idsFromRef(context, condition.eventTarget).includes(context.event?.targetId ?? '');
  if ('eventCritical' in condition) return Boolean(context.event?.critical) === condition.eventCritical;
  if ('eventController' in condition) {
    return context.event?.controller === controllerFor(condition.eventController, context);
  }
  if ('eventSourceController' in condition) {
    const sourceController = context.event?.sourceId ? locateCard(state, context.event.sourceId)?.player : undefined;
    return sourceController === controllerFor(condition.eventSourceController, context);
  }
  if ('activePlayer' in condition) return state.activePlayer === controllerFor(condition.activePlayer, context);
  const player = controllerFor(condition.hasOpenSlot.controller, context) ?? context.actor;
  const open = condition.hasOpenSlot.rows.reduce(
    (count, row) => count + state.players[player][row].filter((unit) => unit === null).length,
    0,
  );
  return open >= (condition.hasOpenSlot.atLeast ?? 1);
}

function effectSource(state: GameState, context: ExecutionContext) {
  return findLogSubject(state, context.sourceId) ?? rulesLogSubject();
}

function attackRollContext(attack: AttackRuntime): NonNullable<import('./types').RollResult['combat']> {
  return attack.combat;
}

function recordRoll(
  state: GameState,
  rolls: readonly DieRollResult[],
  damage: number,
  summary: string,
  combat?: NonNullable<import('./types').RollResult['combat']>,
) {
  state.lastRoll = {
    sequence: ++state.rollSequence,
    rolls,
    damage,
    summary,
    combat,
  };
}

function resolvedAttackRolls(attack: AttackRuntime): DieRollResult[] {
  const rolls: DieRollResult[] = [];
  if (attack.effectDieSides > 0 && attack.dr > 0) {
    rolls.push({ kind: 'effect', sides: attack.effectDieSides, value: attack.dr, outcome: 'effect-value' });
  }
  if (attack.criticalRoll > 0) {
    const outcome = attack.isFailed
      ? 'attack-failed'
      : attack.isCritical
        ? 'critical-hit'
        : attack.criticalRoll === 20
          ? 'critical-prevented'
          : 'attack-normal';
    rolls.push({ kind: 'critical', sides: 20, value: attack.criticalRoll, outcome });
  }
  if (attack.defenseRoll !== undefined) {
    const outcome = attack.defenseRoll <= 5
      ? 'critical-defense'
      : attack.defenseRoll >= 95
        ? 'critical-defense-failure'
        : attack.defenseRoll <= (attack.defenseTarget ?? 0)
          ? 'defense-success'
          : 'defense-failure';
    rolls.push({ kind: 'defense', sides: 100, value: attack.defenseRoll, target: attack.defenseTarget, outcome });
  }
  return rolls;
}

function pushFrame(
  continuation: EffectContinuation,
  effects: readonly RuntimeOperation[],
  context: Pick<ExecutionContext, 'actor' | 'sourceId' | 'event'>,
  skipIfAttackFailed = false,
) {
  if (!effects.length) return;
  continuation.frames.push({
    effects: [...effects],
    index: 0,
    actor: context.actor,
    sourceId: context.sourceId,
    event: context.event,
    skipIfAttackFailed,
  });
}

function removeCardAt(state: GameState, location: ResolvedCardLocation): CardInstance | UnitInPlay | null {
  const player = state.players[location.player];
  if (location.zone === 'vanguard' || location.zone === 'backguard') {
    const unit = player[location.zone][location.index];
    player[location.zone][location.index] = null;
    return unit;
  }
  return player[location.zone].splice(location.index, 1)[0] ?? null;
}

function slotOptions(state: GameState, controller: PlayerId, rows: readonly ('vanguard' | 'backguard')[]): ChoiceOption[] {
  return rows.flatMap((row) => state.players[controller][row].flatMap((unit, index) =>
    unit ? [] : [{ id: 'slot:' + controller + ':' + row + ':' + index, label: (row === 'vanguard' ? 'Vanguard ' : 'Backguard ') + (index + 1) }],
  ));
}

function cardOptions(state: GameState, ids: readonly string[]): ChoiceOption[] {
  return ids.map((id) => {
    const location = locateCard(state, id)!;
    const instance = cardAt(state, location)!;
    const definition = getCard(instance.cardId);
    const details = definition.kind === 'unit' ? definition.hp + ' HP / ' + definition.defense + ' DEF' : definition.utilityType;
    return { id, label: definition.name + ' · ' + details, cardId: definition.id };
  });
}

function expirationFor(
  state: GameState,
  duration: ModifierDuration,
  actor: PlayerId,
  attack?: AttackRuntime,
): RuntimeModifier['expires'] {
  if (duration === 'permanent') return null;
  if (duration === 'attack') return { attack: attack?.sequence ?? state.actionSequence };
  if (duration === 'turn') return { player: actor, turn: state.players[actor].turnCount, phase: 'end' };
  if (duration === 'active-turn') {
    const player = state.activePlayer;
    return { player, turn: state.players[player].turnCount, phase: 'end' };
  }
  const player = duration === 'opponent-next-turn' ? otherPlayer(actor) : actor;
  return { player, turn: state.players[player].turnCount + 1, phase: 'end' };
}

function controllerRef(value: string): value is ControllerRef {
  return ['actor', 'opponent', 'source-controller', 'event-controller', 'event-opponent'].includes(value);
}

function targetIds(state: GameState, target: string | CardSelector, context: ExecutionContext): string[] {
  const ids = typeof target === 'string' ? idsFromRef(context, target) : selectCards(state, target, context);
  return ids.filter((id) => {
    const location = locateCard(state, id);
    const instance = location ? cardAt(state, location) : null;
    return location?.zone !== 'vanquished' || !instance?.isFaceDown;
  });
}

function effectiveCost(
  state: GameState,
  cardId: string,
  playerId: PlayerId,
  purpose: 'play' | 'utility',
  continuation?: EffectContinuation,
) {
  const printed = [...getCard(cardId).cost];
  const kind: ModifierKind = purpose === 'utility' ? 'utility-cost' : 'play-cost';
  const heldId = state.players[playerId].hand.find((card) => card.cardId === cardId)?.instanceId ?? null;
  const reduction = Math.max(0, -modifierTotal(state, heldId, playerId, kind, continuation));
  for (let count = 0; count < reduction; count += 1) {
    const any = printed.indexOf('any');
    if (any >= 0) printed.splice(any, 1);
  }
  return printed;
}

export function paymentForCost(
  state: GameState,
  playerId: PlayerId,
  cost: readonly import('./types').CostType[],
): string[] | null {
  const available = state.players[playerId].energies.filter(({ isTapped }) => !isTapped);
  const selected: typeof available = [];
  for (const required of cost.filter((item) => item !== 'any')) {
    const match = available.find((energy) => energy.energyType === required && !selected.includes(energy));
    if (!match) return null;
    selected.push(match);
  }
  for (const _ of cost.filter((item) => item === 'any')) {
    const match = available.find((energy) => !selected.includes(energy));
    if (!match) return null;
    selected.push(match);
  }
  return selected.map(({ instanceId }) => instanceId);
}

export function payCardCost(
  state: GameState,
  playerId: PlayerId,
  cardId: string,
  purpose: 'play' | 'utility',
  continuation?: EffectContinuation,
): boolean {
  const payment = paymentForCost(state, playerId, effectiveCost(state, cardId, playerId, purpose, continuation));
  if (!payment) return false;
  state.players[playerId].energies.forEach((energy) => {
    if (payment.includes(energy.instanceId)) energy.isTapped = true;
  });
  return true;
}

function shuffle<T>(items: T[], random: () => number) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const target = randomInteger(random, index + 1);
    [items[index], items[target]] = [items[target], items[index]];
  }
}

function enqueuePlayedEvent(continuation: EffectContinuation, actor: PlayerId, sourceId: string) {
  pushFrame(continuation, [{ internal: 'dispatch', event: { name: 'played', sourceId, targetId: sourceId, controller: actor } }], { actor, sourceId });
}

function moveCards(
  state: GameState,
  operation: Extract<EffectOperation, { op: 'move' }>,
  context: ExecutionContext,
) {
  const ids = targetIds(state, operation.cards, context);
  const slots = operation.slots ? idsFromRef(context, operation.slots) : [];
  const affectedControllers = new Set<PlayerId>();
  const removed = ids.flatMap((id) => {
    const location = locateCard(state, id);
    if (!location) return [];
    if (location.zone === 'vanguard' || location.zone === 'backguard') affectedControllers.add(location.player);
    const card = removeCardAt(state, location);
    return card ? [{ card, owner: card.owner ?? location.player }] : [];
  });
  if (operation.to === 'bottom-deck' || operation.to === 'top-deck') {
    const explicit = controllerFor(operation.controller, context);
    for (const item of removed) {
      const owner = explicit ?? item.owner;
      if (operation.to === 'bottom-deck') state.players[owner].deck.push({ instanceId: item.card.instanceId, cardId: item.card.cardId, owner: item.owner });
    }
    if (operation.to === 'top-deck') {
      for (let index = removed.length - 1; index >= 0; index -= 1) {
        const item = removed[index];
        const owner = explicit ?? item.owner;
        state.players[owner].deck.unshift({ instanceId: item.card.instanceId, cardId: item.card.cardId, owner: item.owner });
      }
    }
  } else if (operation.to === 'hand-owner') {
    removed.forEach(({ card, owner }) => state.players[owner].hand.push({ instanceId: card.instanceId, cardId: card.cardId, owner }));
  } else if (operation.to === 'vanguard' || operation.to === 'backguard') {
    removed.forEach(({ card, owner }, index) => {
      const encoded = slots[index];
      const parts = encoded?.split(':') ?? [];
      const player = parts[1] === undefined ? context.actor : Number(parts[1]) as PlayerId;
      const row: 'vanguard' | 'backguard' = parts[2] === 'backguard' ? 'backguard' : parts[2] === 'vanguard' ? 'vanguard' : operation.to === 'backguard' ? 'backguard' : 'vanguard';
      const requested = parts[3] === undefined ? -1 : Number(parts[3]);
      const open = requested >= 0 && !state.players[player][row][requested]
        ? requested
        : state.players[player][row].findIndex((unit) => unit === null);
      if (open < 0) {
        state.players[player].hand.push({ instanceId: card.instanceId, cardId: card.cardId, owner });
        return;
      }
      const definition = getCard(card.cardId);
      state.players[player][row][open] = {
        instanceId: card.instanceId,
        cardId: card.cardId,
        owner,
        currentHp: definition.hp,
        isReady: operation.ready ?? true,
        enteredTurn: state.players[player].turnCount,
        conditions: [],
      };
      enqueuePlayedEvent(context.continuation, player, card.instanceId);
    });
  } else {
    const destination = controllerFor(operation.controller, context) ?? context.actor;
    removed.forEach(({ card, owner }) => {
      if (operation.to === 'vanquished') {
        state.players[destination].vanquished.push({
          instanceId: card.instanceId,
          cardId: card.cardId,
          owner,
          isFaceDown: operation.faceDown || undefined,
        });
      }
      if (operation.to === 'utilities') state.players[destination].utilities.push({ instanceId: card.instanceId, cardId: card.cardId, owner });
      if (operation.to === 'energies') {
        const definition = getCard(card.cardId);
        state.players[destination].energies.push({
          instanceId: card.instanceId,
          cardId: card.cardId,
          owner,
          energyType: definition.energyType!,
          isTapped: operation.ready === false,
        });
      }
      if (operation.to === 'hand') state.players[destination].hand.push({ instanceId: card.instanceId, cardId: card.cardId, owner });
      if (operation.to === 'deck') state.players[destination].deck.push({ instanceId: card.instanceId, cardId: card.cardId, owner });
    });
  }
  affectedControllers.forEach((playerId) => enforceVanguard(state, playerId));
}

function enforceVanguard(state: GameState, playerId: PlayerId) {
  const player = state.players[playerId];
  if (player.vanguard.some(Boolean)) return;
  const back = player.backguard.findIndex(Boolean);
  if (back < 0) return;
  const front = player.vanguard.findIndex((unit) => unit === null);
  const unit = player.backguard[back]!;
  player.backguard[back] = null;
  player.vanguard[front] = unit;
  appendGameLog(state, {
    kind: 'movement',
    message: getCard(unit.cardId).name + ' moved forward to fill the empty Vanguard.',
    source: cardLogSubject(unit, playerId),
    target: cardLogSubject(unit, playerId),
    action: 'Advance → Vanguard',
  });
}

function queueVanquish(
  state: GameState,
  continuation: EffectContinuation,
  context: ExecutionContext,
  targetId: string,
  damageType?: EffectEvent['damageType'],
  critical = false,
  faceDown = false,
  surplus = 0,
) {
  const event: EffectEvent = {
    name: 'would-vanquish',
    sourceId: context.sourceId,
    targetId,
    controller: locateCard(state, targetId)?.player ?? context.actor,
    damageType,
    critical,
  };
  pushFrame(
    continuation,
    [
      { internal: 'dispatch', event },
      { internal: 'finalize-vanquish', targetId, causeId: context.sourceId, damageType, critical, faceDown, surplus },
    ],
    context,
  );
}

function finalizeVanquish(
  state: GameState,
  continuation: EffectContinuation,
  operation: Extract<InternalOperation, { internal: 'finalize-vanquish' }>,
  context: ExecutionContext,
) {
  const preventedKey = 'prevented:' + operation.targetId;
  if (continuation.vars[preventedKey]) {
    delete continuation.vars[preventedKey];
    return;
  }
  const location = locateCard(state, operation.targetId);
  if (!location) return;
  const instance = cardAt(state, location)!;
  const definition = getCard(instance.cardId);
  const targetSubject = operation.faceDown
    ? rulesLogSubject('Face-down card')
    : cardLogSubject(instance, location.player);
  const sourceSubject = operation.faceDown && operation.causeId === operation.targetId
    ? rulesLogSubject()
    : findLogSubject(state, operation.causeId) ?? rulesLogSubject();
  const attachedUnitId = location.zone === 'utilities' ? state.players[location.player].utilities[location.index].attachedTo : undefined;
  const previouslyAttachedUnit = attachedUnitId ? findUnit(state, attachedUnitId) : null;
  const previousMaximum = previouslyAttachedUnit
    ? getCard(previouslyAttachedUnit.cardId).hp + modifierTotal(state, attachedUnitId!, null, 'max-hp', continuation)
    : 0;
  if (definition.kind === 'unit') {
    const attachments = state.players[location.player].utilities
      .filter(({ attachedTo }) => attachedTo === operation.targetId)
      .map(({ instanceId }) => instanceId);
    attachments.forEach((id) => {
      const equipmentLocation = locateCard(state, id);
      if (!equipmentLocation) return;
      const equipment = removeCardAt(state, equipmentLocation)!;
      const owner = equipment.owner ?? equipmentLocation.player;
      state.players[owner].vanquished.push({ instanceId: equipment.instanceId, cardId: equipment.cardId, owner });
    });
  }
  removeCardAt(state, location);
  if (attachedUnitId) {
    const attachedUnit = findUnit(state, attachedUnitId);
    if (attachedUnit) {
      const nextMaximum = getCard(attachedUnit.cardId).hp + modifierTotal(state, attachedUnitId, null, 'max-hp', continuation);
      attachedUnit.currentHp = Math.min(attachedUnit.currentHp, nextMaximum);
      if (previousMaximum < nextMaximum) attachedUnit.currentHp += nextMaximum - previousMaximum;
    }
  }
  const owner = instance.owner ?? location.player;
  state.players[owner].vanquished.push({
    instanceId: instance.instanceId,
    cardId: instance.cardId,
    owner,
    isFaceDown: operation.faceDown || undefined,
  });
  appendGameLog(state, {
    kind: 'vanquish',
    message: operation.faceDown ? 'A card was Vanquished face down.' : definition.name + ' was Vanquished.',
    source: sourceSubject,
    target: targetSubject,
    action: operation.damageType === 'attack' ? 'Attack Vanquish' : 'Vanquished',
  });
  // Surface the kill in the dice-result overlay when the fallen Unit is this roll's defender.
  if (state.lastRoll?.combat?.defender.instanceId === operation.targetId) {
    state.lastRoll.combat.defender.vanquished = true;
  }
  if (definition.kind === 'unit') enforceVanguard(state, location.player);
  // Energy still dispatches the vanquished event (e.g. Project Parabellum draws off it);
  // only the unit-specific surplus backlash below is gated to Units by its `surplus > 0` guard.
  if (definition.kind !== 'unit' && definition.kind !== 'energy') return;
  const surplus = Math.max(0, operation.surplus ?? 0);
  if (surplus > 0) {
    const isSuper = definition.unitTreatment === 'super';
    const backlash = isSuper ? surplus * 2 : surplus;
    const controllerId = location.player;
    const controller = state.players[controllerId];
    controller.hp = Math.max(0, controller.hp - backlash);
    appendGameLog(state, {
      kind: 'damage',
      message: controller.name + ' took ' + backlash + ' surplus Damage from ' + definition.name
        + (isSuper ? ' (doubled — SUPER Unit).' : '.'),
      source: sourceSubject,
      target: playerLogSubject(state, controllerId),
      action: isSuper ? 'Surplus Damage (SUPER)' : 'Surplus Damage',
      amount: backlash,
    });
    if (controller.hp === 0) state.winner = controllerId === 0 ? 1 : 0;
  }
  const event: EffectEvent = {
    name: 'unit-vanquished',
    sourceId: operation.causeId,
    targetId: operation.targetId,
    controller: location.player,
    damageType: operation.damageType,
    critical: operation.critical,
  };
  pushFrame(continuation, [{ internal: 'dispatch', event }], context);
}

function applyDamage(
  state: GameState,
  continuation: EffectContinuation,
  ids: readonly string[],
  amount: number,
  context: ExecutionContext,
  damageType: EffectEvent['damageType'],
) {
  for (const id of ids) {
    const unit = findUnit(state, id);
    if (!unit) continue;
    const location = locateCard(state, id);
    unit.currentHp -= Math.max(0, amount);
    appendGameLog(state, {
      kind: 'damage',
      message: getCard(unit.cardId).name + ' took ' + Math.max(0, amount)
        + (damageType === 'attack' ? ' Attack Damage.' : damageType === 'condition' ? ' Condition Damage.' : ' Effect Damage.'),
      source: effectSource(state, context),
      target: cardLogSubject(unit, location?.player),
      action: damageType === 'attack' ? 'Attack Damage' : damageType === 'condition' ? 'Condition Damage' : 'Effect Damage',
      amount: Math.max(0, amount),
    });
    if (unit.currentHp <= 0) {
      queueVanquish(
        state,
        continuation,
        context,
        id,
        damageType,
        damageType === 'attack' && Boolean(continuation.attack?.isCritical),
        false,
        -unit.currentHp,
      );
    }
  }
}

function applyCondition(
  state: GameState,
  id: string,
  name: import('./effectTypes').ConditionName,
  amount: number | undefined,
  context: ExecutionContext,
) {
  const unit = findUnit(state, id);
  const location = locateCard(state, id);
  if (!unit || !location) return;
  if (hasModifier(state, id, null, 'condition-immunity', name, context.continuation)
    || hasModifier(state, id, null, 'cannot-afflict-condition', name, context.continuation)) return;
  const tranquil = unit.conditions.findIndex((condition) => condition.name === 'tranquil');
  if (name !== 'tranquil' && tranquil >= 0) {
    unit.conditions.splice(tranquil, 1);
    appendGameLog(state, {
      kind: 'condition',
      message: getCard(unit.cardId).name + "'s Tranquil prevented " + name + '.',
      source: cardLogSubject(unit, location.player),
      target: cardLogSubject(unit, location.player),
      action: 'Tranquil prevented ' + name,
    });
    return;
  }
  const existing = unit.conditions.find((condition) => condition.name === name);
  const controllerTurns = 0;
  if (existing) {
    existing.amount = amount;
    existing.appliedTurn = state.players[location.player].turnCount;
    existing.controllerTurns = controllerTurns;
  } else {
    unit.conditions.push({ name, amount, appliedTurn: state.players[location.player].turnCount, controllerTurns });
  }
  appendGameLog(state, {
    kind: 'condition',
    message: getCard(unit.cardId).name + ' became ' + name + (amount === undefined ? '.' : ' ' + amount + '.'),
    source: effectSource(state, context),
    target: cardLogSubject(unit, location.player),
    action: name + (amount === undefined ? '' : ' ' + amount),
    amount,
  });
  pushFrame(context.continuation, [{ internal: 'dispatch', event: {
    name: 'condition-afflicted', sourceId: context.sourceId, targetId: id, controller: location.player,
  } }], context);
}

function rotateUnit(state: GameState, id: string, exhaust: boolean, context: ExecutionContext) {
  const location = locateCard(state, id);
  if (!location || (location.zone !== 'vanguard' && location.zone !== 'backguard')) return;
  const ignores = hasModifier(state, id, null, 'ignore-rotation-prevention', undefined, context.continuation);
  const playedLock = hasModifier(state, id, null, 'cannot-rotate', 'played-this-turn', context.continuation);
  const genericLock = hasModifier(state, id, null, 'cannot-rotate', undefined, context.continuation);
  if (!ignores && (genericLock || playedLock)) return;
  const destination = location.zone === 'vanguard' ? 'backguard' : 'vanguard';
  const open = state.players[location.player][destination].findIndex((unit) => unit === null);
  if (open < 0) return;
  const unit = state.players[location.player][location.zone][location.index]!;
  state.players[location.player][location.zone][location.index] = null;
  if (exhaust) unit.isReady = false;
  state.players[location.player][destination][open] = unit;
  appendGameLog(state, {
    kind: 'movement',
    message: getCard(unit.cardId).name + ' Rotated to the ' + destination + (exhaust ? ' and became Exhausted.' : '.'),
    source: effectSource(state, context),
    target: cardLogSubject(unit, location.player),
    action: 'Rotate → ' + (destination === 'vanguard' ? 'Vanguard' : 'Backguard'),
  });
  enforceVanguard(state, location.player);
  const event: EffectEvent = { name: 'unit-rotated', sourceId: context.sourceId, targetId: id, controller: location.player };
  pushFrame(context.continuation, [{ internal: 'dispatch', event }], context);
}

function triggerSources(state: GameState, event: EffectEvent): string[] {
  const sources = activeSources(state);
  if (event.targetId && !sources.includes(event.targetId)) sources.push(event.targetId);
  for (const location of allLocations(state)) {
    const instance = cardAt(state, location)!;
    const listensFromZone = (getEffectScript(instance.cardId).triggers ?? []).some((trigger) => {
      if (!trigger.sourceZone) return false;
      const zones = Array.isArray(trigger.sourceZone) ? trigger.sourceZone : [trigger.sourceZone];
      return zones.includes(location.zone);
    });
    if (listensFromZone && !sources.includes(instance.instanceId)) sources.push(instance.instanceId);
  }
  return sources;
}

function matchingReactions(
  state: GameState,
  event: EffectEvent,
  continuation: EffectContinuation,
): Array<{ player: PlayerId; instance: CardInstance }> {
  const matches: Array<{ player: PlayerId; instance: CardInstance }> = [];
  for (const player of [0, 1] as const) {
    for (const instance of state.players[player].hand) {
      const definition = getCard(instance.cardId);
      if (definition.kind !== 'utility') continue;
      const reaction = getEffectScript(instance.cardId).utility?.reaction;
      if (!reaction || reaction.event !== event.name) continue;
      const context: ExecutionContext = { actor: player, sourceId: instance.instanceId, event, continuation };
      if (reaction.condition && !evaluateCondition(state, reaction.condition, context)) continue;
      if (!paymentForCost(state, player, effectiveCost(state, instance.cardId, player, 'utility', continuation))) continue;
      matches.push({ player, instance });
    }
  }
  return matches;
}

function eventCardName(state: GameState, id: string | undefined): string | null {
  if (!id) return null;
  const location = locateCard(state, id);
  if (!location) return null;
  const instance = cardAt(state, location);
  return instance ? getCard(instance.cardId).name : null;
}

// A human-readable sentence describing what opened a reaction window, from the
// reacting player's perspective (player 0). Keeps the confusing generic prompt
// only as a last resort.
function describeReactionEvent(state: GameState, event: EffectEvent, reactingPlayer: PlayerId): string {
  const belonging = (id: string | undefined) => {
    const location = id ? locateCard(state, id) : null;
    if (!location) return '';
    return location.player === reactingPlayer ? 'your ' : "the opponent's ";
  };
  const source = eventCardName(state, event.sourceId);
  const target = eventCardName(state, event.targetId);
  const damage = event.amount ? ` for ${event.amount} Damage` : '';
  const critical = event.critical ? ' (Critical Hit)' : '';
  switch (event.name) {
    case 'attack-targeted':
    case 'attack-declared':
      return `${source ?? 'A Unit'} is attacking ${belonging(event.targetId)}${target ?? 'a Unit'}${damage}${critical}.`;
    case 'would-vanquish':
      return `${belonging(event.targetId)}${target ?? source ?? 'a Unit'} is about to be Vanquished${damage}.`;
    case 'unit-vanquished':
      return `${belonging(event.targetId)}${target ?? source ?? 'A Unit'} was Vanquished.`;
    case 'condition-afflicted':
      return `${belonging(event.targetId)}${target ?? 'a Unit'} is being afflicted with a Condition.`;
    case 'unit-rotated':
      return `${belonging(event.sourceId)}${source ?? 'A Unit'} was Rotated.`;
    case 'critical-defense':
      return `${belonging(event.sourceId)}${source ?? 'A Unit'} scored a Critical Defense.`;
    case 'played':
      return `${belonging(event.sourceId)}${source ?? 'A card'} was played.`;
    case 'construction-advanced':
    case 'construction-done':
      return `${belonging(event.sourceId)}${source ?? 'a Construction'} advanced.`;
    default:
      return 'A reaction window is open.';
  }
}

function dispatchEvent(
  state: GameState,
  event: EffectEvent,
  continuation: EffectContinuation,
) {
  state.turnEvents.push({
    ...event,
    sourceController: event.sourceId ? locateCard(state, event.sourceId)?.player : undefined,
  });
  for (const sourceId of triggerSources(state, event)) {
    const location = locateCard(state, sourceId);
    if (!location) continue;
    const instance = cardAt(state, location);
    if (!instance) continue;
    const script = getEffectScript(instance.cardId);
    const context: ExecutionContext = { actor: location.player, sourceId, event, continuation };
    for (const trigger of script.triggers ?? []) {
      if (trigger.event !== event.name) continue;
      if (trigger.sourceZone) {
        const zones = Array.isArray(trigger.sourceZone) ? trigger.sourceZone : [trigger.sourceZone];
        if (!zones.includes(location.zone)) continue;
      }
      const actionKey = `${sourceId}:${trigger.id}`;
      if (trigger.once === 'turn' && state.usedActions[actionKey] === state.players[location.player].turnCount) continue;
      if (trigger.condition && !evaluateCondition(state, trigger.condition, context)) continue;
      if (trigger.once === 'turn') state.usedActions[actionKey] = state.players[location.player].turnCount;
      pushFrame(continuation, trigger.effects, context);
    }
  }
  const reactions = matchingReactions(state, event, continuation);
  if (!reactions.length) return;
  const human = reactions.filter(({ player }) => player === 0);
  const reactingPlayer = human.length ? 0 : reactions[0].player;
  const available = reactions.filter(({ player }) => player === reactingPlayer);
  const options: ChoiceOption[] = [
    { id: 'pass', label: 'Pass priority' },
    ...available.map(({ instance }) => ({ id: instance.instanceId, label: 'Play ' + getCard(instance.cardId).name, cardId: instance.cardId })),
  ];
  state.pendingChoice = {
    id: 'choice-' + (++state.actionSequence),
    player: reactingPlayer,
    prompt: describeReactionEvent(state, event, reactingPlayer),
    min: 1,
    max: 1,
    ordered: false,
    options,
    store: '__reaction',
    event,
    continuation,
  };
}

function playReaction(
  state: GameState,
  continuation: EffectContinuation,
  player: PlayerId,
  instanceId: string,
  event?: EffectEvent,
) {
  const index = state.players[player].hand.findIndex((card) => card.instanceId === instanceId);
  if (index < 0) return;
  const instance = state.players[player].hand[index];
  if (!payCardCost(state, player, instance.cardId, 'utility', continuation)) return;
  state.players[player].hand.splice(index, 1);
  state.players[player].vanquished.push(instance);
  const script = getEffectScript(instance.cardId);
  pushFrame(continuation, script.utility?.effects ?? [], { actor: player, sourceId: instanceId, event });
  appendGameLog(state, {
    kind: 'reaction',
    message: state.players[player].name + ' played ' + getCard(instance.cardId).name + ' as a reaction.',
    source: cardLogSubject(instance, player),
    target: findLogSubject(state, event?.targetId) ?? playerLogSubject(state, event?.controller ?? player),
    action: 'Free Effect reaction',
  });
}

function offerEffectDieActions(state: GameState, continuation: EffectContinuation) {
  const attack = continuation.attack;
  if (!attack) return;
  const location = locateCard(state, attack.attackerId);
  if (!location) return;
  const player = location.player;
  const actions = activeSources(state).flatMap((sourceId) => {
    const sourceLocation = locateCard(state, sourceId)!;
    if (sourceLocation.player !== player) return [];
    const instance = cardAt(state, sourceLocation)!;
    return (getEffectScript(instance.cardId).activated ?? []).flatMap((ability) => {
      const key = sourceId + ':' + ability.id;
      if (ability.timing !== 'effect-die' || state.usedActions[key] === state.players[player].turnCount) return [];
      return [{ sourceId, ability }];
    });
  });
  if (!actions.length) return;
  state.pendingChoice = {
    id: 'choice-' + (++state.actionSequence),
    player,
    prompt: 'Effect die: ' + attack.dr + '. Use a die ability?',
    min: 1,
    max: 1,
    ordered: false,
    options: [
      { id: 'pass', label: 'Keep ' + attack.dr },
      ...actions.map(({ sourceId, ability }) => ({ id: sourceId + '::' + ability.id, label: ability.name })),
    ],
    store: '__die_action',
    continuation,
  };
}

function addModifier(
  state: GameState,
  operation: Extract<EffectOperation, { op: 'modifier' }>,
  context: ExecutionContext,
) {
  let ids: string[] = [];
  let player: PlayerId | undefined;
  if (typeof operation.target === 'string' && controllerRef(operation.target)) player = controllerFor(operation.target, context) ?? undefined;
  else ids = targetIds(state, operation.target as string | CardSelector, context);
  state.modifiers.push({
    id: 'modifier-' + (++state.actionSequence),
    sourceInstanceId: context.sourceId,
    targetIds: ids,
    targetPlayer: player,
    kind: operation.kind,
    amount: operation.amount ? evaluateValue(state, operation.amount, context) : undefined,
    text: operation.text,
    expires: expirationFor(state, operation.duration, context.actor, context.continuation.attack),
  });
}

function executeOperation(
  state: GameState,
  operation: EffectOperation,
  context: ExecutionContext,
  random: () => number,
) {
  const continuation = context.continuation;
  switch (operation.op) {
    case 'choose': {
      const candidates = selectCards(state, operation.selector, context).filter((id) => {
        if (!hasModifier(state, id, null, 'cannot-target-by-opponent', undefined, continuation)) return true;
        return locateCard(state, id)?.player === context.actor;
      });
      const min = Math.min(operation.min ?? 1, candidates.length);
      const max = Math.min(operation.max ?? 1, candidates.length);
      state.pendingChoice = {
        id: 'choice-' + (++state.actionSequence),
        player: context.actor,
        prompt: operation.prompt,
        min,
        max,
        ordered: operation.ordered ?? false,
        options: cardOptions(state, candidates),
        store: operation.store,
        continuation,
      };
      return;
    }
    case 'choose-slots': {
      const controller = controllerFor(operation.controller, context) ?? context.actor;
      const options = slotOptions(state, controller, operation.rows);
      const linkedCount = operation.countFrom ? idsFromRef(context, operation.countFrom).length : undefined;
      const min = Math.min(linkedCount ?? operation.min ?? 1, options.length);
      const max = Math.min(linkedCount ?? operation.max ?? 1, options.length);
      state.pendingChoice = {
        id: 'choice-' + (++state.actionSequence),
        player: context.actor,
        prompt: operation.prompt,
        min,
        max,
        ordered: false,
        options,
        store: operation.store,
        continuation,
      };
      return;
    }
    case 'move':
      moveCards(state, operation, context);
      return;
    case 'draw': {
      const player = controllerFor(operation.player, context) ?? context.actor;
      const count = evaluateValue(state, operation.count, context);
      let drawn = 0;
      for (let index = 0; index < count; index += 1) {
        const card = state.players[player].deck.shift();
        if (!card) {
          state.winner = otherPlayer(player);
          appendGameLog(state, {
            kind: 'victory',
            message: state.players[player].name + ' decked out.',
            source: effectSource(state, context),
            target: playerLogSubject(state, player),
            action: 'Deck depleted',
          });
          break;
        }
        state.players[player].hand.push(card);
        drawn += 1;
      }
      if (drawn > 0) appendGameLog(state, {
        kind: 'effect',
        message: state.players[player].name + ' drew ' + drawn + ' card' + (drawn === 1 ? '.' : 's.'),
        source: effectSource(state, context),
        target: playerLogSubject(state, player),
        action: 'Draw ' + drawn,
        amount: drawn,
      });
      return;
    }
    case 'damage':
      applyDamage(
        state,
        continuation,
        targetIds(state, operation.target, context),
        evaluateValue(state, operation.amount, context),
        context,
        operation.damageType === 'condition' ? 'condition' : 'effect',
      );
      return;
    case 'heal':
      for (const id of targetIds(state, operation.target, context)) {
        const unit = findUnit(state, id);
        if (!unit) continue;
        const location = locateCard(state, id);
        const maximum = getCard(unit.cardId).hp + modifierTotal(state, id, null, 'max-hp', continuation);
        const previousHp = unit.currentHp;
        unit.currentHp = Math.min(maximum, unit.currentHp + evaluateValue(state, operation.amount, context));
        const restored = unit.currentHp - previousHp;
        appendGameLog(state, {
          kind: 'effect',
          message: getCard(unit.cardId).name + ' recovered ' + restored + ' HP.',
          source: effectSource(state, context),
          target: cardLogSubject(unit, location?.player),
          action: 'Heal ' + restored + ' HP',
          amount: restored,
        });
      }
      return;
    case 'ready':
      targetIds(state, operation.target, context).forEach((id) => {
        if (hasModifier(state, id, null, 'cannot-ready', undefined, continuation)) return;
        const location = locateCard(state, id);
        if (location?.zone === 'energies') {
          state.players[location.player].energies[location.index].isTapped = false;
          return;
        }
        const unit = findUnit(state, id);
        if (unit) {
          unit.isReady = true;
          appendGameLog(state, {
            kind: 'effect',
            message: getCard(unit.cardId).name + ' became Ready.',
            source: effectSource(state, context),
            target: cardLogSubject(unit, location?.player),
            action: 'Ready',
          });
        }
      });
      return;
    case 'exhaust':
      targetIds(state, operation.target, context).forEach((id) => {
        const location = locateCard(state, id);
        if (location?.zone === 'energies') {
          state.players[location.player].energies[location.index].isTapped = true;
          return;
        }
        const unit = findUnit(state, id);
        if (unit) {
          unit.isReady = false;
          appendGameLog(state, {
            kind: 'effect',
            message: getCard(unit.cardId).name + ' became Exhausted.',
            source: effectSource(state, context),
            target: cardLogSubject(unit, location?.player),
            action: 'Exhaust',
          });
        }
      });
      return;
    case 'rotate':
      targetIds(state, operation.target, context).forEach((id) => rotateUnit(state, id, operation.exhaust !== false, context));
      return;
    case 'vanquish':
      targetIds(state, operation.target, context).forEach((id) =>
        queueVanquish(state, continuation, context, id, undefined, false, operation.faceDown));
      return;
    case 'condition':
      targetIds(state, operation.target, context).forEach((id) =>
        applyCondition(state, id, operation.condition, operation.amount ? evaluateValue(state, operation.amount, context) : undefined, context));
      return;
    case 'remove-conditions':
      targetIds(state, operation.target, context).forEach((id) => {
        const unit = findUnit(state, id);
        if (!unit) return;
        const location = locateCard(state, id);
        const removed = operation.conditions
          ? unit.conditions.filter(({ name }) => operation.conditions!.includes(name)).map(({ name }) => name)
          : unit.conditions.map(({ name }) => name);
        unit.conditions = operation.conditions
          ? unit.conditions.filter(({ name }) => !operation.conditions!.includes(name))
          : [];
        if (removed.length) appendGameLog(state, {
          kind: 'condition',
          message: getCard(unit.cardId).name + ' lost ' + removed.join(', ') + '.',
          source: effectSource(state, context),
          target: cardLogSubject(unit, location?.player),
          action: 'Removed ' + removed.join(', '),
        });
      });
      return;
    case 'modifier':
      addModifier(state, operation, context);
      return;
    case 'if':
      pushFrame(continuation, evaluateCondition(state, operation.condition, context) ? operation.then : operation.else ?? [], context);
      return;
    case 'for-each': {
      const values = selectCards(state, operation.selector, context);
      for (let index = values.length - 1; index >= 0; index -= 1) {
        continuation.frames.push({
          effects: [...operation.effects],
          index: 0,
          actor: context.actor,
          sourceId: context.sourceId,
          event: context.event,
          variable: { name: operation.store, value: [values[index]], previous: continuation.vars[operation.store] },
        });
      }
      return;
    }
    case 'roll': {
      const sides = operation.sides || continuation.attack?.effectDieSides || 6;
      const result = rollDie(sides, random);
      continuation.vars.dr = result;
      if (continuation.attack) {
        continuation.attack.dr = result;
        continuation.attack.effectDieSides = sides;
      }
      recordRoll(
        state,
        [{ kind: 'effect', sides, value: result, outcome: 'effect-value' }],
        0,
        'Effect die resolved: ' + result + ' on d' + sides + '.',
        continuation.attack ? attackRollContext(continuation.attack) : undefined,
      );
      return;
    }
    case 'set-attack': {
      const attack = continuation.attack;
      if (!attack) return;
      const value = typeof operation.value === 'boolean' ? operation.value : evaluateValue(state, operation.value, context);
      if (operation.property === 'damage') attack.damage = Number(value);
      if (operation.property === 'critical') attack.isCritical = Boolean(value);
      if (operation.property === 'failed') attack.isFailed = Boolean(value);
      if (operation.property === 'exhaust-attacker') attack.shouldExhaust = Boolean(value);
      if (operation.property === 'ignore-defense') attack.ignoresDefense = Boolean(value);
      if (operation.property === 'critical-multiplier') attack.criticalMultiplier = Number(value);
      if (operation.property === 'cannot-crit') attack.cannotCrit = Boolean(value);
      return;
    }
    case 'add-completion': {
      const amount = operation.amount ? evaluateValue(state, operation.amount, context) : 1;
      for (const id of targetIds(state, operation.target, context)) {
        const location = locateCard(state, id);
        if (!location || location.zone !== 'utilities') continue;
        const entry = state.players[location.player].utilities[location.index];
        const card = getCard(entry.cardId);
        if (card.utilityType !== 'construction' || entry.isDone) continue;
        entry.completion = (entry.completion ?? 0) + amount;
        if (entry.completion >= (card.completionCost ?? 1)) {
          entry.isDone = true;
          pushFrame(continuation, [{ internal: 'dispatch', event: { name: 'construction-done', sourceId: id, targetId: id, controller: location.player } }], context);
        }
      }
      return;
    }
    case 'prevent-vanquish': {
      const id = idsFromRef(context, operation.target)[0];
      const unit = id ? findUnit(state, id) : null;
      if (id && unit) {
        unit.currentHp = operation.hp;
        continuation.vars['prevented:' + id] = true;
      }
      return;
    }
    case 'attach': {
      const equipmentId = idsFromRef(context, operation.equipment)[0];
      const unitId = idsFromRef(context, operation.unit)[0];
      const location = equipmentId ? locateCard(state, equipmentId) : null;
      if (location?.zone === 'utilities' && unitId) {
        const unit = findUnit(state, unitId);
        if (!unit) return;
        const unitLocation = locateCard(state, unitId);
        const equipment = state.players[location.player].utilities[location.index];
        const before = getCard(unit.cardId).hp + modifierTotal(state, unitId, null, 'max-hp', continuation);
        equipment.attachedTo = unitId;
        const after = getCard(unit.cardId).hp + modifierTotal(state, unitId, null, 'max-hp', continuation);
        unit.currentHp += Math.max(0, after - before);
        appendGameLog(state, {
          kind: 'effect',
          message: getCard(equipment.cardId).name + ' attached to ' + getCard(unit.cardId).name + '.',
          source: cardLogSubject(equipment, location.player),
          target: cardLogSubject(unit, unitLocation?.player),
          action: 'Attached Equipment',
        });
      }
      return;
    }
    case 'reveal': {
      const cards = targetIds(state, operation.target, context).map((id) => {
        const location = locateCard(state, id)!;
        return getCard(cardAt(state, location)!.cardId).name;
      });
      appendGameLog(state, {
        kind: 'reveal',
        message: cards.length ? 'Revealed: ' + cards.join(', ') + '.' : 'No cards were revealed.',
        source: effectSource(state, context),
        target: playerLogSubject(state, context.actor),
        action: 'Reveal' + (cards.length ? ' · ' + cards.length + ' card' + (cards.length === 1 ? '' : 's') : ''),
      });
      return;
    }
    case 'shuffle': {
      const player = controllerFor(operation.player, context) ?? context.actor;
      shuffle(state.players[player].deck, random);
      return;
    }
    case 'win': {
      const player = controllerFor(operation.player, context) ?? context.actor;
      state.winner = player;
      appendGameLog(state, {
        kind: 'victory',
        message: state.players[player].name + ' won by a card effect.',
        source: effectSource(state, context),
        target: playerLogSubject(state, player),
        action: 'Won the match',
      });
      return;
    }
    case 'log':
      appendGameLog(state, {
        kind: 'system',
        message: operation.message,
        source: effectSource(state, context),
        target: findLogSubject(state, context.event?.targetId),
        action: 'Card effect',
      });
      return;
  }
}

function setAttackOperations(effects: readonly EffectOperation[]): EffectOperation[] {
  return effects.flatMap((operation): EffectOperation[] => {
    if (operation.op === 'set-attack') return ['damage', 'critical', 'failed', 'critical-multiplier', 'cannot-crit'].includes(operation.property) ? [operation] : [];
    if (operation.op !== 'if') return [];
    const then = setAttackOperations(operation.then);
    const otherwise = setAttackOperations(operation.else ?? []);
    return then.length || otherwise.length ? [{ ...operation, then, else: otherwise }] : [];
  });
}

function resolutionOperations(effects: readonly EffectOperation[]): EffectOperation[] {
  return effects.flatMap((operation): EffectOperation[] => {
    if (operation.op === 'set-attack') return ['damage', 'critical', 'failed'].includes(operation.property) ? [] : [operation];
    if (operation.op !== 'if') return [operation];
    const then = resolutionOperations(operation.then);
    const otherwise = resolutionOperations(operation.else ?? []);
    return then.length || otherwise.length ? [{ ...operation, then, else: otherwise }] : [];
  });
}

function executeInternal(
  state: GameState,
  operation: InternalOperation,
  context: ExecutionContext,
  random: () => number,
) {
  const continuation = context.continuation;
  const attack = continuation.attack;
  switch (operation.internal) {
    case 'dispatch':
      dispatchEvent(state, operation.event, continuation);
      return;
    case 'roll-effect-die':
      if (!attack || operation.sides <= 0) return;
      attack.dr = rollDie(operation.sides, random);
      continuation.vars.dr = attack.dr;
      appendGameLog(state, {
        kind: 'roll',
        message: attack.attackName + ' rolled ' + attack.dr + ' on d' + operation.sides + '.',
        source: findLogSubject(state, attack.attackerId) ?? effectSource(state, context),
        target: attack.defenderId
          ? findLogSubject(state, attack.defenderId)
          : playerLogSubject(state, attack.defendingPlayer),
        action: attack.attackName + ' · d' + operation.sides + ' → ' + attack.dr,
        amount: attack.dr,
      });
      recordRoll(
        state,
        [{ kind: 'effect', sides: operation.sides, value: attack.dr, outcome: 'effect-value' }],
        0,
        attack.attackName + ' effect die: ' + attack.dr + '.',
        attackRollContext(attack),
      );
      return;
    case 'offer-die-actions':
      offerEffectDieActions(state, continuation);
      return;
    case 'run':
      pushFrame(continuation, operation.effects, context, operation.skipIfAttackFailed ?? false);
      return;
    case 'tap-surplus': {
      const ids = idsFromRef(context, operation.ref);
      state.players[context.actor].energies.forEach((energy) => {
        if (ids.includes(energy.instanceId) && !energy.isTapped) energy.isTapped = true;
      });
      if (attack) attack.surplus = ids.length;
      return;
    }
    case 'tap-energy': {
      const ids = idsFromRef(context, operation.ref);
      state.players[context.actor].energies.forEach((energy) => {
        if (ids.includes(energy.instanceId) && !energy.isTapped) energy.isTapped = true;
      });
      if (attack && operation.store === 'x-cost') attack.xCost = ids.length;
      return;
    }
    case 'self-attack-damage': {
      if (!attack) return;
      const selfDamage = modifierTotal(state, attack.attackerId, null, 'damage-on-attack', continuation);
      if (selfDamage > 0) applyDamage(state, continuation, [attack.attackerId], selfDamage, context, 'effect');
      return;
    }
    case 'roll-critical':
      if (!attack || attack.damage <= 0 || attack.isFailed || attack.isCritical) return;
      attack.criticalRoll = rollDie(20, random);
      if (attack.criticalRoll === 1) {
        attack.isFailed = true;
        appendGameLog(state, {
          kind: 'roll',
          message: attack.attackName + ' failed on a natural 1.',
          source: findLogSubject(state, attack.attackerId) ?? effectSource(state, context),
          target: attack.defenderId
            ? findLogSubject(state, attack.defenderId)
            : playerLogSubject(state, attack.defendingPlayer),
          action: attack.attackName + ' · Natural 1',
          amount: 1,
        });
        return;
      }
      const attacker = findUnit(state, attack.attackerId);
      const isWeakened = attacker?.conditions.some(({ name }) => name === 'weakened') ?? false;
      if (attack.criticalRoll === 20 && !isWeakened && !attack.cannotCrit) attack.isCritical = true;
      return;
    case 'resolve-attack-damage': {
      if (!attack || attack.damage <= 0) return;
      if (attack.isFailed) {
        recordRoll(state, resolvedAttackRolls(attack), 0, 'Attack failed — 0 Damage.', attackRollContext(attack));
        return;
      }
      let damage = attack.damage + modifierTotal(state, attack.attackerId, null, 'attack-damage', continuation);
      if (attack.defenderId) damage += modifierTotal(state, attack.defenderId, null, 'attack-damage-taken', continuation);
      damage = Math.max(0, damage);
      if (attack.isCritical) damage *= attack.criticalMultiplier ?? 2;
      if (!attack.defenderId) {
        const defender = state.players[attack.defendingPlayer];
        defender.hp = Math.max(0, defender.hp - damage);
        if (defender.hp === 0) state.winner = context.actor;
        recordRoll(
          state,
          resolvedAttackRolls(attack),
          damage,
          attack.isCritical ? 'Critical direct hit!' : 'Direct hit.',
          attackRollContext(attack),
        );
        appendGameLog(state, {
          kind: 'damage',
          message: attack.attackName + ' dealt ' + damage + ' direct Damage.',
          source: findLogSubject(state, attack.attackerId) ?? effectSource(state, context),
          target: playerLogSubject(state, attack.defendingPlayer),
          action: attack.attackName + ' · Direct Damage',
          amount: damage,
        });
        return;
      }
      const unit = findUnit(state, attack.defenderId);
      if (!unit) return;
      const defense = getCard(unit.cardId).defense + modifierTotal(state, attack.defenderId, null, 'defense', continuation);
      attack.defenseTarget = defense;
      let defenseLabel = 'failed Defense';
      if (!attack.ignoresDefense) {
        attack.defenseRoll = rollDie(100, random);
        if (attack.defenseRoll <= 5) {
          damage = 0;
          defenseLabel = 'Critical Defense';
        } else if (attack.defenseRoll >= 95) {
          damage *= 2;
          defenseLabel = 'Critical Defense Failure';
        } else if (attack.defenseRoll <= defense) {
          damage = Math.floor(damage / 2);
          defenseLabel = 'successful Defense';
        }
      } else {
        defenseLabel = 'Defense ignored';
      }
      recordRoll(
        state,
        resolvedAttackRolls(attack),
        damage,
        defenseLabel + ' — ' + damage + ' Damage.',
        attackRollContext(attack),
      );
      applyDamage(state, continuation, [attack.defenderId], damage, context, 'attack');
      if (!attack.ignoresDefense && attack.defenseRoll !== undefined && attack.defenseRoll <= 5) {
        pushFrame(continuation, [{ internal: 'dispatch', event: {
          name: 'critical-defense', sourceId: attack.attackerId, targetId: attack.defenderId,
          controller: locateCard(state, attack.defenderId)?.player ?? attack.defendingPlayer,
        } }], context);
      }
      return;
    }
    case 'finish-attack':
      if (attack && !attack.shouldExhaust) {
        const attacker = findUnit(state, attack.attackerId);
        if (attacker) attacker.isReady = true;
      }
      if (attack) state.modifiers = state.modifiers.filter(({ expires }) => !expires || !('attack' in expires) || expires.attack !== attack.sequence);
      return;
    case 'finalize-vanquish':
      finalizeVanquish(state, continuation, operation, context);
      return;
  }
}

export function runContinuation(
  state: GameState,
  continuation: EffectContinuation,
  random: () => number = secureRandom,
): GameState {
  while (continuation.frames.length && !state.pendingChoice && state.winner === null) {
    const frame = continuation.frames[continuation.frames.length - 1];
    if (frame.variable && !frame.initialized) {
      continuation.vars[frame.variable.name] = frame.variable.value;
      frame.initialized = true;
    }
    if (frame.skipIfAttackFailed && continuation.attack?.isFailed) frame.index = frame.effects.length;
    if (frame.index >= frame.effects.length) {
      continuation.frames.pop();
      if (frame.variable) {
        if (frame.variable.previous === undefined) delete continuation.vars[frame.variable.name];
        else continuation.vars[frame.variable.name] = frame.variable.previous;
      }
      continue;
    }
    const operation = frame.effects[frame.index++];
    const context: ExecutionContext = {
      actor: frame.actor,
      sourceId: frame.sourceId,
      event: frame.event,
      continuation,
    };
    currentStateForLookup = state;
    try {
      if (isInternal(operation)) executeInternal(state, operation, context, random);
      else executeOperation(state, operation, context, random);
    } finally {
      currentStateForLookup = null;
    }
  }
  return state;
}

export function startEffects(
  state: GameState,
  actor: PlayerId,
  sourceInstanceId: string,
  effects: readonly EffectOperation[],
  event?: EffectEvent,
  random: () => number = secureRandom,
): GameState {
  const continuation: EffectContinuation = {
    actor,
    sourceInstanceId,
    vars: {},
    frames: [],
  };
  pushFrame(continuation, effects, { actor, sourceId: sourceInstanceId, event });
  return runContinuation(state, continuation, random);
}

export function dispatchGameEvent(
  state: GameState,
  event: EffectEvent,
  random: () => number = secureRandom,
): GameState {
  const continuation: EffectContinuation = {
    actor: event.controller,
    sourceInstanceId: event.sourceId ?? 'rules',
    vars: {},
    frames: [],
  };
  pushFrame(continuation, [{ internal: 'dispatch', event }], { actor: event.controller, sourceId: event.sourceId ?? 'rules', event });
  return runContinuation(state, continuation, random);
}

export function startAttackEffects(
  state: GameState,
  actor: PlayerId,
  sourceInstanceId: string,
  targetInstanceId: string | null,
  defendingPlayer: PlayerId,
  attack: AttackDefinition,
  attackScript: import('./effectTypes').AttackScript,
  random: () => number = secureRandom,
): GameState {
  const attacker = findUnit(state, sourceInstanceId);
  const defender = targetInstanceId ? findUnit(state, targetInstanceId) : null;
  if (!attacker) return state;
  const damageMatch = attack.damage.match(/^\d+/);
  const runtime: AttackRuntime = {
    sequence: ++state.actionSequence,
    attackerId: sourceInstanceId,
    defenderId: targetInstanceId,
    defendingPlayer,
    attackId: attack.id,
    attackName: attack.name,
    combat: {
      attackName: attack.name,
      attacker: { instanceId: attacker.instanceId, cardId: attacker.cardId, name: getCard(attacker.cardId).name },
      defender: defender
        ? { instanceId: defender.instanceId, cardId: defender.cardId, name: getCard(defender.cardId).name }
        : { name: state.players[defendingPlayer].name },
    },
    effectDieSides: attack.dice[0]?.die ?? 0,
    dr: 0,
    surplus: 0,
    xCost: 0,
    damage: damageMatch ? Number(damageMatch[0]) : 0,
    criticalRoll: 0,
    isCritical: false,
    isFailed: false,
    shouldExhaust: true,
    ignoresDefense: false,
  };
  const continuation: EffectContinuation = {
    actor,
    sourceInstanceId,
    vars: {},
    frames: [],
    attack: runtime,
  };
  const eventBase = { sourceId: sourceInstanceId, targetId: targetInstanceId ?? undefined, controller: actor };
  const preparation = [...(attackScript.prepare ?? []), ...setAttackOperations(attackScript.effects ?? [])];
  const resolution = resolutionOperations(attackScript.effects ?? []);
  const program: RuntimeOperation[] = [];
  if (attack.isGenericCostVariable) {
    program.push({
      op: 'choose',
      selector: { zone: 'energies', controller: 'actor', kind: 'energy', ready: true },
      store: 'x-cost-energy',
      min: 0,
      max: state.players[actor].energies.filter(({ isTapped }) => !isTapped).length,
      prompt: 'Choose the value of X by selecting Ready Energy to tap.',
    });
    program.push({ internal: 'tap-energy', ref: 'x-cost-energy', store: 'x-cost' });
  }
  if (attackScript.surplus) {
    program.push({
      op: 'choose',
      selector: { zone: 'energies', controller: 'actor', kind: 'energy', ready: true },
      store: 'surplus-energy',
      min: 0,
      max: state.players[actor].energies.filter(({ isTapped }) => !isTapped).length,
      prompt: 'Choose any surplus Energy to tap.',
    });
    program.push({ internal: 'tap-surplus', ref: 'surplus-energy' });
  }
  program.push({ internal: 'dispatch', event: { name: 'attack-declared', ...eventBase } });
  program.push({ internal: 'self-attack-damage' });
  if (targetInstanceId) program.push({ internal: 'dispatch', event: { name: 'attack-targeted', ...eventBase } });
  if (runtime.effectDieSides) {
    program.push({ internal: 'roll-effect-die', sides: runtime.effectDieSides });
    program.push({ internal: 'offer-die-actions' });
  }
  program.push({ internal: 'run', effects: preparation });
  program.push({ internal: 'roll-critical' });
  program.push({ internal: 'run', effects: resolution, skipIfAttackFailed: true });
  program.push({ internal: 'resolve-attack-damage' });
  program.push({ internal: 'run', effects: attackScript.afterDamage ?? [], skipIfAttackFailed: true });
  program.push({ internal: 'finish-attack' });
  pushFrame(continuation, program, { actor, sourceId: sourceInstanceId });
  return runContinuation(state, continuation, random);
}

export function resolveEffectChoice(
  state: GameState,
  selectedIds: readonly string[],
  random: () => number = secureRandom,
): { state: GameState; error?: string } {
  const pending = state.pendingChoice;
  if (!pending) return { state, error: 'There is no pending choice.' };
  const valid = new Set(pending.options.map(({ id }) => id));
  const unique = [...new Set(selectedIds)];
  if (unique.some((id) => !valid.has(id))) return { state, error: 'That choice is no longer legal.' };
  if (unique.length < pending.min || unique.length > pending.max) {
    return { state, error: 'Choose between ' + pending.min + ' and ' + pending.max + ' options.' };
  }
  const continuation = pending.continuation;
  state.pendingChoice = null;
  if (pending.store === '__reaction') {
    const selected = unique[0];
    if (selected && selected !== 'pass') {
      const location = locateCard(state, selected);
      if (location) {
        playReaction(state, continuation, location.player, selected, pending.event);
      }
    }
  } else if (pending.store === '__die_action') {
    const selected = unique[0];
    if (selected && selected !== 'pass') {
      const [sourceId, abilityId] = selected.split('::');
      const location = locateCard(state, sourceId);
      if (location) {
        const instance = cardAt(state, location)!;
        const ability = getEffectScript(instance.cardId).activated?.find(({ id }) => id === abilityId);
        if (ability) {
          state.usedActions[sourceId + ':' + ability.id] = state.players[location.player].turnCount;
          pushFrame(continuation, ability.effects, { actor: location.player, sourceId });
        }
      }
    }
  } else {
    continuation.vars[pending.store] = unique;
  }
  return { state: runContinuation(state, continuation, random) };
}

export function canActivate(
  state: GameState,
  player: PlayerId,
  sourceInstanceId: string,
  abilityId: string,
): boolean {
  const location = locateCard(state, sourceInstanceId);
  if (!location || location.player !== player) return false;
  if (isDormantConstruction(state, sourceInstanceId)) return false;
  const instance = cardAt(state, location)!;
  const ability = getEffectScript(instance.cardId).activated?.find(({ id }) => id === abilityId);
  if (!ability || ability.timing !== 'action') return false;
  if (ability.once === 'turn' && state.usedActions[sourceInstanceId + ':' + ability.id] === state.players[player].turnCount) return false;
  if (!ability.condition) return true;
  const continuation: EffectContinuation = { actor: player, sourceInstanceId, vars: {}, frames: [] };
  return evaluateCondition(state, ability.condition, { actor: player, sourceId: sourceInstanceId, continuation });
}

export function startActivatedEffects(
  state: GameState,
  player: PlayerId,
  sourceInstanceId: string,
  abilityId: string,
  random: () => number = secureRandom,
): { state: GameState; error?: string } {
  if (!canActivate(state, player, sourceInstanceId, abilityId)) return { state, error: 'That ability cannot be used now.' };
  const location = locateCard(state, sourceInstanceId)!;
  const instance = cardAt(state, location)!;
  const ability = getEffectScript(instance.cardId).activated!.find(({ id }) => id === abilityId)!;
  state.usedActions[sourceInstanceId + ':' + ability.id] = state.players[player].turnCount;
  return {
    state: startEffects(state, player, sourceInstanceId, [...(ability.costs ?? []), ...ability.effects], undefined, random),
  };
}

export function startUtilityScript(
  state: GameState,
  player: PlayerId,
  sourceInstanceId: string,
  random: () => number = secureRandom,
): GameState {
  const location = locateCard(state, sourceInstanceId);
  if (!location) return state;
  const instance = cardAt(state, location)!;
  const utility = getEffectScript(instance.cardId).utility;
  if (!utility) return state;
  const effects: EffectOperation[] = [];
  if (utility.attach) {
    effects.push({ op: 'choose', selector: { ...utility.attach, equipmentSlotsAvailable: true }, store: 'attach-target', min: 1, max: 1, prompt: 'Choose a Unit to equip.' });
    effects.push({ op: 'attach', equipment: 'source', unit: 'attach-target' });
  }
  effects.push(...(utility.effects ?? []));
  return startEffects(state, player, sourceInstanceId, effects, undefined, random);
}

export function utilityConditionError(state: GameState, player: PlayerId, instanceId: string): string | null {
  const location = locateCard(state, instanceId);
  if (!location) return 'That Utility is no longer available.';
  const instance = cardAt(state, location)!;
  const utility = getEffectScript(instance.cardId).utility;
  const condition = utility?.condition;
  const continuation: EffectContinuation = { actor: player, sourceInstanceId: instanceId, vars: {}, frames: [] };
  if (utility?.attach && selectCards(state, { ...utility.attach, equipmentSlotsAvailable: true }, { actor: player, sourceId: instanceId, continuation }).length === 0) {
    return 'There is no legal Unit with an open Equipment slot.';
  }
  if (!condition) return null;
  return evaluateCondition(state, condition.condition, { actor: player, sourceId: instanceId, continuation })
    ? null
    : condition.message;
}

export function expireModifiers(state: GameState, player: PlayerId, phase: 'start' | 'end') {
  const turn = state.players[player].turnCount;
  state.modifiers = state.modifiers.filter(({ expires }) =>
    !expires || 'attack' in expires || !(expires.player === player && expires.phase === phase && expires.turn <= turn)
  );
}
