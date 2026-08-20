import type { CardDefinition } from '../../game/types';
import type { CardEffectScript, EffectOperation } from '../../game/effectTypes';

const modules = import.meta.glob('./cards/**/*.json', { eager: true, import: 'default' }) as Record<string, CardEffectScript>;
const scripts = Object.values(modules);

export const EFFECT_SCRIPTS = new Map(scripts.map((script) => [script.cardId, script]));

const OPERATION_NAMES = new Set([
  'choose', 'choose-slots', 'move', 'modifier', 'draw', 'damage', 'heal', 'ready',
  'exhaust', 'rotate', 'vanquish', 'condition', 'remove-conditions', 'if', 'for-each',
  'roll', 'set-attack', 'prevent-vanquish', 'attach', 'reveal', 'shuffle', 'win', 'log',
  'add-completion',
]);

function validateOperations(cardId: string, operations: readonly EffectOperation[] | undefined, errors: string[]) {
  for (const operation of operations ?? []) {
    const name = (operation as { op?: unknown }).op;
    if (typeof name !== 'string' || !OPERATION_NAMES.has(name)) {
      errors.push(cardId + ': unknown effect operation ' + String(name));
      continue;
    }
    if (operation.op === 'if') {
      validateOperations(cardId, operation.then, errors);
      validateOperations(cardId, operation.else, errors);
    }
    if (operation.op === 'for-each') validateOperations(cardId, operation.effects, errors);
  }
}

export function getEffectScript(cardId: string): CardEffectScript {
  const script = EFFECT_SCRIPTS.get(cardId);
  if (!script) throw new Error(`Missing effect script for ${cardId}.`);
  return script;
}

export function validateEffectScripts(cards: readonly CardDefinition[]): void {
  const cardIds = new Set(cards.map(({ id }) => id));
  const errors: string[] = [];
  if (EFFECT_SCRIPTS.size !== scripts.length) errors.push('Duplicate cardId values exist in effect scripts');
  for (const script of scripts) {
    for (const ability of script.activated ?? []) {
      validateOperations(script.cardId, ability.costs, errors);
      validateOperations(script.cardId, ability.effects, errors);
    }
    for (const trigger of script.triggers ?? []) validateOperations(script.cardId, trigger.effects, errors);
    for (const attack of script.attacks ?? []) {
      validateOperations(script.cardId, attack.prepare, errors);
      validateOperations(script.cardId, attack.effects, errors);
      validateOperations(script.cardId, attack.afterDamage, errors);
    }
    validateOperations(script.cardId, script.utility?.effects, errors);
    if (script.version !== 1) errors.push(`${script.cardId}: unsupported script version ${String(script.version)}`);
    if (!cardIds.has(script.cardId)) errors.push(`${script.cardId}: script does not match a catalog card`);
  }
  for (const card of cards) {
    const script = EFFECT_SCRIPTS.get(card.id);
    if (!script) {
      errors.push(`${card.id}: missing JSON effect script`);
      continue;
    }
    const scriptedAbilities = new Set(script.activated?.map(({ id }) => id));
    const triggeredAbilities = new Set(script.triggers?.map(({ id }) => id));
    const continuousAbilities = new Set(script.continuous?.map(({ id }) => id));
    for (const ability of card.abilities) {
      if (!scriptedAbilities.has(ability.id) && !triggeredAbilities.has(ability.id) && !continuousAbilities.has(ability.id)) {
        errors.push(`${card.id}: ability ${ability.id} has no executable script`);
      }
    }
    const attacks = new Set(script.attacks?.map(({ id }) => id));
    for (const attack of card.attacks) {
      if (!attacks.has(attack.id)) errors.push(`${card.id}: attack ${attack.id} has no executable script`);
    }
    if (card.utilityAttack?.name && !attacks.has(card.utilityAttack.id)) {
      errors.push(`${card.id}: Additional Attack ${card.utilityAttack.id} has no executable script`);
    }
    if (card.kind === 'utility' && !script.utility) errors.push(`${card.id}: Utility has no play script`);
    if (card.kind === 'energy' && !script.energy) errors.push(`${card.id}: Energy has no play script`);
  }
  if (errors.length) throw new Error(`Effect script validation failed:\n${errors.join('\n')}`);
}
