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

export interface ModifierSummary {
  buffs: number;
  debuffs: number;
  neutral: number;
  tooltip: string;
}

export function summarizeModifiers(mods: readonly CardModifierInfo[]): ModifierSummary {
  const presented = mods.map(presentModifier);
  return {
    buffs: presented.filter(({ polarity }) => polarity === 'buff').length,
    debuffs: presented.filter(({ polarity }) => polarity === 'debuff').length,
    neutral: presented.filter(({ polarity }) => polarity === 'neutral').length,
    tooltip: presented.map(({ label }) => label).join(' · '),
  };
}
