import { getCard } from '../../data/catalog';
import {
  activateAbility, advanceConstruction, availableAttacks, chooseEffect, endPlayerTurn, playEnergy,
  playUnit, playUtility, runOpponentTurn, useAttack,
} from '../engine';
import {
  dispatchGameEvent, findUnit, hasModifier, locateCard, modifierTotal,
} from '../effectRuntime';
import type { CardZone } from '../effectTypes';
import type { GameResult, GameState, PlayerId, RowName } from '../types';
import {
  addTestCondition, addTestEnergy, addTestUnit, createCleanTestState, testInstanceId,
} from '../testing/gameFixture';
import type {
  CardGameplayTest, GameplayExpectation, GameplayScenario, TestCardSetup, TestChoice, TestUnitSetup,
} from './gameplayTestTypes';

interface ScenarioContext {
  state: GameState;
  refs: Map<string, string>;
  choiceCursor: number;
}

interface ScenarioSnapshot {
  hp: Map<string, number>;
  playerHp: [number, number];
  zoneCounts: Record<string, number>;
  tappedEnergy: [number, number];
}

const collectionZones = ['deck', 'hand', 'utilities', 'energies', 'vanquished'] as const;

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function addUnitSetup(context: ScenarioContext, setup: TestUnitSetup): void {
  const previous = context.state.players[setup.player][setup.row][setup.index];
  if (previous) {
    for (const [ref, id] of context.refs) {
      if (id === previous.instanceId) context.refs.delete(ref);
    }
  }
  const instanceId = addTestUnit(context.state, setup.player, setup.row, setup.index, setup.cardId);
  const unit = findUnit(context.state, instanceId)!;
  if (setup.hp !== undefined) unit.currentHp = setup.hp;
  if (setup.isReady !== undefined) unit.isReady = setup.isReady;
  for (const condition of setup.conditions ?? []) addTestCondition(context.state, instanceId, condition.name, condition.amount);
  context.refs.set(setup.ref, instanceId);
}

function addCardSetup(context: ScenarioContext, setup: TestCardSetup): void {
  const instanceId = testInstanceId(setup.cardId);
  const attachedTo = setup.attachedTo ? requireRef(context, setup.attachedTo) : undefined;
  const owner = setup.owner ?? setup.player;
  const card = attachedTo
    ? { instanceId, cardId: setup.cardId, owner, attachedTo }
    : setup.zone === 'utilities' && (setup.done !== undefined || setup.completion !== undefined)
      ? { instanceId, cardId: setup.cardId, owner, completion: setup.completion ?? (setup.done ? 1 : 0), isDone: setup.done ?? false }
      : { instanceId, cardId: setup.cardId, owner };
  if (setup.zone === 'deck' && setup.top) context.state.players[setup.player].deck.unshift(card);
  else if (setup.zone === 'energies') {
    const definition = getCard(setup.cardId);
    expect(definition.kind === 'energy' && definition.energyType, `${setup.cardId} is not an Energy card.`);
    context.state.players[setup.player].energies.push({
      instanceId,
      cardId: setup.cardId,
      owner,
      energyType: definition.energyType,
      isTapped: setup.isTapped ?? false,
    });
  }
  else context.state.players[setup.player][setup.zone].push(card);
  context.refs.set(setup.ref, instanceId);
}

