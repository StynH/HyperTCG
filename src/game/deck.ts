import { CARD_BY_ID, getCard } from '../data/catalog';
import type { CardInstance, EnergyType } from './types';

export interface DeckPreset {
  id: string;
  name: string;
  faction: string;
  archetype: string;
  tagline: string;
  description: string;
  gamePlan: readonly string[];
  complexity: 1 | 2 | 3;
  featuredCardIds: readonly [string, string, string];
  entries: readonly (readonly [cardId: string, count: number])[];
}

export const DECK_PRESETS: readonly DeckPreset[] = [
  {
    id: 'compliance-order',
    name: 'Compliance Order',
    faction: 'Combine',
    archetype: 'Infantry aggro',
    tagline: 'Mark them. Then break them.',
    description: 'A Gluon-Electron Combine curve that opens with cheap Infantry, staples Conditions onto the defenders, and cashes Dr. Breen’s Overwatch Command for bonus Damage on every marked target.',
    gamePlan: ['Play an Infantry Unit on turn one and never stop', 'Apply Cowering and Paralyzed with Stun Baton and Overwatch Directive', 'Convert marked Units into extra Damage through Ordinal and Dr. Breen'],
    complexity: 1,
    featuredCardIds: ['006-dr-breen', '021-ordinal', '095-stun-baton'],
    entries: [
      ['069-conscript', 3], ['075-metrocop', 3], ['085-soldier', 3], ['073-guard', 3],
      ['037-elite', 2], ['021-ordinal', 3], ['006-dr-breen', 2], ['048-sniper', 3], ['082-scanner', 2],
      ['095-stun-baton', 3], ['094-pulse-rifle', 2], ['062-overwatch-directive', 2],
      ['063-suppressing-fire', 3], ['030-splinter-groups', 2], ['057-incoming-warning', 2],
      ['energy-gluon', 14], ['energy-electron', 8],
    ],
  },
  {
    id: 'salvage-yard',
    name: 'Salvage Yard',
    faction: 'Machine',
    archetype: 'Machine value',
    tagline: 'Nothing here is ever really scrapped.',
    description: 'An Electron-Boson Machine network that digs with droids, repairs with Engineer, and rebuilds anything it loses through Retrieval Machine and Transport Droid.',
    gamePlan: ['Chain droid search attacks to hit every land drop and threat', 'Accelerate off Energy Reactor once the board is stable', 'Armor up a repaired Machine and grind out every trade'],
    complexity: 2,
    featuredCardIds: ['039-engineer', '079-retrieval-machine', '090-deploy-armor'],
    entries: [
      ['068-cleaning-droid', 2], ['074-junk-droid', 2], ['083-scout-droid', 3], ['082-scanner', 2],
      ['076-mining-droid', 3], ['039-engineer', 3], ['052-tech-specialist', 3], ['051-stewie-griffin', 2],
      ['079-retrieval-machine', 2], ['080-rover', 2], ['087-transport-droid', 2],
      ['090-deploy-armor', 3], ['028-energy-reactor', 3], ['092-keltec-pr57', 3], ['057-incoming-warning', 2],
      ['energy-electron', 15], ['energy-boson', 8],
    ],
  },
  {
    id: 'cold-procession',
    name: 'Cold Procession',
    faction: 'Spectres',
    archetype: 'Condition control',
    tagline: 'Nothing you play gets to act.',
    description: 'A Neutrino control shell where hard-to-kill Spectres hold the Vanguard while Suppression Protocol, Citadel, and Transhuman Conditioning strip the opponent of every clean turn.',
    gamePlan: ['Trade nothing early — let 55 DEF Spectres absorb the first attacks', 'Paralyze and Weaken the two Units that matter', 'Take over with Xehanort once their hand is empty'],
    complexity: 3,
    featuredCardIds: ['012-xehanort', '031-suppression-protocol', '046-observing-spectre'],
    entries: [
      ['036-disaster-spectre', 3], ['046-observing-spectre', 3], ['018-ebony-maw', 3], ['049-stalker', 3],
      ['048-sniper', 3], ['082-scanner', 2], ['012-xehanort', 2], ['043-marksman', 2], ['054-vale', 2],
      ['031-suppression-protocol', 3], ['013-citadel', 2], ['064-transhuman-conditioning', 2],
      ['062-overwatch-directive', 2], ['057-incoming-warning', 2], ['059-inter-hyperversal-space', 2],
      ['energy-neutrino', 11], ['energy-electron', 8], ['energy-gluon', 5],
    ],
  },
  {
    id: 'common-cause',
    name: 'Common Cause',
    faction: 'X-Tremists',
    archetype: 'Tempo swarm',
    tagline: 'Four of us is a movement.',
    description: 'A Photon-Muon tempo deck that races to four X-Tremists, where Planet N8318, Barack Obama, and Cyclops turn a board of two-drops into an unattackable, untradeable wall of pressure.',
    gamePlan: ['Deploy three cheap X-Tremists by turn three', 'Turn on the +20 DEF and +10 Damage bonuses', 'Refuse every removal attempt with Narrow Escape, then swing with X-Tremists Unite'],
    complexity: 2,
    featuredCardIds: ['004-cyclops-super', '029-planet-n8318', '015-x-tremists-unite'],
    entries: [
      ['034-bob-ross', 3], ['038-eminem', 3], ['023-squidward', 3], ['045-murdoc-niccals', 3],
      ['017-cyclops-tactician', 3], ['003-barack-obama', 3], ['004-cyclops-super', 2], ['053-tupac', 2],
      ['029-planet-n8318', 3], ['056-contract-with-the-tcr', 3], ['093-narrow-escape', 3],
      ['015-x-tremists-unite', 3], ['055-clearmind', 2],
      ['energy-photon', 11], ['energy-muon', 7], ['energy-gluon', 6],
    ],
  },
  {
    id: 'due-process',
    name: 'Due Process',
    faction: 'TCR',
    archetype: 'Toolbox midrange',
    tagline: 'There is a procedure for you.',
    description: 'The most consistent deck in the archive: two colors, a low curve, and eleven cards that search or draw, so the TCR answer you need is always the next card off the top.',
    gamePlan: ['Search early with Splinter Groups and Mark Rutte', 'Trade efficiently while Lawmaker denies their repositioning', 'Refuse the blowout with Zero Hour and Incoming Warning'],
    complexity: 2,
    featuredCardIds: ['020-mark-rutte', '030-splinter-groups', '016-zero-hour'],
    entries: [
      ['020-mark-rutte', 3], ['042-lawmaker', 3], ['033-antonije-pusic', 2], ['019-lola-bunny', 3],
      ['088-trooper', 3], ['043-marksman', 3], ['054-vale', 3], ['052-tech-specialist', 2], ['066-andy-king', 2],
      ['030-splinter-groups', 3], ['016-zero-hour', 2], ['057-incoming-warning', 3],
      ['096-tcr-v02-strike-gun', 3], ['063-suppressing-fire', 2],
      ['energy-gluon', 13], ['energy-electron', 10],
    ],
  },
  {
    id: 'weight-of-steel',
    name: 'Weight of Steel',
    faction: 'Wardens',
    archetype: 'Heavyweight defense',
    tagline: 'Outlast, then step forward.',
    description: 'A Gluon-Boson wall of oversized HP and DEF that armors up, clears the Vanguard with Suppressing Fire, and lands Garen Crownguard once the aggression has burned out.',
    gamePlan: ['Block the first four turns behind Guard and Rover', 'Bolt Deploy Armor onto anything that survived', 'Close with Garen or Asgore while Perseverance repairs the damage'],
    complexity: 1,
    featuredCardIds: ['007-garen-crownguard', '073-guard', '090-deploy-armor'],
    entries: [
      ['073-guard', 3], ['072-grunt', 3], ['084-sentry', 3], ['080-rover', 3], ['076-mining-droid', 3],
      ['071-desert-droid', 2], ['087-transport-droid', 2], ['086-soldier-tf2', 2],
      ['007-garen-crownguard', 2], ['001-admiral-asgore-dreemurr', 1],
      ['090-deploy-armor', 3], ['092-keltec-pr57', 3], ['063-suppressing-fire', 3],
      ['095-stun-baton', 2], ['030-splinter-groups', 2],
      ['energy-gluon', 12], ['energy-boson', 11],
    ],
  },
  {
    id: 'neighborhood-watch',
    name: 'Neighborhood Watch',
    faction: 'Citizens',
    archetype: 'Go-wide value',
    tagline: 'Small people. Large numbers.',
    description: 'One-cost Citizens flood both rows and draw their replacements, then Geert Wilders and Lawmaker turn a board of civilians into a legal, well-armed problem.',
    gamePlan: ['Deploy two Citizens a turn and draw off Andy King and Salesman', 'Switch on the Wilders bonus for +10 Damage and +10 DEF across the board', 'Heal through removal with Battle Medicine and Clearmind'],
    complexity: 1,
    featuredCardIds: ['040-geert-wilders', '066-andy-king', '089-battle-medicine'],
    entries: [
      ['067-civilian', 3], ['066-andy-king', 3], ['065-2d', 3], ['081-salesman', 3],
      ['034-bob-ross', 3], ['040-geert-wilders', 3], ['053-tupac', 3], ['042-lawmaker', 3],
      ['092-keltec-pr57', 3], ['089-battle-medicine', 3], ['055-clearmind', 2],
      ['030-splinter-groups', 3], ['063-suppressing-fire', 2],
      ['energy-photon', 12], ['energy-gluon', 11],
    ],
  },
  {
    id: 'firing-solution',
    name: 'Firing Solution',
    faction: 'Infiltrators',
    archetype: 'Backguard reach',
    tagline: 'The front row was never the target.',
    description: 'An Electron-Muon strike package that attacks from the Backguard, equips Oblique Blade and Strike Gun for extra reach, and answers Backguard engines with Infiltration Strike.',
    gamePlan: ['Set up Sniper and Marksman behind a cheap front line', 'Equip for a second attack every turn', 'Snipe their support Units before they ever act'],
    complexity: 3,
    featuredCardIds: ['048-sniper', '026-yoko-littner', '060-oblique-blade'],
    entries: [
      ['048-sniper', 3], ['043-marksman', 3], ['026-yoko-littner', 3], ['078-pilot', 3],
      ['054-vale', 3], ['023-squidward', 3], ['083-scout-droid', 2], ['051-stewie-griffin', 2], ['050-stanley-pines', 2],
      ['060-oblique-blade', 3], ['096-tcr-v02-strike-gun', 3], ['058-infiltration-strike', 3],
      ['057-incoming-warning', 2], ['032-zephyr-strike', 2],
      ['energy-electron', 14], ['energy-muon', 9],
    ],
  },
  {
    id: 'full-contact',
    name: 'Full Contact',
    faction: 'X-Perience',
    archetype: 'Bruiser aggro',
    tagline: 'Math is for the defense.',
    description: 'A Boson-Muon beatdown deck with the lowest curve in the archive, stacking One Punch, Bruiser bonuses, and Soldier’s Infantry command into single attacks nothing survives.',
    gamePlan: ['Discount your Bruisers with Kramer and curve out', 'Stack One Punch and Motu’s Samosa Surge on one attacker', 'Ready the team with Copycats for a second lethal swing'],
    complexity: 1,
    featuredCardIds: ['022-patlu', '061-one-punch', '103-lucille-de-labora'],
    entries: [
      ['041-kramer', 3], ['044-motu', 3], ['022-patlu', 3], ['047-peter-griffin', 3],
      ['070-demoman', 3], ['077-norm-of-the-north', 3], ['086-soldier-tf2', 3],
      ['010-soldier-tf2-super', 2], ['103-lucille-de-labora', 1],
      ['061-one-punch', 3], ['027-copycats', 3], ['090-deploy-armor', 3],
      ['091-herring-bandito', 2], ['092-keltec-pr57', 2],
      ['energy-boson', 14], ['energy-muon', 9],
    ],
  },
  {
    id: 'open-the-gate',
    name: 'Open the Gate',
    faction: 'Hyperverse',
    archetype: 'Six-domain ramp',
    tagline: 'Every domain. One doorway.',
    description: 'The greediest build in the archive: Mining Droid and Energy Reactor assemble all six Energy types, Hyperversal Gate drops two legends at once, and The Master of Puppets waits for the collapse.',
    gamePlan: ['Fix Energy with Mining Droid and dig with the droid suite', 'Double your Energy drops with Energy Reactor', 'Slam Hyperversal Gate, then win with legends or steal five Energy'],
    complexity: 3,
    featuredCardIds: ['014-hyperversal-gate', '105-the-master-of-puppets', '076-mining-droid'],
    entries: [
      ['076-mining-droid', 3], ['083-scout-droid', 2], ['082-scanner', 2], ['066-andy-king', 3],
      ['020-mark-rutte', 3], ['005-donald-trump', 2], ['011-terra', 2], ['002-apocalypse', 2],
      ['012-xehanort', 1], ['009-raiden', 1], ['008-jean-luc-picard', 1], ['105-the-master-of-puppets', 1],
      ['014-hyperversal-gate', 3], ['028-energy-reactor', 3], ['030-splinter-groups', 2],
      ['089-battle-medicine', 2], ['055-clearmind', 1], ['092-keltec-pr57', 2],
      ['energy-gluon', 6], ['energy-electron', 5], ['energy-boson', 5],
      ['energy-neutrino', 3], ['energy-photon', 3], ['energy-muon', 2],
    ],
  },
  {
    id: 'house-advantage',
    name: 'House Advantage',
    faction: 'Rogues',
    archetype: 'Dice tempo',
    tagline: 'Roll again. I insist.',
    description: 'The only deck built on effect dice: every attacker scales with its roll, Bob Ross rerolls the bad ones, and Squidward the Mercenary turns spare Muon Energy into a toll on every Unit they deploy.',
    gamePlan: ['Land Bob Ross early so no roll is ever wasted', 'Attack with 10x[DR] weapons and Herring Bandito for unfair spikes', 'Hold Muon Energy to snipe their Vanguard plays with the Mercenary'],
    complexity: 2,
    featuredCardIds: ['104-squidward-mercenary', '034-bob-ross', '091-herring-bandito'],
    entries: [
      ['034-bob-ross', 3], ['023-squidward', 3], ['045-murdoc-niccals', 3], ['038-eminem', 3],
      ['070-demoman', 3], ['053-tupac', 3], ['081-salesman', 3], ['050-stanley-pines', 2],
      ['104-squidward-mercenary', 1],
      ['091-herring-bandito', 3], ['092-keltec-pr57', 3], ['093-narrow-escape', 3],
      ['089-battle-medicine', 2], ['055-clearmind', 2],
      ['energy-photon', 10], ['energy-muon', 8], ['energy-boson', 5],
    ],
  },
] as const;

