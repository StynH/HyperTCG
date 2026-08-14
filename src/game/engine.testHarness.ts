import { CARD_CATALOG, getCard } from '../data/catalog';
import { activateAbility, availableAttacks, chooseEffect, endPlayerTurn, playUnit, playUtility, useAttack } from './engine';
import { modifierTotal } from './effectRuntime';
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
      addUnit(state, 1, 'vanguard', 0, '069-conscript');
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
      expect(result.state.lastRoll?.attack === 10 && result.state.lastRoll.defense === 63, 'Dice were not recorded');
      expect(result.state.players[0].vanguard[0]?.instanceId === attacker, 'Wrong attacker changed');
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
      expect(result.state.lastRoll?.attack === 1, 'Natural 1 was not recorded');
      expect(result.state.lastRoll.damage === 0, 'Failed attack recorded Damage');
      expect(result.state.players[1].vanguard[0]?.currentHp === 50, 'Failed attack dealt Damage');
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