function createScenarioContext(cardId: string, scenario: GameplayScenario): ScenarioContext {
  const state = createCleanTestState();
  state.activePlayer = scenario.setup?.activePlayer ?? 0;
  state.players[0].hp = scenario.setup?.playerHp?.[0] ?? state.players[0].hp;
  state.players[1].hp = scenario.setup?.playerHp?.[1] ?? state.players[1].hp;
  const context: ScenarioContext = { state, refs: new Map(), choiceCursor: 0 };
  const card = getCard(cardId);

  if (!scenario.setup?.sparseBoard) {
    addUnitSetup(context, { ref: 'ally', cardId: '078-pilot', player: 0, row: 'vanguard', index: 1, hp: 1000 });
    addUnitSetup(context, { ref: 'ally2', cardId: '034-bob-ross', player: 0, row: 'vanguard', index: 2, hp: 1000 });
    addUnitSetup(context, { ref: 'ally3', cardId: '038-eminem', player: 0, row: 'backguard', index: 1, hp: 1000 });
    addUnitSetup(context, { ref: 'defender', cardId: '069-conscript', player: 1, row: 'vanguard', index: 0, hp: 1000 });
    addUnitSetup(context, { ref: 'enemy2', cardId: '067-civilian', player: 1, row: 'vanguard', index: 1, hp: 1000 });
    addUnitSetup(context, { ref: 'enemy3', cardId: '035-cremator', player: 1, row: 'backguard', index: 0, hp: 1000 });
  }

  if (card.kind === 'unit') {
    const action = scenario.action;
    const printedAttack = action.kind === 'attack'
      ? [...card.attacks, ...(card.utilityAttack?.name ? [card.utilityAttack] : [])]
        .find(({ id }) => id === action.attackId)
      : undefined;
    const sourceZone = scenario.setup?.sourceZone
      ?? scenario.setup?.sourceRow
      ?? (printedAttack?.damage === 'BG' ? 'backguard' : 'vanguard');
    if (sourceZone === 'hand') {
      addCardSetup(context, { ref: 'source', cardId, player: 0, zone: 'hand' });
    } else {
      addUnitSetup(context, {
        ref: 'source',
        cardId,
        player: 0,
        row: sourceZone,
        index: 0,
        hp: scenario.setup?.sourceHp ?? 1000,
        isReady: scenario.setup?.sourceReady ?? true,
        conditions: scenario.setup?.sourceConditions,
      });
    }
  } else {
    const sourceId = testInstanceId(cardId);
    context.refs.set('source', sourceId);
    if (['utility', 'energy', 'attack', 'opponent-attack'].includes(scenario.action.kind)) {
      state.players[0].hand.push({ instanceId: sourceId, cardId });
    } else if (card.kind === 'utility') {
      const isConstruction = card.utilityType === 'construction';
      state.players[0].utilities.push({
        instanceId: sourceId,
        cardId,
        ...(isConstruction
          ? {
              completion: scenario.setup?.sourceCompletion ?? 0,
              isDone: scenario.setup?.sourceDone ?? false,
            }
          : {}),
      });
    }
  }

  const deckCards = [
    ['deck-unit', '069-conscript'],
    ['deck-low-unit', '067-civilian'],
    ['deck-utility', '089-battle-medicine'],
    ['deck-equipment', '094-pulse-rifle'],
    ['deck-machine', '068-cleaning-droid'],
    ['deck-tcr', '078-pilot'],
    ['deck-energy', 'energy-gluon'],
  ] as const;
  for (const [ref, deckCardId] of deckCards) addCardSetup(context, { ref, cardId: deckCardId, player: 0, zone: 'deck' });
  for (let index = 0; index < 12; index += 1) {
    addCardSetup(context, {
      ref: `deck-filler-${index}`,
      cardId: index % 2 ? '069-conscript' : '089-battle-medicine',
      player: 0,
      zone: 'deck',
    });
  }
  addCardSetup(context, { ref: 'hand-card', cardId: '069-conscript', player: 0, zone: 'hand' });
  addCardSetup(context, { ref: 'opponent-hand-utility', cardId: '089-battle-medicine', player: 1, zone: 'hand' });
  addCardSetup(context, { ref: 'opponent-hand-unit', cardId: '069-conscript', player: 1, zone: 'hand' });
  for (let index = 0; index < 8; index += 1) {
    addCardSetup(context, {
      ref: `opponent-deck-${index}`,
      cardId: index % 2 ? '069-conscript' : '089-battle-medicine',
      player: 1,
      zone: 'deck',
    });
  }
  addCardSetup(context, { ref: 'vanquished-unit', cardId: '068-cleaning-droid', player: 0, zone: 'vanquished' });
  addCardSetup(context, { ref: 'vanquished-utility', cardId: '089-battle-medicine', player: 0, zone: 'vanquished' });

  for (const setup of scenario.setup?.units ?? []) addUnitSetup(context, setup);
  for (const setup of scenario.setup?.cards ?? []) addCardSetup(context, setup);
  // An Equipment tested through an ability/trigger/continuous action needs a host
  // Unit; attach it to the ally ref after board setup so tests can pick/damage it.
  if (card.kind === 'utility' && card.utilityType === 'equipment'
    && !['utility', 'energy', 'attack', 'opponent-attack'].includes(scenario.action.kind)) {
    const host = context.refs.get('ally');
    const equipment = state.players[0].utilities.find(({ instanceId }) => instanceId === context.refs.get('source'));
    if (host && equipment) {
      equipment.attachedTo = host;
      context.refs.set('equipped-unit', host);
    }
  }
  const defaultEnergyCopies = scenario.setup?.defaultEnergyCopies ?? 8;
  for (const player of [0, 1] as const) {
    for (const type of ['gluon', 'photon', 'electron', 'muon', 'boson', 'neutrino'] as const) {
      for (let copy = 0; copy < defaultEnergyCopies; copy += 1) addTestEnergy(state, player, type);
    }
  }
  for (const energy of scenario.setup?.energies ?? []) {
    const instanceId = addTestEnergy(state, energy.player, energy.type);
    const added = state.players[energy.player].energies.at(-1)!;
    added.owner = energy.owner ?? energy.player;
    added.isTapped = energy.isTapped ?? false;
    context.refs.set(energy.ref, instanceId);
  }
  for (const modifier of scenario.setup?.modifiers ?? []) {
    state.modifiers.push({
      id: testInstanceId('modifier'),
      sourceInstanceId: requireRef(context, modifier.source),
      targetIds: modifier.target ? [requireRef(context, modifier.target)] : [],
      targetPlayer: modifier.player,
      kind: modifier.kind,
      amount: modifier.amount,
      text: modifier.text,
      expires: null,
    });
  }
  for (const used of scenario.setup?.usedActions ?? []) {
    const sourceId = requireRef(context, used.source);
    const player = locateCard(state, sourceId)?.player ?? 0;
    state.usedActions[`${sourceId}:${used.actionId}`] = state.players[player].turnCount;
  }
  state.turnEvents = (scenario.setup?.turnEvents ?? []).map((event) => ({
    name: event.event,
    sourceId: event.source ? requireRef(context, event.source) : undefined,
    targetId: event.target ? requireRef(context, event.target) : undefined,
    controller: event.controller,
    sourceController: event.sourceController
      ?? (event.source ? locateCard(state, requireRef(context, event.source))?.player : undefined),
    damageType: event.damageType,
    amount: event.amount,
    critical: event.critical,
  }));
  return context;
}