export const DEFAULT_DECK_ID = DECK_PRESETS[0].id;

let instanceSequence = 0;

function makeInstance(cardId: string): CardInstance {
  return { cardId, instanceId: `${cardId}-${++instanceSequence}` };
}

function seededShuffle<T>(values: readonly T[], seed: number): T[] {
  const items = [...values];
  let value = seed;
  for (let index = items.length - 1; index > 0; index -= 1) {
    value = (value * 1664525 + 1013904223) >>> 0;
    const target = value % (index + 1);
    [items[index], items[target]] = [items[target], items[index]];
  }
  return items;
}

export function getDeckPreset(deckId: string): DeckPreset {
  const preset = DECK_PRESETS.find(({ id }) => id === deckId);
  if (!preset) throw new Error(`Unknown deck preset: ${deckId}`);
  return preset;
}

export function getDeckEnergyCounts(preset: DeckPreset): Partial<Record<EnergyType, number>> {
  return Object.fromEntries(
    preset.entries
      .filter(([cardId]) => getCard(cardId).kind === 'energy')
      .map(([cardId, count]) => [getCard(cardId).energyType, count]),
  );
}

export function getDeckCardCount(preset: DeckPreset, kind?: 'unit' | 'utility' | 'energy'): number {
  return preset.entries.reduce((total, [cardId, count]) => (
    !kind || getCard(cardId).kind === kind ? total + count : total
  ), 0);
}

