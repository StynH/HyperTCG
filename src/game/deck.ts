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
    id: 'scorched-earth',
    name: 'Scorched Earth',
    faction: 'Rebels',
    archetype: 'Energy-sacrifice combo',
    tagline: 'Burn it all. Then hit harder.',
    description: 'A deck that Vanquishes its own Energy on purpose. Fission attacks trade Energy for huge Damage, Project Parabellum turns each sacrifice into a card, and staying poorer than the opponent switches on every Rebel bonus.',
    gamePlan: ['Mine Boson, then spend it on 100+ Damage Fission attacks', 'Draw off every Energy you Vanquish with Project Parabellum', 'Stay under their Energy so Aleph Striker and the Trench Drones turn on'],
    complexity: 3,
    featuredCardIds: ['013-fission-bomb-walker', '018-project-parabellum', '001-aleph-atomic-titan'],
    entries: [
      ['076-mining-droid', 3], ['046-fcr-trench-drone', 3], ['037-aleph-striker', 3], ['024-fcr-mine-layer', 3],
      ['013-fission-bomb-walker', 3], ['025-isu-carrier', 3], ['001-aleph-atomic-titan', 1],
      ['018-project-parabellum', 3], ['034-fission-launcher-pod', 3], ['048-energy-retrieval-service', 3],
      ['035-isu-warp-gate', 2], ['049-fcr-rpg-launcher', 3], ['033-fcr-mortar-cannon', 2], ['090-deploy-armor', 2],
      ['energy-boson', 11], ['energy-electron', 7], ['energy-muon', 5],
    ],
  },
  {
    id: 'grand-design',
    name: 'The Grand Design',
    faction: 'SCE',
    archetype: 'Construction engine',
    tagline: 'Every equation ends in empire.',
    description: 'A Construction ramp engine. Metron advances a second Construction for free and draws when one finishes, Earth-3021 and E.V.E refund the Energy, and a completed Looking Glass arms the Voidstar Cannon to erase a Vanguard.',
    gamePlan: ['Chip in behind CSE bodies while you build Constructions', 'Advance two Constructions a turn with Metron and refund with Earth-3021', 'Finish the Looking Glass, then wipe their board with the Voidstar Cannon'],
    complexity: 3,
    featuredCardIds: ['003-emperor-metron', '010-project-voidstar-cannon', '002-e-v-e'],
    entries: [
      ['052-cse-sentry', 3], ['039-cse-trooper', 3], ['022-cse-star-fighter', 3],
      ['003-emperor-metron', 2], ['004-emperor-rassilon', 2], ['006-emperor-uatu', 2], ['002-e-v-e', 1],
      ['016-earth-3021', 3], ['011-project-voidstar-looking-glass', 3], ['010-project-voidstar-cannon', 2],
      ['009-project-catasthor', 2], ['020-the-tomb-of-the-fallen-elder', 2], ['030-cse-negotiations', 3],
      ['029-cse-blockade', 2], ['057-incoming-warning', 2],
      ['energy-electron', 10], ['energy-gluon', 8], ['energy-neutrino', 7],
    ],
  },
  {
    id: 'voice-of-saruman',
    name: 'Voice of Saruman',
    faction: 'SCE',
    archetype: 'Weakened lockout',
    tagline: 'Break their will, then their line.',
    description: 'A tempo deck built on one Condition. Everything applies Weakened; Saruman then strips 20 DEF and Exhausts each Weakened Unit, and the Star Fighter’s Interdiction Run ignores the Defense Check of anything Exhausted.',
    gamePlan: ['Blanket their board in Weakened with Troopers, Snipers and Negotiations', 'Let Saruman Exhaust every Weakened Unit as it happens', 'Punch through the frozen line with Star Fighters that ignore Defense'],
    complexity: 3,
    featuredCardIds: ['005-emperor-saruman', '022-cse-star-fighter', '048-sniper'],
    entries: [
      ['039-cse-trooper', 3], ['048-sniper', 3], ['043-marksman', 3], ['046-observing-spectre', 3],
      ['052-cse-sentry', 3], ['022-cse-star-fighter', 3], ['005-emperor-saruman', 2], ['012-combine-advisor', 2],
      ['006-emperor-uatu', 2],
      ['030-cse-negotiations', 3], ['031-suppression-protocol', 2], ['062-overwatch-directive', 2],
      ['057-incoming-warning', 3], ['020-the-tomb-of-the-fallen-elder', 3],
      ['energy-electron', 9], ['energy-neutrino', 8], ['energy-gluon', 6],
    ],
  },
  {
    id: 'overwatch-command',
    name: 'Overwatch Command',
    faction: 'Combine',
    archetype: 'Condition lockdown',
    tagline: 'Mark them. Then break them.',
    description: 'A Combine control deck that never lets the opponent act. Suppression Protocol and Stun Baton pile on Conditions, the Combine Advisor Exhausts anything afflicted, and Dr. Breen turns every marked target into extra Damage.',
    gamePlan: ['Land early Conditions with Stun Baton and Suppression Protocol', 'Exhaust the two Units that matter with Combine Advisor and Overwatch Directive', 'Grind them out with +Damage attacks into their marked line'],
    complexity: 2,
    featuredCardIds: ['006-dr-breen', '031-suppression-protocol', '012-combine-advisor'],
    entries: [
      ['069-conscript', 3], ['075-metrocop', 3], ['085-soldier', 3], ['073-guard', 2], ['037-elite', 2],
      ['048-sniper', 3], ['006-dr-breen', 2], ['012-combine-advisor', 2], ['021-ordinal', 2],
      ['095-stun-baton', 3], ['031-suppression-protocol', 2], ['062-overwatch-directive', 2],
      ['013-citadel', 2], ['064-transhuman-conditioning', 2], ['057-incoming-warning', 2],
      ['energy-gluon', 14], ['energy-electron', 8], ['energy-neutrino', 3],
    ],
  },
  {
    id: 'mark-and-execute',
    name: 'Mark & Execute',
    faction: 'Assassins',
    archetype: 'Target-and-kill combo',
    tagline: 'Proof first. Payment second.',
    description: 'A combo toolbox where a Utility marks the target and an Assassin cashes it in. Dead or Alive hits harder into a marked Unit, Collection Fee draws when an Assassin finishes one off, and Paid in Full Readies the Energy to do it again.',
    gamePlan: ['Dig for the right killer with Earth Prime', 'Mark a Unit with Setting the Bounty, a Sniper shot or a Strike Gun', 'Execute it for extra Damage, a card, and refunded Energy — then repeat'],
    complexity: 3,
    featuredCardIds: ['014-prime-bounty-hunter', '036-setting-the-bounty', '026-prime-collector'],
    entries: [
      ['042-prime-infiltrator', 3], ['026-prime-collector', 3], ['014-prime-bounty-hunter', 3],
      ['048-sniper', 3], ['043-marksman', 3], ['026-yoko-littner', 2], ['050-stanley-pines', 2], ['078-pilot', 1],
      ['036-setting-the-bounty', 3], ['015-earth-prime', 3], ['032-decapitation-strike', 2],
      ['060-oblique-blade', 3], ['096-tcr-v02-strike-gun', 2], ['058-infiltration-strike', 2], ['057-incoming-warning', 2],
      ['energy-electron', 9], ['energy-muon', 6], ['energy-neutrino', 5], ['energy-gluon', 3],
    ],
  },
  {
    id: 'grave-return',
    name: 'Grave Return',
    faction: 'Spectres',
    archetype: 'Graveyard attrition',
    tagline: 'Death has a court. It answers to him.',
    description: 'A Spectre grind that gets stronger the longer it loses. Endymion and Vengeful Spectre keep recurring the graveyard, Retribution scales off every Spectre that has died, and Curse plus Doom slowly pull the opponent apart.',
    gamePlan: ['Trade cheap, hard-to-kill Spectres and fill the Vanquished Pile', 'Recur your best haunts with Endymion, 2Spooky4Me and Vengeful Spectre', 'Close with a Retribution that grows every time a Spectre falls'],
    complexity: 3,
    featuredCardIds: ['007-endymion', '025-vengeful-spectre', '044-2spooky4me'],
    entries: [
      ['036-disaster-spectre', 3], ['041-hidden-spectre', 3], ['040-digi-spectre', 3], ['046-observing-spectre', 3],
      ['025-vengeful-spectre', 3], ['049-stalker', 3], ['007-endymion', 1], ['012-xehanort', 1],
      ['044-2spooky4me', 3], ['059-inter-hyperversal-space', 3], ['089-battle-medicine', 3],
      ['051-resonating-health-crystal', 3], ['055-clearmind', 2], ['057-incoming-warning', 3],
      ['energy-neutrino', 11], ['energy-electron', 6], ['energy-muon', 3], ['energy-photon', 3],
    ],
  },
  {
    id: 'xtremists-ascendant',
    name: 'X-Tremists Ascendant',
    faction: 'X-Tremists',
    archetype: 'Rotate-storm swarm',
    tagline: 'Four of us is a movement.',
    description: 'A wide board that attacks twice. Planet N8318, Cyclops and Murdoc Rotate your own Units back upright for extra swings, X-Tremists Unite readies the whole team, and Dragoon’s X-Cutter scales to 200 once six of them share the field.',
    gamePlan: ['Flood three or more X-Tremists to switch on the DEF and Damage bonuses', 'Re-attack all game by Rotating your own board upright', 'Alpha strike with X-Tremists Unite or a fully-scaled Dragoon'],
    complexity: 2,
    featuredCardIds: ['004-cyclops-super', '053-dragoon', '015-x-tremists-unite'],
    entries: [
      ['034-bob-ross', 3], ['023-squidward', 3], ['045-murdoc-niccals', 3], ['038-eminem', 3],
      ['017-cyclops-tactician', 3], ['003-barack-obama', 3], ['027-x-tremist-jet', 3],
      ['004-cyclops-super', 1], ['053-dragoon', 1],
      ['029-planet-n8318', 3], ['056-contract-with-the-tcr', 3], ['015-x-tremists-unite', 3],
      ['093-narrow-escape', 3], ['055-clearmind', 2],
      ['energy-photon', 7], ['energy-muon', 6], ['energy-gluon', 4], ['energy-electron', 4], ['energy-boson', 2],
    ],
  },
  {
    id: 'one-punch-doctrine',
    name: 'One-Punch Doctrine',
    faction: 'X-Perience',
    archetype: 'Burst haymaker',
    tagline: 'Math is for the defense.',
    description: 'A low-curve beatdown that funnels the whole turn into one hit. Kramer discounts the Bruisers, Motu and One Punch pile Damage onto a single attacker, and Copycats Readies the team for a second swing nothing survives.',
    gamePlan: ['Curve out cheap Bruisers, discounted by Kramer', 'Stack Motu’s surge and One Punch onto one attacker for a huge hit', 'Ready the board with Copycats and swing again'],
    complexity: 1,
    featuredCardIds: ['022-patlu', '061-one-punch', '044-motu'],
    entries: [
      ['041-kramer', 3], ['022-patlu', 3], ['044-motu', 3], ['047-peter-griffin', 3], ['077-norm-of-the-north', 3],
      ['070-demoman', 3], ['086-soldier-tf2', 2], ['072-grunt', 2], ['010-soldier-tf2-super', 1],
      ['061-one-punch', 3], ['027-copycats', 3], ['090-deploy-armor', 3], ['091-herring-bandito', 2], ['092-keltec-pr57', 2],
      ['energy-boson', 12], ['energy-muon', 12],
    ],
  },
  {
    id: 'infantry-doctrine',
    name: 'Infantry Doctrine',
    faction: 'Combine',
    archetype: 'Scaling horde',
    tagline: 'The line moves as one.',
    description: 'A go-wide Infantry deck whose attacks scale with the crowd. Squad Fire and Human Wave grow per body, Ordinal and Soldier’s command stack a flat bonus on every Infantry Unit, and Splinter Groups refills the ranks.',
    gamePlan: ['Deploy two Infantry a turn and hold the Vanguard', 'Stack the command auras from Ordinal and the Super Soldier', 'Alpha with Squad Fire and Human Wave once the board is full'],
    complexity: 1,
    featuredCardIds: ['085-soldier', '010-soldier-tf2-super', '069-conscript'],
    entries: [
      ['069-conscript', 3], ['075-metrocop', 3], ['085-soldier', 3], ['088-trooper', 3], ['072-grunt', 3],
      ['073-guard', 2], ['037-elite', 2], ['086-soldier-tf2', 2], ['021-ordinal', 2], ['010-soldier-tf2-super', 1],
      ['095-stun-baton', 3], ['063-suppressing-fire', 3], ['030-splinter-groups', 3], ['090-deploy-armor', 2],
      ['energy-gluon', 12], ['energy-boson', 9], ['energy-electron', 3], ['energy-muon', 1],
    ],
  },
  {
    id: 'fortress',
    name: 'Fortress',
    faction: 'Wardens',
    archetype: 'Wall & crit-punish',
    tagline: 'Outlast. Then step forward.',
    description: 'A wall of oversized HP and DEF that punishes the opponent for swinging in. Golems and Guards force Critical Defenses that hurt the attacker, Deploy Armor makes them unkillable, and Garen heals through the grind.',
    gamePlan: ['Block the first four turns behind Golems, Guards and Rovers', 'Armor up and let Critical Defenses and Asgore burn their attackers', 'Step forward with Garen once their offense has stalled out'],
    complexity: 2,
    featuredCardIds: ['021-crystal-golem', '007-garen-crownguard', '090-deploy-armor'],
    entries: [
      ['050-clay-golem', 3], ['043-stone-golem', 3], ['021-crystal-golem', 3], ['073-guard', 3], ['080-rover', 3],
      ['084-sentry', 3], ['076-mining-droid', 3], ['007-garen-crownguard', 2], ['001-admiral-asgore-dreemurr', 1],
      ['090-deploy-armor', 3], ['051-resonating-health-crystal', 3], ['063-suppressing-fire', 3],
      ['095-stun-baton', 2], ['092-keltec-pr57', 2],
      ['energy-boson', 13], ['energy-gluon', 7], ['energy-photon', 3],
    ],
  },
  {
    id: 'loaded-dice',
    name: 'Loaded Dice',
    faction: 'Rogues',
    archetype: 'Dice gamble',
    tagline: 'Roll again. I insist.',
    description: 'A high-variance deck that fixes its own luck. Every threat scales with an effect die — 10× the roll on Panicked Flail, Sticky Trap and Herring Bandito — and Bob Ross rerolls the misses so the gamble always pays.',
    gamePlan: ['Land Bob Ross early so no roll is ever wasted', 'Spike huge Damage with 10× dice attacks and equipment', 'Reroll the blanks and finish with the Mercenary'],
    complexity: 2,
    featuredCardIds: ['104-squidward-mercenary', '034-bob-ross', '091-herring-bandito'],
    entries: [
      ['034-bob-ross', 3], ['023-squidward', 3], ['045-murdoc-niccals', 3], ['038-eminem', 3], ['070-demoman', 3],
      ['044-motu', 2], ['050-stanley-pines', 2], ['053-tupac', 2], ['104-squidward-mercenary', 1],
      ['091-herring-bandito', 3], ['093-narrow-escape', 3], ['092-keltec-pr57', 3], ['089-battle-medicine', 2], ['055-clearmind', 2],
      ['energy-muon', 10], ['energy-photon', 8], ['energy-boson', 7],
    ],
  },
  {
    id: 'machine-syndicate',
    name: 'Machine Syndicate',
    faction: 'Machine',
    archetype: 'Droid value',
    tagline: 'Nothing here is ever really scrapped.',
    description: 'A grinding value engine of droids that never run out of gas. The search suite finds every land drop and threat, Engineer and Tech Specialist keep the line repaired and firing, and Retrieval Machine rebuilds anything that dies.',
    gamePlan: ['Chain droid search attacks to hit every Energy and threat', 'Ramp with Energy Reactor, then armor a Machine for +40 HP', 'Recur your best Machines and win every long trade'],
    complexity: 2,
    featuredCardIds: ['039-engineer', '079-retrieval-machine', '052-tech-specialist'],
    entries: [
      ['068-cleaning-droid', 2], ['083-scout-droid', 3], ['082-scanner', 2], ['076-mining-droid', 3], ['074-junk-droid', 2],
      ['039-engineer', 3], ['052-tech-specialist', 2], ['079-retrieval-machine', 2], ['087-transport-droid', 2],
      ['080-rover', 2], ['022-cse-star-fighter', 2], ['025-isu-carrier', 2],
      ['090-deploy-armor', 3], ['028-energy-reactor', 3], ['048-energy-retrieval-service', 2], ['092-keltec-pr57', 2],
      ['energy-electron', 12], ['energy-boson', 9], ['energy-gluon', 2],
    ],
  },
  {
    id: 'the-watchtower',
    name: 'The Watchtower',
    faction: 'SCE',
    archetype: 'Exhaust prison',
    tagline: 'Nothing you play gets to act.',
    description: 'A prison deck that keeps the opponent perpetually tapped out. Rassilon Exhausts their first Unit, the Siphoning Laser Exhausts their first Energy, and Star Fighters cut clean through anything left Exhausted while Uatu reads their hand for value.',
    gamePlan: ['Stall behind CSE walls while the taxes and Exhaust locks stack up', 'Keep their board and Energy tapped every single turn', 'Drive it home with Star Fighters that ignore Defense on Exhausted Units'],
    complexity: 3,
    featuredCardIds: ['004-emperor-rassilon', '031-cse-siphoning-laser', '022-cse-star-fighter'],
    entries: [
      ['052-cse-sentry', 3], ['022-cse-star-fighter', 3], ['039-cse-trooper', 3], ['004-emperor-rassilon', 3],
      ['006-emperor-uatu', 2], ['003-emperor-metron', 2], ['002-e-v-e', 1],
      ['031-cse-siphoning-laser', 3], ['029-cse-blockade', 3], ['030-cse-negotiations', 3], ['016-earth-3021', 3],
      ['011-project-voidstar-looking-glass', 2], ['010-project-voidstar-cannon', 1], ['057-incoming-warning', 3],
      ['energy-electron', 10], ['energy-gluon', 8], ['energy-neutrino', 7],
    ],
  },
  {
    id: 'hyperversal-ascension',
    name: 'Hyperversal Ascension',
    faction: 'Hyperverse',
    archetype: 'Ramp & alt-win',
    tagline: 'Every domain. One doorway.',
    description: 'The greediest deck in the archive. Mining Droid and Energy Reactor assemble all six Energy types, Hyperversal Gate cheats two legends into play at once, and The Master of Puppets waits to steal five Energy and end the game outright.',
    gamePlan: ['Fix all six Energy types with droids and Energy Reactor', 'Dig with Mark Rutte and Donald Trump toward the Gate', 'Cheat out legends — or let the Master of Puppets steal the win'],
    complexity: 3,
    featuredCardIds: ['014-hyperversal-gate', '105-the-master-of-puppets', '009-raiden'],
    entries: [
      ['076-mining-droid', 3], ['083-scout-droid', 2], ['066-andy-king', 3], ['020-mark-rutte', 3],
      ['005-donald-trump', 2], ['011-terra', 2], ['002-apocalypse', 2], ['012-xehanort', 1], ['009-raiden', 1],
      ['001-aleph-atomic-titan', 1], ['105-the-master-of-puppets', 1],
      ['014-hyperversal-gate', 3], ['028-energy-reactor', 3], ['048-energy-retrieval-service', 2],
      ['030-splinter-groups', 2], ['089-battle-medicine', 2], ['092-keltec-pr57', 2],
      ['energy-gluon', 6], ['energy-electron', 5], ['energy-boson', 4], ['energy-neutrino', 3], ['energy-photon', 4], ['energy-muon', 3],
    ],
  },
  {
    id: 'backguard-artillery',
    name: 'Backguard Artillery',
    faction: 'Infiltrators',
    archetype: 'Backline snipe',
    tagline: 'The front row was never the target.',
    description: 'A backline deck that shoots over the wall. Yoko’s Covering Fire buffs the front while Snipers and Infiltrators reach past it to delete support Units, and Stewie tutors the equipment that lets every shooter fire twice.',
    gamePlan: ['Set Snipers and Marksmen behind a cheap screen', 'Tutor equipment with Stewie and fire twice a turn', 'Snipe their Backguard engines before they ever act'],
    complexity: 3,
    featuredCardIds: ['026-yoko-littner', '048-sniper', '058-infiltration-strike'],
    entries: [
      ['026-yoko-littner', 3], ['048-sniper', 3], ['043-marksman', 3], ['042-prime-infiltrator', 2],
      ['078-pilot', 3], ['051-stewie-griffin', 2], ['083-scout-droid', 3], ['082-scanner', 2], ['024-fcr-mine-layer', 2],
      ['060-oblique-blade', 3], ['096-tcr-v02-strike-gun', 2], ['058-infiltration-strike', 3],
      ['032-zephyr-strike', 3], ['057-incoming-warning', 3],
      ['energy-electron', 14], ['energy-muon', 9],
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