function requireRef(context: ScenarioContext, ref: string): string {
  const instanceId = context.refs.get(ref);
  if (!instanceId) throw new Error(`Unknown test reference: ${ref}.`);
  return instanceId;
}

function randomForScenario(cardId: string, scenario: GameplayScenario): () => number {
  const action = scenario.action;
  if (action.kind !== 'attack' && action.kind !== 'opponent-attack' && action.kind !== 'friendly-attack') return () => 0.5;
  const card = getCard(action.kind === 'attack' ? cardId : action.attackerCardId);
  const attack = [...card.attacks, ...(card.utilityAttack?.name ? [card.utilityAttack] : [])]
    .find(({ id }) => id === action.attackId);
  expect(attack, `Unknown attack ${action.attackId}.`);
  const values: number[] = [];
  if (attack.dice[0]) {
    const roll = action.effectRoll ?? Math.ceil(attack.dice[0].die / 2);
    values.push((roll - 0.5) / attack.dice[0].die);
  }
  values.push(((action.criticalRoll ?? 10) - 0.5) / 20);
  if (/^\d/.test(attack.damage)) values.push(((action.defenseRoll ?? 94) - 0.5) / 100);
  let index = 0;
  return () => values[index++] ?? 0.5;
}

function selectedOptionIds(context: ScenarioContext, choice: TestChoice | undefined): string[] {
  const pending = context.state.pendingChoice!;
  if (!choice || choice.choose === 'minimum') return pending.options.slice(0, pending.min).map(({ id }) => id);
  if (choice.choose === 'maximum') return pending.options.slice(0, pending.max).map(({ id }) => id);
  if (choice.choose === 'none') return [];
  const requested = [
    ...(choice.ability ? [`${requireRef(context, choice.ability.source)}::${choice.ability.abilityId}`] : []),
    ...(choice.refs ?? []).map((ref) => requireRef(context, ref)),
    ...(choice.optionIds ?? []),
  ];
  return requested;
}

