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
    id: 'iron-advance',
    name: 'The Iron Advance',
    faction: 'Combine',
    archetype: 'Infantry swarm',
    tagline: 'One order. One formation. No retreat.',
    description: 'Flood the Vanguard with cheap Infantry, then turn every body into a threat through layered command bonuses.',
    gamePlan: ['Establish three Infantry quickly', 'Stack Dr. Breen, Ordinal, and Citadel bonuses', 'Break wide boards with suppressive damage'],
    complexity: 1,
    featuredCardIds: ['006-dr-breen', '085-soldier', '013-citadel'],
    entries: [
      ['069-conscript', 3], ['075-metrocop', 3], ['085-soldier', 3], ['073-guard', 3], ['037-elite', 3],
      ['021-ordinal', 2], ['006-dr-breen', 2], ['010-soldier-tf2-super', 1], ['002-apocalypse', 1],
      ['013-citadel', 2], ['031-suppression-protocol', 3], ['062-overwatch-directive', 2],
      ['064-transhuman-conditioning', 2], ['094-pulse-rifle', 2], ['095-stun-baton', 2], ['063-suppressing-fire', 2],
      ['energy-gluon', 12], ['energy-electron', 6], ['energy-boson', 4], ['energy-neutrino', 2],
    ],
  },
  {
    id: 'citadel-lock',
    name: 'Citadel Lock',
    faction: 'Combine',
    archetype: 'Control',
    tagline: 'The board moves only when you permit it.',
    description: 'A defensive Combine shell that rotates, Exhausts, and Conditions enemy Units while durable engines take over the long game.',
    gamePlan: ['Build an untouchable Backguard command line', 'Paralyze or Rotate key attackers', 'Win through superior DEF and inevitability'],
    complexity: 3,
    featuredCardIds: ['012-xehanort', '018-ebony-maw', '031-suppression-protocol'],
    entries: [
      ['006-dr-breen', 3], ['012-xehanort', 2], ['018-ebony-maw', 3], ['021-ordinal', 3],
      ['035-cremator', 2], ['036-disaster-spectre', 2], ['048-sniper', 2], ['049-stalker', 2],
      ['082-scanner', 3], ['001-admiral-asgore-dreemurr', 1], ['002-apocalypse', 2],
      ['013-citadel', 3], ['031-suppression-protocol', 3], ['062-overwatch-directive', 3],
      ['064-transhuman-conditioning', 3], ['059-inter-hyperversal-space', 2],
      ['energy-gluon', 8], ['energy-electron', 7], ['energy-neutrino', 6],
    ],
  },
  {
    id: 'rebel-frequency',
    name: 'Rebel Frequency',
    faction: 'X-Tremists',
    archetype: 'Tempo',
    tagline: 'Change the angle. Steal the turn.',
    description: 'A mobile X-Tremists deck that weaponizes Rotation, Cowering, and Ready effects to create explosive tempo swings.',
    gamePlan: ['Develop cheap utility Units', 'Protect momentum with Narrow Escape', 'Chain Readies into an X-Tremists Unite finisher'],
    complexity: 2,
    featuredCardIds: ['004-cyclops-super', '034-bob-ross', '015-x-tremists-unite'],
    entries: [
      ['003-barack-obama', 3], ['004-cyclops-super', 1], ['017-cyclops-tactician', 3], ['023-squidward', 3],
      ['034-bob-ross', 3], ['038-eminem', 3], ['045-murdoc-niccals', 3], ['019-lola-bunny', 2],
      ['054-vale', 1], ['026-yoko-littner', 1],
      ['015-x-tremists-unite', 3], ['029-planet-n8318', 3], ['056-contract-with-the-tcr', 3],
      ['093-narrow-escape', 3], ['058-infiltration-strike', 2], ['027-copycats', 2],
      ['energy-photon', 7], ['energy-muon', 7], ['energy-gluon', 5], ['energy-electron', 2],
    ],
  },
  {
    id: 'republic-vanguard',
    name: 'Republic Vanguard',
    faction: 'TCR',
    archetype: 'Midrange command',
    tagline: 'Prepared answers. Decisive force.',
    description: 'The TCR toolbox pairs efficient Units with deep Utility access, protection, and combat tricks for a reliable answer to every board.',
    gamePlan: ['Tutor the right Utility for the matchup', 'Protect the formation with Free Effects', 'Ready a premium attacker for a decisive second strike'],
    complexity: 2,
    featuredCardIds: ['008-jean-luc-picard', '020-mark-rutte', '016-zero-hour'],
    entries: [
      ['007-garen-crownguard', 1], ['008-jean-luc-picard', 1], ['011-terra', 1], ['019-lola-bunny', 2],
      ['020-mark-rutte', 3], ['033-antonije-pusic', 2], ['042-lawmaker', 3], ['043-marksman', 2],
      ['052-tech-specialist', 2], ['054-vale', 2], ['078-pilot', 2], ['088-trooper', 3],
      ['016-zero-hour', 2], ['030-splinter-groups', 3], ['032-zephyr-strike', 2],
      ['057-incoming-warning', 3], ['060-oblique-blade', 2], ['096-tcr-v02-strike-gun', 3],
      ['energy-gluon', 7], ['energy-electron', 7], ['energy-photon', 3], ['energy-boson', 2], ['energy-neutrino', 2],
    ],
  },
  {
    id: 'machine-loop',
    name: 'Machine Loop',
    faction: 'Machine',
    archetype: 'Engine combo',
    tagline: 'Recover. Recalibrate. Repeat.',
    description: 'A recursive Machine network that accelerates Energy, repairs its board, and converts small utility bodies into relentless value.',
    gamePlan: ['Ramp with Mining Droid and Energy Reactor', 'Cycle Machines through Salvage effects', 'Overclock an armored threat to close'],
    complexity: 3,
    featuredCardIds: ['039-engineer', '076-mining-droid', '028-energy-reactor'],
    entries: [
      ['039-engineer', 3], ['052-tech-specialist', 3], ['068-cleaning-droid', 2], ['071-desert-droid', 2],
      ['074-junk-droid', 2], ['076-mining-droid', 2], ['079-retrieval-machine', 2], ['080-rover', 2],
      ['082-scanner', 2], ['083-scout-droid', 2], ['084-sentry', 2], ['087-transport-droid', 2], ['051-stewie-griffin', 2],
      ['028-energy-reactor', 3], ['090-deploy-armor', 3], ['092-keltec-pr57', 2], ['063-suppressing-fire', 2],
      ['energy-electron', 10], ['energy-boson', 8], ['energy-gluon', 4],
    ],
  },
  {
    id: 'peoples-champion',
    name: "People's Champion",
    faction: 'Citizens',
    archetype: 'Go-wide value',
    tagline: 'Ordinary lives. Extraordinary numbers.',
    description: 'Cheap Citizens draw, filter, heal, and grow under Geert Wilders while cross-faction contracts unlock powerful TCR support.',
    gamePlan: ['Fill both rows with efficient Citizens', 'Turn card flow into a deep bench', 'Use global DEF and Equipment to outlast removal'],
    complexity: 1,
    featuredCardIds: ['040-geert-wilders', '067-civilian', '056-contract-with-the-tcr'],
    entries: [
      ['040-geert-wilders', 3], ['034-bob-ross', 3], ['041-kramer', 3], ['065-2d', 3],
      ['066-andy-king', 3], ['067-civilian', 3], ['081-salesman', 3], ['050-stanley-pines', 2], ['019-lola-bunny', 2],
      ['056-contract-with-the-tcr', 3], ['030-splinter-groups', 3], ['055-clearmind', 2],
      ['089-battle-medicine', 2], ['091-herring-bandito', 3], ['090-deploy-armor', 1],
      ['energy-photon', 7], ['energy-gluon', 6], ['energy-muon', 4], ['energy-electron', 2], ['energy-boson', 2],
    ],
  },
  {
    id: 'heavy-hitters',
    name: 'Heavy Hitters',
    faction: 'Bruisers',
    archetype: 'Aggro',
    tagline: 'Every attack is a closing argument.',
    description: 'A Boson-heavy beatdown deck built around Bruiser bonuses, oversized attacks, and enough healing to win the damage race.',
    gamePlan: ['Curve directly into hard-hitting Bruisers', 'Stack One Punch with native Damage bonuses', 'Spend surplus Boson Energy on Lucille’s finisher'],
    complexity: 1,
    featuredCardIds: ['103-lucille-de-labora', '022-patlu', '061-one-punch'],
    entries: [
      ['022-patlu', 3], ['044-motu', 3], ['047-peter-griffin', 3], ['077-norm-of-the-north', 3],
      ['002-apocalypse', 2], ['010-soldier-tf2-super', 2], ['001-admiral-asgore-dreemurr', 1],
      ['070-demoman', 3], ['086-soldier-tf2', 3], ['103-lucille-de-labora', 1],
      ['061-one-punch', 3], ['090-deploy-armor', 3], ['089-battle-medicine', 3],
      ['063-suppressing-fire', 3], ['092-keltec-pr57', 2], ['055-clearmind', 2],
      ['energy-boson', 9], ['energy-muon', 5], ['energy-neutrino', 2], ['energy-gluon', 2], ['energy-photon', 2],
    ],
  },
  {
    id: 'grave-signal',
    name: 'Grave Signal',
    faction: 'Spectres',
    archetype: 'Attrition',
    tagline: 'The Vanquished Pile answers back.',
    description: 'Spectres turn losses into recursion while Neutrino control effects Infect, Curse, and exhaust the opposing formation.',
    gamePlan: ['Seed the Vanquished Pile with Spectres', 'Blank attacks through Conditions and control', 'Return threats until Retribution becomes lethal'],
    complexity: 3,
    featuredCardIds: ['025-vengeful-spectre', '036-disaster-spectre', '105-the-master-of-puppets'],
    entries: [
      ['025-vengeful-spectre', 3], ['036-disaster-spectre', 3], ['046-observing-spectre', 3],
      ['012-xehanort', 3], ['018-ebony-maw', 3], ['024-sylas', 3], ['048-sniper', 3],
      ['049-stalker', 3], ['050-stanley-pines', 1], ['051-stewie-griffin', 2], ['105-the-master-of-puppets', 1],
      ['031-suppression-protocol', 3], ['055-clearmind', 2], ['059-inter-hyperversal-space', 2],
      ['062-overwatch-directive', 2], ['064-transhuman-conditioning', 2],
      ['energy-neutrino', 8], ['energy-muon', 4], ['energy-electron', 5], ['energy-gluon', 2], ['energy-photon', 2],
    ],
  },
  {
    id: 'loaded-dice',
    name: 'Loaded Dice',
    faction: 'Rogues',
    archetype: 'Equipment tempo',
    tagline: 'Bad odds are just another weapon.',
    description: 'Rogues and Gunners exploit effect dice, Additional Attacks, and Equipment recursion to threaten damage from unexpected angles.',
    gamePlan: ['Find Equipment with Stewie Griffin', 'Attack safely from the Backguard', 'Recycle spent weapons with Stanley Pines'],
    complexity: 2,
    featuredCardIds: ['023-squidward', '050-stanley-pines', '091-herring-bandito'],
    entries: [
      ['023-squidward', 3], ['024-sylas', 3], ['045-murdoc-niccals', 3], ['050-stanley-pines', 3],
      ['048-sniper', 3], ['053-tupac', 2], ['070-demoman', 3], ['081-salesman', 2],
      ['051-stewie-griffin', 2], ['026-yoko-littner', 2],
      ['091-herring-bandito', 3], ['092-keltec-pr57', 3], ['060-oblique-blade', 3],
      ['090-deploy-armor', 2], ['059-inter-hyperversal-space', 2],
      ['energy-muon', 7], ['energy-electron', 6], ['energy-photon', 3], ['energy-boson', 3], ['energy-gluon', 2],
    ],
  },
  {
    id: 'sixfold-ascension',
    name: 'Sixfold Ascension',
    faction: 'Hyperverse',
    archetype: 'Rainbow ramp',
    tagline: 'Six domains. One impossible endgame.',
    description: 'A high-risk six-Energy ramp deck that opens the Hyperversal Gate and survives long enough to awaken the Master of Puppets.',
    gamePlan: ['Fix Energy with Mining Droid', 'Accelerate with Energy Reactor', 'Trade resources for Gate turns and an alternate win'],
    complexity: 3,
    featuredCardIds: ['014-hyperversal-gate', '105-the-master-of-puppets', '076-mining-droid'],
    entries: [
      ['105-the-master-of-puppets', 1], ['001-admiral-asgore-dreemurr', 2], ['004-cyclops-super', 1],
      ['007-garen-crownguard', 2], ['008-jean-luc-picard', 2], ['009-raiden', 2], ['010-soldier-tf2-super', 2],
      ['011-terra', 2], ['012-xehanort', 2], ['020-mark-rutte', 2], ['026-yoko-littner', 2],
      ['039-engineer', 2], ['044-motu', 2], ['054-vale', 2], ['076-mining-droid', 3],
      ['014-hyperversal-gate', 3], ['028-energy-reactor', 3], ['089-battle-medicine', 2], ['055-clearmind', 2],
      ['energy-gluon', 4], ['energy-photon', 4], ['energy-electron', 4],
      ['energy-muon', 3], ['energy-boson', 3], ['energy-neutrino', 3],
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