export function getOpponentDeckId(playerDeckId: string): string {
  const playerIndex = DECK_PRESETS.findIndex(({ id }) => id === playerDeckId);
  if (playerIndex < 0) throw new Error(`Unknown deck preset: ${playerDeckId}`);
  return DECK_PRESETS[(playerIndex + 5) % DECK_PRESETS.length].id;
}

export function validateDeckPreset(preset: DeckPreset): void {
  const seen = new Set<string>();
  let total = 0;
  let alternativeCount = 0;

  for (const [cardId, count] of preset.entries) {
    const card = CARD_BY_ID.get(cardId);
    if (!card) throw new Error(`${preset.name} references missing card ${cardId}.`);
    if (seen.has(cardId)) throw new Error(`${preset.name} lists ${cardId} more than once.`);
    if (!Number.isInteger(count) || count < 1) throw new Error(`${preset.name} has an invalid count for ${cardId}.`);
    if (card.kind !== 'energy' && count > 3) throw new Error(`${preset.name} exceeds the 3-copy limit for ${card.name}.`);
    if (card.unitTreatment === 'alternative') alternativeCount += count;
    seen.add(cardId);
    total += count;
  }

  if (total !== 60) throw new Error(`${preset.name} contains ${total} cards instead of 60.`);
  if (alternativeCount > 1) throw new Error(`${preset.name} contains more than 1 Alternative card.`);
}

export function createDeck(seed: number, deckId = DEFAULT_DECK_ID): CardInstance[] {
  const preset = getDeckPreset(deckId);
  const deck = preset.entries.flatMap(([cardId, count]) => (
    Array.from({ length: count }, () => makeInstance(cardId))
  ));
  return seededShuffle(deck, seed);
}

const deckIds = new Set<string>();
for (const preset of DECK_PRESETS) {
  if (deckIds.has(preset.id)) throw new Error(`Duplicate deck preset id: ${preset.id}`);
  deckIds.add(preset.id);
  validateDeckPreset(preset);
}