function resolveChoices(
  context: ScenarioContext,
  choices: readonly TestChoice[],
  random: () => number,
  surplus = 0,
): GameResult {
  let result: GameResult = { state: context.state };
  for (let guard = 0; result.state.pendingChoice && guard < 50; guard += 1) {
    context.state = result.state;
    const pending = result.state.pendingChoice;
    const declaredChoice = choices[context.choiceCursor];
    const autoPassDieAction = pending.store === '__die_action' && !declaredChoice?.ability
      && !declaredChoice?.optionIds?.some((id) => id !== 'pass');
    const selected = pending.store === 'surplus-energy' && surplus > 0
      ? pending.options.slice(0, surplus).map(({ id }) => id)
      : autoPassDieAction
        ? ['pass']
        : selectedOptionIds(context, choices[context.choiceCursor++]);
    if (declaredChoice?.captureAs && selected[0]) context.refs.set(declaredChoice.captureAs, selected[0]);
    result = chooseEffect(result.state, selected, random);
    if (result.error) {
      return {
        state: result.state,
        error: `${result.error} Pending "${pending.prompt}" (${pending.store}); selected [${selected.join(', ')}]; legal [${pending.options.map(({ id }) => id).join(', ')}].`,
      };
    }
  }
  if (result.state.pendingChoice) return { state: result.state, error: 'Choices did not terminate.' };
  return result;
}

function locateUnitAddress(state: GameState, instanceId: string): { player: PlayerId; row: RowName; index: number } {
  const location = locateCard(state, instanceId);
  expect(location && (location.zone === 'vanguard' || location.zone === 'backguard'), `Unit ${instanceId} is not in play.`);
  return { player: location.player, row: location.zone, index: location.index };
}

function performAttack(
  cardId: string,
  scenario: GameplayScenario & { action: Extract<GameplayScenario['action'], { kind: 'attack' }> },
  context: ScenarioContext,
  random: () => number,
): GameResult {
  const card = getCard(cardId);
  let attackerId = requireRef(context, 'source');
  if (card.kind === 'utility') {
    const played = playUtility(context.state, 0, attackerId);
    if (played.error) return played;
    context.state = played.state;
    const equipped = resolveChoices(context, scenario.choices ?? [], random);
    if (equipped.error) return equipped;
    context.state = equipped.state;
    const utility = context.state.players[0].utilities.find(({ instanceId }) => instanceId === attackerId);
    expect(utility?.attachedTo, `${cardId} did not attach.`);
    attackerId = utility.attachedTo;
    context.refs.set('equipped-unit', attackerId);
  }
  const address = locateUnitAddress(context.state, attackerId);
  const attacks = availableAttacks(context.state, attackerId);
  const attackIndex = attacks.findIndex(({ attack }) => attack.id === scenario.action.attackId);
  expect(attackIndex >= 0, `${scenario.action.attackId} is not available.`);
  const targetRef = scenario.action.target === undefined ? 'defender' : scenario.action.target;
  const target = targetRef ? locateUnitAddress(context.state, requireRef(context, targetRef)) : null;
  return useAttack(context.state, address, attackIndex, target, random);
}

