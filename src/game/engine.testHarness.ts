import { CARD_CATALOG, getCard } from '../data/catalog';
import { createDeck, DECK_PRESETS, validateDeckPreset } from './deck';
import {
  activateAbility, availableAttacks, chooseEffect, createGame, endPlayerTurn, mulliganOpeningHand,
  playUnit, playUtility, useAttack,
} from './engine';
import { describeCardModifiers, modifierTotal, startEffects } from './effectRuntime';
import {
  addAllTestEnergy, addTestCondition, addTestEnergy, addTestUnit, createCleanTestState,
  deterministicRandom, populateTestZones, resolveAllTestChoices, testInstanceId,
} from './testing/gameFixture';

interface TestResult { name: string; passed: boolean; error?: string }

const id = testInstanceId;

function expect(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const cleanState = createCleanTestState;
const addUnit = addTestUnit;
const addCondition = addTestCondition;
const addEnergy = addTestEnergy;
const randomValues = deterministicRandom;
const addAllEnergy = addAllTestEnergy;
const resolveAllChoices = resolveAllTestChoices;
const populateEffectZones = populateTestZones;

function run(name: string, test: () => void): TestResult {
  try {
    test();
    return { name, passed: true };
  } catch (error) {
    return { name, passed: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export function runEngineSelfTests(): TestResult[] {
  return [
    run('builds fifteen legal 60-card presets and shuffles the entire deck', () => {
      expect(DECK_PRESETS.length === 15, 'Expected exactly fifteen deck presets');
      for (const preset of DECK_PRESETS) {
        validateDeckPreset(preset);
        const firstShuffle = createDeck(101, preset.id);
        const secondShuffle = createDeck(202, preset.id);
        expect(firstShuffle.length === 60, `${preset.name} did not create 60 cards`);
        expect(
          firstShuffle.map(({ cardId }) => cardId).join('|') !== secondShuffle.map(({ cardId }) => cardId).join('|'),
          `${preset.name} did not shuffle as a complete deck`,
        );
        expect(
          firstShuffle.slice(0, 7).map(({ cardId }) => cardId).join('|') !== secondShuffle.slice(0, 7).map(({ cardId }) => cardId).join('|'),
          `${preset.name} used a fixed opening hand`,
        );
      }
    }),
    run('deals seven cards and allows an opening mulligan of up to three', () => {
      const state = createGame();
      expect(state.players[0].hand.length === 7, 'Player did not receive seven opening cards');
      expect(state.players[1].hand.length === 7, 'Opponent did not receive seven opening cards');
      expect(state.players[0].deck.length === 53 && state.players[1].deck.length === 53, 'Opening deal did not leave 53-card decks');
      expect(state.pendingMulligan?.maxCards === 3, 'Opening mulligan did not allow up to three cards');

      const originalCards = [...state.players[0].hand, ...state.players[0].deck]
        .map(({ instanceId }) => instanceId).sort().join('|');
      const selected = state.players[0].hand.slice(0, 3).map(({ instanceId }) => instanceId);
      const result = mulliganOpeningHand(state, selected, randomValues(0.2));
      expect(!result.error, result.error ?? 'Opening mulligan failed');
      expect(result.state.pendingMulligan === null, 'Opening mulligan did not complete');
      expect(result.state.players[0].hand.length === 7, 'Mulligan changed the opening hand size');
      expect(result.state.players[0].deck.length === 53, 'Mulligan changed the deck size');
      const resultingCards = [...result.state.players[0].hand, ...result.state.players[0].deck]
        .map(({ instanceId }) => instanceId).sort().join('|');
      expect(resultingCards === originalCards, 'Mulligan lost or duplicated cards');
      expect(state.pendingMulligan !== null, 'Mulligan mutated the original state');

      const tooMany = mulliganOpeningHand(state, state.players[0].hand.slice(0, 4).map(({ instanceId }) => instanceId));
      expect(Boolean(tooMany.error?.includes('up to 3')), 'Mulligan accepted more than three cards');
    }),
    run('plays a scripted Unit and emits its generic played event', () => {
      const state = cleanState();
      const held = { instanceId: id('conscript'), cardId: '069-conscript' };
      state.players[0].hand.push(held);
      addEnergy(state, 0, 'gluon');
      const result = playUnit(state, { player: 0, row: 'vanguard', index: 0 }, held.instanceId);
      expect(!result.error, result.error ?? 'Unit play failed');
      expect(result.state.players[0].vanguard[0]?.cardId === held.cardId, 'Unit did not enter play');
      expect(result.state.players[0].energies[0].isTapped, 'Energy was not paid');
    }),
    run('resolves Critical d20, Defense Check, Damage, and Exhaustion', () => {
      const state = cleanState();
      const attacker = addUnit(state, 0, 'vanguard', 0, '069-conscript');
      const defender = addUnit(state, 1, 'vanguard', 0, '069-conscript');
      addEnergy(state, 0, 'gluon');
      const result = useAttack(
        state,
        { player: 0, row: 'vanguard', index: 0 },
        0,
        { player: 1, row: 'vanguard', index: 0 },
        randomValues(0.49, 0.62),
      );
      expect(!result.error, result.error ?? 'Attack failed');
      expect(result.state.players[1].vanguard[0]?.currentHp === 40, 'Expected 10 Attack Damage');
      expect(!result.state.players[0].vanguard[0]?.isReady, 'Attacker was not Exhausted');
      expect(
        result.state.lastRoll?.rolls.some(({ kind, value, outcome }) => kind === 'critical' && value === 10 && outcome === 'attack-normal')
          && result.state.lastRoll.rolls.some(({ kind, value, target, outcome }) => kind === 'defense' && value === 63 && target === 25 && outcome === 'defense-failure'),
        'Dice were not recorded',
      );
      expect(result.state.lastRoll?.combat?.attacker.instanceId === attacker, 'Combat roll omitted the attacking Unit');
      expect(result.state.lastRoll?.combat?.defender.name === 'Conscript', 'Combat roll omitted the defending Unit');
      expect(result.state.lastRoll?.combat?.attackName === 'Ordered Forward', 'Combat roll omitted the selected Attack');
      const attackFeed = result.state.log.find(({ kind }) => kind === 'attack');
      expect(attackFeed?.source?.instanceId === attacker, 'Rift Feed attack omitted its source card');
      expect(attackFeed?.target?.instanceId === defender, 'Rift Feed attack omitted its target card');
      expect(attackFeed?.action === 'Ordered Forward', 'Rift Feed attack omitted the selected Attack');
      const damageFeed = result.state.log.find(({ kind }) => kind === 'damage');
      expect(damageFeed?.source?.instanceId === attacker, 'Rift Feed Damage omitted its source card');
      expect(damageFeed?.target?.instanceId === defender, 'Rift Feed Damage omitted its target card');
      expect(damageFeed?.amount === 10, 'Rift Feed Damage omitted its amount');
      expect(result.state.players[0].vanguard[0]?.instanceId === attacker, 'Wrong attacker changed');
    }),
    run('keeps face-down Vanquished cards hidden and untargetable', () => {
      const state = cleanState();
      const hidden = { instanceId: id('hidden-vanquished'), cardId: '069-conscript' };
      state.players[0].hand.push(hidden);
      startEffects(state, 0, 'rules', [
        { op: 'move', cards: { zone: 'hand', controller: 'actor' }, to: 'vanquished', faceDown: true },
      ]);
      expect(state.players[0].vanquished[0]?.isFaceDown, 'Move did not preserve face-down state');
      startEffects(state, 0, hidden.instanceId, [
        { op: 'move', cards: 'source', to: 'hand-owner' },
      ]);
      expect(state.players[0].vanquished[0]?.instanceId === hidden.instanceId, 'An effect targeted a face-down Vanquished card');
      expect(state.players[0].hand.length === 0, 'A face-down Vanquished card was revealed by movement');

      const privacyState = cleanState();
      const privateUnit = addUnit(privacyState, 0, 'vanguard', 0, '069-conscript');
      startEffects(privacyState, 0, privateUnit, [
        { op: 'vanquish', target: 'source', faceDown: true },
      ]);
      const privateFeed = privacyState.log.find(({ kind }) => kind === 'vanquish');
      expect(privateFeed?.message === 'A card was Vanquished face down.', 'Face-down feed revealed the card name');
      expect(!privateFeed?.source?.cardId && !privateFeed?.target?.cardId, 'Face-down feed exposed card metadata');
      expect(privateFeed?.target?.name === 'Face-down card', 'Face-down feed omitted its hidden target marker');
    }),
    run('records an effect die for a non-damaging attack', () => {
      const state = cleanState();
      addUnit(state, 0, 'vanguard', 0, '019-lola-bunny');
      addEnergy(state, 0, 'electron');
      addEnergy(state, 0, 'gluon');
      const result = useAttack(state, { player: 0, row: 'vanguard', index: 0 }, 1, null, randomValues(0.5));
      const effectRoll = result.state.lastRoll?.rolls[0];
      expect(effectRoll?.kind === 'effect' && effectRoll.sides === 6 && effectRoll.value === 4 && effectRoll.outcome === 'effect-value', 'Effect die was not recorded');
    }),
    run('records effect, Critical, and Defense dice for a damaging DR attack', () => {
      const state = cleanState();
      addUnit(state, 0, 'vanguard', 0, '009-raiden');
      addUnit(state, 1, 'vanguard', 0, '069-conscript');
      addAllEnergy(state, 0);
      const result = useAttack(
        state,
        { player: 0, row: 'vanguard', index: 0 },
        1,
        { player: 1, row: 'vanguard', index: 0 },
        randomValues(0.5, 0.49, 0.62),
      );
      const rolls = result.state.lastRoll?.rolls ?? [];
      expect(
        rolls.length === 3
          && rolls[0].kind === 'effect' && rolls[0].sides === 10 && rolls[0].value === 6
          && rolls[1].kind === 'critical' && rolls[1].value === 10
          && rolls[2].kind === 'defense' && rolls[2].value === 63,
        'The complete DR attack roll was not recorded',
      );
    }),
    run('records a natural 1 as a failed combat roll', () => {
      const state = cleanState();
      addUnit(state, 0, 'vanguard', 0, '069-conscript');
      addUnit(state, 1, 'vanguard', 0, '069-conscript');
      addEnergy(state, 0, 'gluon');
      const result = useAttack(
        state,
        { player: 0, row: 'vanguard', index: 0 },
        0,
        { player: 1, row: 'vanguard', index: 0 },
        randomValues(0),
      );
      const lastRoll = result.state.lastRoll;
      expect(lastRoll !== null, 'Natural 1 roll was not recorded');
      expect(lastRoll.rolls.some(({ kind, value, outcome }) => kind === 'critical' && value === 1 && outcome === 'attack-failed'), 'Natural 1 was not recorded');
      expect(lastRoll.damage === 0, 'Failed attack recorded Damage');
      expect(result.state.players[1].vanguard[0]?.currentHp === 50, 'Failed attack dealt Damage');
    }),
    run('records when Weakened prevents a natural 20 Critical Hit', () => {
      const state = cleanState();
      const attacker = addUnit(state, 0, 'vanguard', 0, '069-conscript');
      addUnit(state, 1, 'vanguard', 0, '069-conscript');
      addCondition(state, attacker, 'weakened');
      addEnergy(state, 0, 'gluon');
      const result = useAttack(
        state,
        { player: 0, row: 'vanguard', index: 0 },
        0,
        { player: 1, row: 'vanguard', index: 0 },
        randomValues(0.999, 0.62),
      );
      expect(
        result.state.lastRoll?.rolls.some(({ kind, value, outcome }) => kind === 'critical' && value === 20 && outcome === 'critical-prevented'),
        'The prevented Critical Hit was not recorded',
      );
      expect(result.state.lastRoll?.damage === 10, 'Weakened incorrectly allowed the natural 20 to double Damage');
    }),
    run('pauses and resumes a generic card-target choice', () => {
      const state = cleanState();
      const cleaner = addUnit(state, 0, 'backguard', 0, '068-cleaning-droid');
      const target = addUnit(state, 0, 'vanguard', 0, '069-conscript');
      addCondition(state, target, 'cowering');
      addEnergy(state, 0, 'electron');
      const attack = useAttack(state, { player: 0, row: 'backguard', index: 0 }, 0, null, randomValues());
      expect(attack.state.pendingChoice?.options.some(({ id: optionId }) => optionId === target), 'Target prompt was not created');
      const resolved = chooseEffect(attack.state, [target]);
      expect(!resolved.error, resolved.error ?? 'Choice failed');
      expect(resolved.state.players[0].vanguard[0]?.conditions.length === 0, 'Condition was not removed');
      expect(resolved.state.players[0].backguard[0]?.instanceId === cleaner, 'Source moved unexpectedly');
    }),
    run('attaches Equipment and grants its Additional Attack', () => {
      const state = cleanState();
      const pilot = addUnit(state, 0, 'vanguard', 0, '078-pilot');
      const equipment = { instanceId: id('strike-gun'), cardId: '096-tcr-v02-strike-gun' };
      state.players[0].hand.push(equipment);
      addEnergy(state, 0, 'electron');
      addEnergy(state, 0, 'gluon');
      const played = playUtility(state, 0, equipment.instanceId);
      expect(played.state.pendingChoice?.options.some(({ id: optionId }) => optionId === pilot), 'Equipment target choice missing');
      const attached = chooseEffect(played.state, [pilot]);
      expect(attached.state.players[0].utilities[0]?.attachedTo === pilot, 'Equipment did not attach');
      expect(availableAttacks(attached.state, pilot).some(({ attack }) => attack.id === 'tcr-v02-aimed-burst'), 'Additional Attack was not granted');
    }),
    run('applies continuous auras without card-specific engine branches', () => {
      const state = cleanState();
      addUnit(state, 0, 'vanguard', 0, '008-jean-luc-picard');
      const ally = addUnit(state, 0, 'vanguard', 1, '078-pilot');
      expect(modifierTotal(state, ally, null, 'defense') === 10, 'TCR DEF aura was not applied');
    }),
    run('reports active buffs and debuffs on a card with their sources', () => {
      const state = cleanState();
      addUnit(state, 0, 'vanguard', 0, '008-jean-luc-picard');
      const ally = addUnit(state, 0, 'vanguard', 1, '078-pilot');
      startEffects(state, 0, ally, [
        { op: 'modifier', target: 'source', kind: 'attack-damage', amount: 20, duration: 'turn' },
      ]);
      const mods = describeCardModifiers(state, ally);
      const aura = mods.find(({ kind, origin }) => kind === 'defense' && origin === 'continuous');
      expect(aura?.amount === 10, 'Continuous DEF aura was not reported');
      expect(aura?.sourceName === getCard('008-jean-luc-picard').name, 'Aura did not name its source card');
      expect(aura?.duration === 'while-in-play', 'Continuous aura had the wrong duration');
      const runtime = mods.find(({ kind, origin }) => kind === 'attack-damage' && origin === 'runtime');
      expect(runtime?.amount === 20, 'Runtime buff was not reported');
      expect(runtime?.sourceInstanceId === ally && runtime.duration === 'temporary', 'Runtime buff omitted its source or duration');
      expect(describeCardModifiers(state, '008-jean-luc-picard').every(({ kind }) => kind !== 'attack-damage'), 'A buff leaked onto the wrong card');
    }),
    run('chains continuous type grants into other generic auras', () => {
      const state = cleanState();
      addUnit(state, 0, 'vanguard', 0, '008-jean-luc-picard');
      const xTremist = addUnit(state, 0, 'vanguard', 1, '034-bob-ross');
      state.players[0].utilities.push({ instanceId: id('contract'), cardId: '056-contract-with-the-tcr' });
      expect(modifierTotal(state, xTremist, null, 'defense') === 10, 'Granted TCR type did not feed Picard aura');
    }),
    run('enforces once-per-turn activated abilities', () => {
      const state = cleanState();
      const garen = addUnit(state, 0, 'vanguard', 0, '007-garen-crownguard');
      state.players[0].vanguard[0]!.currentHp = 100;
      const first = activateAbility(state, 0, garen, 'garen-crownguard-perseverance-1');
      expect(!first.error && first.state.players[0].vanguard[0]?.currentHp === 120, 'Ability did not heal');
      const second = activateAbility(first.state, 0, garen, 'garen-crownguard-perseverance-1');
      expect(Boolean(second.error), 'Once-per-turn ability was usable twice');
    }),
    run('fires attack-targeted triggers from JSON', () => {
      const state = cleanState();
      const attacker = addUnit(state, 0, 'vanguard', 0, '069-conscript');
      addUnit(state, 1, 'vanguard', 0, '001-admiral-asgore-dreemurr');
      addEnergy(state, 0, 'gluon');
      const result = useAttack(
        state,
        { player: 0, row: 'vanguard', index: 0 },
        0,
        { player: 1, row: 'vanguard', index: 0 },
        randomValues(0.5, 0.5),
      );
      const source = result.state.players[0].vanguard[0];
      expect(source?.instanceId === attacker && source.currentHp === 40, 'Weight of the Trident did not deal 10 Damage');
    }),
    run('opens and resolves a Free Effect reaction window', () => {
      const state = cleanState();
      state.activePlayer = 1;
      addUnit(state, 1, 'vanguard', 0, '069-conscript');
      const defender = addUnit(state, 0, 'vanguard', 0, '017-cyclops-tactician');
      const rearguard = addUnit(state, 0, 'backguard', 0, '069-conscript');
      addEnergy(state, 1, 'gluon');
      addEnergy(state, 0, 'muon');
      addEnergy(state, 0, 'photon');
      const escape = { instanceId: id('narrow-escape'), cardId: '093-narrow-escape' };
      state.players[0].hand.push(escape);
      const attack = useAttack(
        state,
        { player: 1, row: 'vanguard', index: 0 },
        0,
        { player: 0, row: 'vanguard', index: 0 },
        randomValues(0.5, 0.5),
      );
      expect(attack.state.pendingChoice?.options.some(({ id: optionId }) => optionId === escape.instanceId), 'Reaction was not offered');
      const escaped = chooseEffect(attack.state, [escape.instanceId]);
      expect(!escaped.error, escaped.error ?? 'Reaction failed');
      expect(escaped.state.players[0].backguard.some((unit) => unit?.instanceId === defender), 'Target did not Rotate');
      expect(escaped.state.players[0].backguard.find((unit) => unit?.instanceId === defender)?.currentHp === getCard('017-cyclops-tactician').hp, 'Failed attack dealt Damage');
      expect(escaped.state.players[0].vanguard.some((unit) => unit?.instanceId === rearguard), 'Empty Vanguard was not filled from the Backguard');
    }),
    run('resolves Infected at the generic start-of-turn condition phase', () => {
      const state = cleanState();
      state.players[1].hasTakenFirstTurn = false;
      const infected = addUnit(state, 1, 'vanguard', 0, '069-conscript');
      addCondition(state, infected, 'infected', 10);
      const ended = endPlayerTurn(state, randomValues(0.9));
      expect(!ended.error && ended.state.activePlayer === 1, 'Turn did not pass');
      expect(ended.state.players[1].vanguard[0]?.currentHp === 40, 'Infected did not deal its amount');
    }),
    run('finishes the turn transition after a Cursed target choice', () => {
      const state = cleanState();
      state.players[1].hasTakenFirstTurn = false;
      const cursed = addUnit(state, 0, 'vanguard', 0, '011-terra');
      const target = addUnit(state, 0, 'vanguard', 1, '069-conscript');
      addCondition(state, cursed, 'cursed');
      const ended = endPlayerTurn(state, randomValues(0.9));
      expect(ended.state.pendingChoice?.options.some(({ id: optionId }) => optionId === target), 'Cursed choice was not offered');
      const chosen = chooseEffect(ended.state, [target]);
      expect(chosen.state.activePlayer === 1 && chosen.state.pendingTurn === null, 'Turn transition did not resume');
      expect(chosen.state.players[0].vanguard[1]?.currentHp === 30, 'Cursed did not deal 20 Damage');
    }),
    run('dry-runs every printed Unit attack through the generic VM', () => {
      for (const card of CARD_CATALOG.filter(({ kind }) => kind === 'unit')) {
        for (let attackIndex = 0; attackIndex < card.attacks.length; attackIndex += 1) {
          const state = cleanState();
          const source = addUnit(state, 0, 'vanguard', 0, card.id);
          addUnit(state, 1, 'vanguard', 0, '069-conscript');
          addAllEnergy(state, 0);
          state.players[0].deck = Array.from({ length: 20 }, (_, index) => ({ instanceId: id('deck'), cardId: index % 2 ? '069-conscript' : '089-battle-medicine' }));
          state.players[1].deck = [...state.players[0].deck].map((held) => ({ ...held, instanceId: id('opponent-deck') }));
          const attack = card.attacks[attackIndex];
          const target = /^\d/.test(attack.damage) ? { player: 1 as const, row: 'vanguard' as const, index: 0 } : null;
          const result = useAttack(state, { player: 0, row: 'vanguard', index: 0 }, attackIndex, target, () => 0.6);
          expect(!result.error, card.id + '/' + attack.id + ': ' + result.error);
          resolveAllChoices(result.state);
          expect(Boolean(source), 'Source setup failed');
        }
      }
    }),
    run('dry-runs every Utility play script through the generic VM', () => {
      for (const card of CARD_CATALOG.filter(({ kind }) => kind === 'utility')) {
        const state = cleanState();
        populateEffectZones(state);
        addAllEnergy(state, 0);
        const held = { instanceId: id(card.id), cardId: card.id };
        state.players[0].hand.push(held);
        const result = playUtility(state, 0, held.instanceId);
        expect(!result.error, card.id + ': ' + result.error);
        resolveAllChoices(result.state);
      }
    }),
  ];
}
