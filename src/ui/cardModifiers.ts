import type { CardModifierInfo } from '../game/effectRuntime';

export type ModifierPolarity = 'buff' | 'debuff' | 'neutral';

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
export const signed = (value: number) => (value >= 0 ? `+${value}` : `${value}`);

export function presentModifier(mod: CardModifierInfo): { label: string; polarity: ModifierPolarity } {
  const amount = mod.amount ?? 0;
  switch (mod.kind) {
    case 'defense': return { label: `${signed(amount)} DEF`, polarity: amount >= 0 ? 'buff' : 'debuff' };
    case 'max-hp': return { label: `${signed(amount)} Max HP`, polarity: amount >= 0 ? 'buff' : 'debuff' };
    case 'attack-damage': return { label: `${signed(amount)} Attack Damage`, polarity: amount >= 0 ? 'buff' : 'debuff' };
    case 'attack-damage-taken': return { label: `${signed(amount)} Damage taken`, polarity: amount > 0 ? 'debuff' : 'buff' };
    case 'cannot-attack': return { label: 'Cannot Attack', polarity: 'debuff' };
    case 'cannot-rotate': return { label: 'Cannot Rotate', polarity: 'debuff' };
    case 'cannot-ready': return { label: 'Cannot Ready', polarity: 'debuff' };
    case 'condition-immunity': return { label: mod.text ? `Immune to ${capitalize(mod.text)}` : 'Condition immunity', polarity: 'buff' };
    case 'cannot-afflict-condition': return { label: mod.text ? `Cannot become ${capitalize(mod.text)}` : 'Condition-proof', polarity: 'buff' };
    case 'ignore-defense': return { label: 'Ignores Defense', polarity: 'buff' };
    case 'ignore-rotation-prevention': return { label: 'Ignores Rotation locks', polarity: 'buff' };
    case 'reroll-effect-die': return { label: 'Reroll Effect die', polarity: 'buff' };
    case 'add-card-type': return { label: mod.text ? `Also ${capitalize(mod.text)}` : 'Added card type', polarity: 'neutral' };
    default: return { label: mod.kind.replace(/-/g, ' '), polarity: 'neutral' };
  }
}

const DURATION_LABEL: Record<CardModifierInfo['duration'], string> = {
  'permanent': 'Permanent',
  'temporary': 'Temporary',
  'while-in-play': 'While in play',
  'attack': 'This attack',
};

export function durationLabel(mod: CardModifierInfo): string {
  return DURATION_LABEL[mod.duration];
}

// Numeric modifiers whose contributions stack: many sources sum into one net value.
const STACKING_KINDS = new Set<CardModifierInfo['kind']>([
  'defense', 'max-hp', 'attack-damage', 'attack-damage-taken',
]);

export interface ModifierSource {
  name: string;
  count: number;
}

export interface ModifierGroup {
  key: string;
  label: string;
  polarity: ModifierPolarity;
  duration: string;
  stacking: boolean;
  sources: readonly ModifierSource[];
}

/**
 * Collapses the raw modifier list into one badge per distinct effect:
 * stacking numeric effects (e.g. DEF) sum their sources into a single net value,
 * while non-stacking effects (e.g. "Also TCR") appear once regardless of how many
 * sources grant them. Every contributing card is attributed on the resulting badge.
 */
export function groupModifiers(mods: readonly CardModifierInfo[]): ModifierGroup[] {
  const order: string[] = [];
  const buckets = new Map<string, { representative: CardModifierInfo; amount: number; mods: CardModifierInfo[] }>();
  for (const mod of mods) {
    const stacking = STACKING_KINDS.has(mod.kind);
    const key = stacking
      ? `${mod.kind}|${mod.duration}`
      : `${mod.kind}|${mod.text ?? ''}|${mod.duration}`;
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { representative: mod, amount: 0, mods: [] };
      buckets.set(key, bucket);
      order.push(key);
    }
    bucket.amount += mod.amount ?? 0;
    bucket.mods.push(mod);
  }
  return order.map((key) => {
    const { representative, amount, mods: grouped } = buckets.get(key)!;
    const stacking = STACKING_KINDS.has(representative.kind);
    const { label, polarity } = presentModifier(stacking ? { ...representative, amount } : representative);
    const counts = new Map<string, number>();
    const names: string[] = [];
    for (const mod of grouped) {
      if (!counts.has(mod.sourceName)) names.push(mod.sourceName);
      counts.set(mod.sourceName, (counts.get(mod.sourceName) ?? 0) + 1);
    }
    return {
      key,
      label,
      polarity,
      duration: durationLabel(representative),
      stacking,
      sources: names.map((name) => ({ name, count: counts.get(name)! })),
    };
  });
}

export function describeSources(group: ModifierGroup): string {
  return group.sources
    .map(({ name, count }) => (group.stacking && count > 1 ? `${name} ×${count}` : name))
    .join(', ');
}

export interface ModifierSummary {
  buffs: number;
  debuffs: number;
  neutral: number;
  tooltip: string;
}

export function summarizeModifiers(mods: readonly CardModifierInfo[]): ModifierSummary {
  const groups = groupModifiers(mods);
  return {
    buffs: groups.filter(({ polarity }) => polarity === 'buff').length,
    debuffs: groups.filter(({ polarity }) => polarity === 'debuff').length,
    neutral: groups.filter(({ polarity }) => polarity === 'neutral').length,
    tooltip: groups.map(({ label }) => label).join(' · '),
  };
}