function performAction(cardId: string, scenario: GameplayScenario, context: ScenarioContext, random: () => number): GameResult {
  const sourceId = requireRef(context, 'source');
  const action = scenario.action;
  switch (action.kind) {
    case 'attack':
      return performAttack(cardId, { ...scenario, action }, context, random);
    case 'ability':
      return activateAbility(context.state, 0, sourceId, action.abilityId);
    case 'trigger':
      dispatchGameEvent(context.state, {
        name: action.event,
        sourceId: action.eventSource ? requireRef(context, action.eventSource) : sourceId,
        targetId: action.eventTarget ? requireRef(context, action.eventTarget) : sourceId,
        controller: action.controller ?? 0,
        damageType: action.damageType,
        amount: action.amount,
        critical: action.critical,
      }, random);
      return { state: context.state };
    case 'utility':
      return playUtility(context.state, 0, sourceId);
    case 'energy':
      return playEnergy(context.state, 0, sourceId);
    case 'opponent-attack': {
      context.state.activePlayer = 1;
      const attackerId = context.refs.get('opponent-attacker')
        ?? addTestUnit(context.state, 1, 'vanguard', 2, action.attackerCardId);
      context.refs.set('opponent-attacker', attackerId);
      const attackIndex = availableAttacks(context.state, attackerId)
        .findIndex(({ attack }) => attack.id === action.attackId);
      expect(attackIndex >= 0, `${action.attackId} is not available to the opponent.`);
      return useAttack(
        context.state,
        { player: 1, row: 'vanguard', index: 2 },
        attackIndex,
        locateUnitAddress(context.state, requireRef(context, action.target)),
        random,
      );
    }
    case 'friendly-attack': {
      const attackerId = addTestUnit(context.state, 0, 'vanguard', 3, action.attackerCardId);
      context.refs.set('friendly-attacker', attackerId);
      const attackIndex = availableAttacks(context.state, attackerId)
        .findIndex(({ attack }) => attack.id === action.attackId);
      expect(attackIndex >= 0, `${action.attackId} is not available to the friendly attacker.`);
      const target = action.target === null
        ? null
        : locateUnitAddress(context.state, requireRef(context, action.target ?? 'defender'));
      return useAttack(context.state, { player: 0, row: 'vanguard', index: 3 }, attackIndex, target, random);
    }
    case 'opponent-play-unit': {
      context.state.activePlayer = 1;
      return playUnit(context.state, { player: 1, row: action.row, index: action.index }, requireRef(context, action.card));
    }
    case 'advance-construction':
      return advanceConstruction(context.state, 0, sourceId);
    case 'continuous':
      return { state: context.state };
  }
}

function cardInstance(state: GameState, instanceId: string) {
  const location = locateCard(state, instanceId);
  if (!location) return undefined;
  if (location.zone === 'vanguard' || location.zone === 'backguard') {
    return state.players[location.player][location.zone][location.index] ?? undefined;
  }
  return state.players[location.player][location.zone][location.index];
}

function zoneCount(state: GameState, player: PlayerId, zone: CardZone): number {
  if (zone === 'vanguard' || zone === 'backguard') return state.players[player][zone].filter(Boolean).length;
  return state.players[player][zone].length;
}

function snapshot(context: ScenarioContext): ScenarioSnapshot {
  const zones: readonly CardZone[] = [...collectionZones, 'vanguard', 'backguard'];
  return {
    hp: new Map([...context.refs].flatMap(([ref, id]) => {
      const unit = findUnit(context.state, id);
      return unit ? [[ref, unit.currentHp] as const] : [];
    })),
    playerHp: [context.state.players[0].hp, context.state.players[1].hp],
    zoneCounts: Object.fromEntries(([0, 1] as const).flatMap((player) =>
      zones.map((zone) => [`${player}:${zone}`, zoneCount(context.state, player, zone)]))),
    tappedEnergy: [0, 1].map((player) => context.state.players[player as PlayerId].energies.filter(({ isTapped }) => isTapped).length) as [number, number],
  };
}

function assertExpectation(
  expectation: GameplayExpectation,
  context: ScenarioContext,
  before: ScenarioSnapshot,
  error: string | undefined,
): void {
  const refId = 'ref' in expectation && expectation.ref ? requireRef(context, expectation.ref) : undefined;
  switch (expectation.kind) {
    case 'hp-change': {
      const unit = findUnit(context.state, refId!);
      expect(unit, `${expectation.ref} is no longer in play; use a zone assertion for Vanquish.`);
      expect(unit.currentHp - (before.hp.get(expectation.ref) ?? unit.currentHp) === expectation.amount,
        `${expectation.ref} HP changed by ${unit.currentHp - (before.hp.get(expectation.ref) ?? unit.currentHp)}, expected ${expectation.amount}.`);
      return;
    }
    case 'hp': {
      const unit = findUnit(context.state, refId!);
      expect(unit?.currentHp === expectation.value, `${expectation.ref} has ${unit?.currentHp ?? 'no'} HP, expected ${expectation.value}.`);
      return;
    }
    case 'player-hp-change':
      expect(context.state.players[expectation.player].hp - before.playerHp[expectation.player] === expectation.amount,
        `Player ${expectation.player} HP change was ${context.state.players[expectation.player].hp - before.playerHp[expectation.player]}, expected ${expectation.amount}.`);
      return;
    case 'condition': {
      const condition = findUnit(context.state, refId!)?.conditions.find(({ name }) => name === expectation.condition);
      expect(Boolean(condition) === expectation.present, `${expectation.ref} condition ${expectation.condition} presence was ${Boolean(condition)}, expected ${expectation.present}.`);
      if (expectation.amount !== undefined) expect(condition?.amount === expectation.amount, `${expectation.condition} amount was ${condition?.amount}, expected ${expectation.amount}.`);
      return;
    }
    case 'ready': {
      const location = locateCard(context.state, refId!);
      const actual = location?.zone === 'energies'
        ? !context.state.players[location.player].energies[location.index]?.isTapped
        : findUnit(context.state, refId!)?.isReady;
      expect(actual === expectation.value, `${expectation.ref} Ready state was ${actual}, expected ${expectation.value}.`);
      return;
    }
    case 'zone':
      expect(locateCard(context.state, refId!)?.zone === expectation.zone, `${expectation.ref} is in ${locateCard(context.state, refId!)?.zone ?? 'no zone'}, expected ${expectation.zone}.`);
      return;
    case 'zone-position': {
      const location = locateCard(context.state, refId!);
      expect(location?.zone === expectation.zone, `${expectation.ref} is in ${location?.zone ?? 'no zone'}, expected ${expectation.zone}.`);
      const cards = context.state.players[location.player][expectation.zone];
      const isWithinPosition = expectation.position === 'top'
        ? location.index < expectation.within
        : location.index >= cards.length - expectation.within;
      expect(isWithinPosition, `${expectation.ref} is at ${expectation.zone} index ${location.index}, expected within the ${expectation.position} ${expectation.within}.`);
      return;
    }
    case 'row':
      expect(locateCard(context.state, refId!)?.zone === expectation.row, `${expectation.ref} is in ${locateCard(context.state, refId!)?.zone ?? 'no row'}, expected ${expectation.row}.`);
      return;
    case 'zone-count-change': {
      const change = zoneCount(context.state, expectation.player, expectation.zone) - before.zoneCounts[`${expectation.player}:${expectation.zone}`];
      expect(change === expectation.amount, `Player ${expectation.player} ${expectation.zone} count changed by ${change}, expected ${expectation.amount}.`);
      return;
    }
    case 'modifier-total': {
      const total = modifierTotal(context.state, refId ?? null, expectation.player ?? null, expectation.modifier);
      expect(total === expectation.amount, `${expectation.modifier} total was ${total}, expected ${expectation.amount}.`);
      return;
    }
    case 'modifier': {
      const present = hasModifier(context.state, refId ?? null, expectation.player ?? null, expectation.modifier, expectation.text);
      expect(present === expectation.present, `${expectation.modifier} presence was ${present}, expected ${expectation.present}.`);
      return;
    }
    case 'last-damage':
      expect(context.state.lastRoll?.damage === expectation.amount, `Last attack dealt ${context.state.lastRoll?.damage ?? 'no'} Damage, expected ${expectation.amount}.`);
      return;
    case 'attached': {
      const equipmentId = requireRef(context, expectation.equipment);
      const equipmentLocation = locateCard(context.state, equipmentId);
      const equipment = equipmentLocation?.zone === 'utilities'
        ? context.state.players[equipmentLocation.player].utilities[equipmentLocation.index]
        : undefined;
      expect(equipment?.attachedTo === requireRef(context, expectation.unit), `${expectation.equipment} is not attached to ${expectation.unit}.`);
      return;
    }
    case 'attack-available':
      expect(availableAttacks(context.state, refId!).some(({ attack }) => attack.id === expectation.attackId) === expectation.present,
        `${expectation.attackId} availability did not equal ${expectation.present}.`);
      return;
    case 'energy-tapped-change': {
      const tapped = context.state.players[expectation.player].energies.filter(({ isTapped }) => isTapped).length;
      expect(tapped - before.tappedEnergy[expectation.player] === expectation.amount,
        `Tapped Energy changed by ${tapped - before.tappedEnergy[expectation.player]}, expected ${expectation.amount}.`);
      return;
    }
    case 'used-action': {
      const key = `${refId}:${expectation.abilityId}`;
      const used = context.state.usedActions[key] === context.state.players[locateCard(context.state, refId!)?.player ?? 0].turnCount;
      expect(used === expectation.used, `${expectation.abilityId} used state was ${used}, expected ${expectation.used}.`);
      return;
    }
    case 'log':
      expect(context.state.log.some((entry) => entry.message.includes(expectation.includes)), `Log does not include “${expectation.includes}”.`);
      return;
    case 'winner':
      expect(context.state.winner === expectation.player,
        `Winner was ${context.state.winner ?? 'none'}, expected ${expectation.player ?? 'none'}.`);
      return;
    case 'owner':
      expect(cardInstance(context.state, refId!)?.owner === expectation.player,
        `${expectation.ref} owner was ${cardInstance(context.state, refId!)?.owner ?? 'unset'}, expected Player ${expectation.player}.`);
      return;
    case 'attack-blocked': {
      const location = locateCard(context.state, refId!);
      expect(location && (location.zone === 'vanguard' || location.zone === 'backguard'), `${expectation.ref} is not a Unit in play.`);
      context.state.activePlayer = location.player;
      expect(availableAttacks(context.state, refId!)[0], `${expectation.ref} has no attack to test.`);
      const opponent = location.player === 0 ? 1 : 0;
      const targetIndex = context.state.players[opponent].vanguard.findIndex(Boolean);
      const blockedResult = useAttack(
        context.state,
        { player: location.player, row: location.zone, index: location.index },
        0,
        targetIndex >= 0 ? { player: opponent, row: 'vanguard', index: targetIndex } : null,
      );
      expect(Boolean(blockedResult.error), `${expectation.ref} was able to attack.`);
      if (expectation.includes) expect(blockedResult.error?.includes(expectation.includes),
        `Blocked-attack error "${blockedResult.error}" does not include "${expectation.includes}".`);
      return;
    }
    case 'remains-exhausted-next-turn': {
      const ended = endPlayerTurn(context.state);
      expect(!ended.error, `Could not end the current turn: ${ended.error}`);
      const nextActorTurn = runOpponentTurn(ended.state);
      const location = locateCard(nextActorTurn, refId!);
      expect(location?.zone === 'energies', `${expectation.ref} is not controlled as Energy on the next turn.`);
      expect(nextActorTurn.activePlayer === 0, 'The gameplay probe did not reach the next actor turn.');
      expect(nextActorTurn.players[location.player].energies[location.index].isTapped,
        `${expectation.ref} became Ready despite cannot-ready.`);
      return;
    }
    case 'error':
      expect(Boolean(error), 'Expected the action to fail, but it succeeded.');
      if (expectation.includes) expect(error?.includes(expectation.includes), `Error “${error}” does not include “${expectation.includes}”.`);
      return;
  }
}

export function runGameplayScenario(test: CardGameplayTest, scenario: GameplayScenario): void {
  const context = createScenarioContext(test.cardId, scenario);
  const before = snapshot(context);
  const random = randomForScenario(test.cardId, scenario);
  let result = performAction(test.cardId, scenario, context, random);
  context.state = result.state;
  if (scenario.action.kind === 'attack' && (scenario.action.surplus ?? 0) > 0) {
    expect(context.state.pendingChoice?.store === 'surplus-energy',
      `Expected a surplus-Energy choice, received ${context.state.pendingChoice?.store ?? 'no choice'}.`);
  }
  if (!result.error) {
    result = resolveChoices(
      context,
      scenario.choices ?? [],
      random,
      scenario.action.kind === 'attack' ? scenario.action.surplus ?? 0 : 0,
    );
    context.state = result.state;
  }
  const expectsError = scenario.expect.some(({ kind }) => kind === 'error');
  if (result.error && !expectsError) throw new Error(result.error);
  for (const expectation of scenario.expect) assertExpectation(expectation, context, before, result.error);
}
