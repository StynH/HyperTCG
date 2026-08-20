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
    id: 'imperial-directive',
    name: 'Imperial Directive',
    faction: 'SCE',
    archetype: 'Construction control',
    tagline: 'Every equation ends in empire.',
    description: 'An Electron-Gluon-Neutrino control deck built around Constructions and Emperors. Metron and Earth-3021 recover Energy while Voidstar and Catasthor clear opposing Units.',
    gamePlan: ['Chip in with CSE Sentries and Troopers behind the tax pieces', 'Assemble Constructions and refund their cost with Metron and Earth-3021', 'Wipe the Vanguard with the Voidstar Cannon, then rule with the Emperors'],
    complexity: 3,
    featuredCardIds: ['003-emperor-metron', '010-project-voidstar-cannon', '002-e-v-e'],
    entries: [
      ['052-cse-sentry', 3], ['039-cse-trooper', 3], ['022-cse-star-fighter', 3], ['019-lola-bunny', 2],
      ['003-emperor-metron', 2], ['004-emperor-rassilon', 2], ['006-emperor-uatu', 2],
      ['005-emperor-saruman', 1], ['002-e-v-e', 1],
      ['016-earth-3021', 2], ['029-cse-blockade', 2], ['011-project-voidstar-looking-glass', 2],
      ['010-project-voidstar-cannon', 1], ['009-project-catasthor', 2], ['030-cse-negotiations', 2],
      ['031-cse-siphoning-laser', 2], ['020-the-tomb-of-the-fallen-elder', 2], ['057-incoming-warning', 2],
      ['energy-electron', 10], ['energy-gluon', 8], ['energy-neutrino', 6],
    ],
  },
  {
    id: 'rebel-insurgency',
    name: 'Rebel Insurgency',
    faction: 'Rebels',
    archetype: 'Underdog aggro',
    tagline: 'Outnumbered was always the plan.',
    description: 'A Muon-Electron-Boson aggro deck. Rebel bonuses apply while you have less Energy, and the ISU Warp Gate plus equipment helps you keep Units on the board.',
    gamePlan: ['Flood the board with cheap Rebels and stay under their Energy count', 'Ramp with the ISU Warp Gate and refund with Project Parabellum', 'Bolt on launcher equipment and close before they stabilise'],
    complexity: 2,
    featuredCardIds: ['037-aleph-striker', '024-fcr-mine-layer', '001-aleph-atomic-titan'],
    entries: [
      ['046-fcr-trench-drone', 3], ['037-aleph-striker', 3], ['024-fcr-mine-layer', 3],
      ['013-fission-bomb-walker', 2], ['025-isu-carrier', 2], ['070-demoman', 3], ['086-soldier-tf2', 2],
      ['001-aleph-atomic-titan', 1],
      ['035-isu-warp-gate', 2], ['018-project-parabellum', 2], ['045-aleph-laser-claymore', 2],
      ['034-fission-launcher-pod', 2], ['049-fcr-rpg-launcher', 3], ['033-fcr-mortar-cannon', 2],
      ['048-energy-retrieval-service', 2], ['090-deploy-armor', 2],
      ['energy-muon', 9], ['energy-electron', 8], ['energy-boson', 7],
    ],
  },
  {
    id: 'atomic-ordnance',
    name: 'Atomic Ordnance',
    faction: 'Rebels',
    archetype: 'Boson sacrifice',
    tagline: 'It carried a sun to the front.',
    description: 'A Boson-Electron deck that sacrifices Energy for high-damage attacks. Fission Bomb Walker, Aleph Atomic Titan, and Fission Launcher Pod are its main threats.',
    gamePlan: ['Ramp Boson with Mining Droids and the Energy Retrieval Service', 'Sacrifice Energy to fire Fission attacks for 80–120 Damage', 'Let the Atomic Titan take the board down with it when it falls'],
    complexity: 2,
    featuredCardIds: ['001-aleph-atomic-titan', '013-fission-bomb-walker', '034-fission-launcher-pod'],
    entries: [
      ['076-mining-droid', 3], ['071-desert-droid', 2], ['025-isu-carrier', 3], ['013-fission-bomb-walker', 3],
      ['072-grunt', 2], ['087-transport-droid', 2], ['086-soldier-tf2', 2], ['001-aleph-atomic-titan', 1],
      ['034-fission-launcher-pod', 3], ['049-fcr-rpg-launcher', 3], ['033-fcr-mortar-cannon', 2],
      ['090-deploy-armor', 3], ['092-keltec-pr57', 2], ['048-energy-retrieval-service', 3],
      ['018-project-parabellum', 2],
      ['energy-boson', 12], ['energy-electron', 10], ['energy-muon', 2],
    ],
  },
  {
    id: 'golem-foundry',
    name: 'Golem Foundry',
    faction: 'Golem',
    archetype: 'Creation beatdown',
    tagline: 'Beautiful until it strikes.',
    description: 'A Boson-Muon Unit deck using Golem Creations, Bruisers, armor, and One Punch. Its Units have high HP and become harder to trade with over time.',
    gamePlan: ['Curve out Clay, Stone and Crystal Golems behind a wall of HP', 'Armor up and swing with Motu and Patlu for stacked bonuses', 'Finish with One Punch on a Golem nothing wants to defend against'],
    complexity: 1,
    featuredCardIds: ['043-stone-golem', '021-crystal-golem', '061-one-punch'],
    entries: [
      ['050-clay-golem', 3], ['043-stone-golem', 3], ['021-crystal-golem', 3], ['044-motu', 3],
      ['022-patlu', 3], ['077-norm-of-the-north', 2], ['047-peter-griffin', 2], ['070-demoman', 2],
      ['010-soldier-tf2-super', 1],
      ['061-one-punch', 3], ['090-deploy-armor', 3], ['027-copycats', 2],
      ['051-resonating-health-crystal', 2], ['092-keltec-pr57', 2], ['089-battle-medicine', 2],
      ['energy-boson', 12], ['energy-muon', 7], ['energy-photon', 5],
    ],
  },
  {
    id: 'contract-killers',
    name: 'Contract Killers',
    faction: 'Assassins',
    archetype: 'Bounty toolbox',
    tagline: 'No questions. Half up front.',
    description: 'A Muon-Electron-Neutrino deck using Prime Assassins and bounty Utilities for extra Damage and card draw. Snipers and Marksmen provide Backguard reach.',
    gamePlan: ['Dig for the right Assassin with Earth Prime', 'Tag a Unit with Setting the Bounty or a Strike Gun', 'Close the account for bonus Damage and refill your hand'],
    complexity: 3,
    featuredCardIds: ['014-prime-bounty-hunter', '015-earth-prime', '036-setting-the-bounty'],
    entries: [
      ['042-prime-infiltrator', 3], ['026-prime-collector', 3], ['014-prime-bounty-hunter', 3],
      ['048-sniper', 3], ['043-marksman', 3], ['026-yoko-littner', 2], ['050-stanley-pines', 2],
      ['078-pilot', 2],
      ['015-earth-prime', 2], ['036-setting-the-bounty', 3], ['032-decapitation-strike', 2],
      ['060-oblique-blade', 3], ['096-tcr-v02-strike-gun', 2], ['058-infiltration-strike', 2],
      ['093-narrow-escape', 2],
      ['energy-muon', 8], ['energy-electron', 7], ['energy-neutrino', 5], ['energy-gluon', 3],
    ],
  },
  {
    id: 'court-of-the-dead',
    name: 'Court of the Dead',
    faction: 'Spectres',
    archetype: 'Haunt recursion',
    tagline: 'Death has a court. It answers to him.',
    description: 'A Neutrino-Electron-Photon control deck. Endymion returns Spectres from the Vanquished Pile while Conditions and defensive Units slow the opponent.',
    gamePlan: ['Wall behind cheap Spectres while conditions pile up', 'Recur your best Spectres from the Vanquished Pile with Endymion', 'Grind them out of resources and answers, then close slowly'],
    complexity: 3,
    featuredCardIds: ['007-endymion', '046-observing-spectre', '044-2spooky4me'],
    entries: [
      ['041-hidden-spectre', 3], ['040-digi-spectre', 3], ['046-observing-spectre', 3],
      ['036-disaster-spectre', 3], ['025-vengeful-spectre', 3], ['049-stalker', 3], ['007-endymion', 1],
      ['012-xehanort', 1],
      ['044-2spooky4me', 3], ['059-inter-hyperversal-space', 3], ['064-transhuman-conditioning', 2],
      ['051-resonating-health-crystal', 2], ['089-battle-medicine', 2], ['055-clearmind', 2],
      ['057-incoming-warning', 3],
      ['energy-neutrino', 11], ['energy-electron', 6], ['energy-muon', 3], ['energy-photon', 3],
    ],
  },
  {
    id: 'imperial-inquisition',
    name: 'Imperial Inquisition',
    faction: 'SCE',
    archetype: 'Condition control',
    tagline: 'It knew where resistance hurt.',
    description: 'A Neutrino-Electron-Gluon control deck combining Emperors with the Combine Condition package. Saruman punishes Weakened Units and Combine Advisor Exhausts affected targets.',
    gamePlan: ['Staple Conditions on with Negotiations, Suppression and Ordinal', 'Exhaust every afflicted Unit with the Combine Advisor and Saruman', 'Take the long game with Uatu and Xehanort in command'],
    complexity: 3,
    featuredCardIds: ['012-combine-advisor', '005-emperor-saruman', '031-suppression-protocol'],
    entries: [
      ['012-combine-advisor', 3], ['021-ordinal', 3], ['048-sniper', 3], ['037-elite', 3],
      ['018-ebony-maw', 3], ['049-stalker', 2], ['005-emperor-saruman', 2], ['006-emperor-uatu', 2],
      ['012-xehanort', 1],
      ['030-cse-negotiations', 3], ['031-suppression-protocol', 2], ['013-citadel', 2],
      ['064-transhuman-conditioning', 2], ['062-overwatch-directive', 2],
      ['011-project-voidstar-looking-glass', 2], ['095-stun-baton', 2],
      ['energy-neutrino', 9], ['energy-electron', 8], ['energy-gluon', 6],
    ],
  },
  {
    id: 'overwatch-command',
    name: 'Overwatch Command',
    faction: 'Combine',
    archetype: 'Infantry aggro',
    tagline: 'Mark them. Then break them.',
    description: 'A Gluon-Electron Infantry deck with a low Energy curve. It applies Conditions, then uses Dr. Breen, Ordinal, and CSE Units for additional Damage.',
    gamePlan: ['Play an Infantry Unit on turn one and never stop', 'Apply Conditions with Stun Baton and Overwatch Directive', 'Convert marked Units into extra Damage through Ordinal and Dr. Breen'],
    complexity: 1,
    featuredCardIds: ['006-dr-breen', '039-cse-trooper', '095-stun-baton'],
    entries: [
      ['069-conscript', 3], ['075-metrocop', 3], ['085-soldier', 3], ['073-guard', 3],
      ['037-elite', 2], ['039-cse-trooper', 3], ['052-cse-sentry', 2], ['006-dr-breen', 2],
      ['048-sniper', 2], ['021-ordinal', 2],
      ['095-stun-baton', 3], ['062-overwatch-directive', 2], ['063-suppressing-fire', 3],
      ['029-cse-blockade', 2], ['094-pulse-rifle', 2],
      ['energy-gluon', 14], ['energy-electron', 9],
    ],
  },
  {
    id: 'machine-syndicate',
    name: 'Machine Syndicate',
    faction: 'Machine',
    archetype: 'Droid value',
    tagline: 'Nothing here is ever really scrapped.',
    description: 'An Electron-Boson Machine deck. Droids search for cards and Energy, while Retrieval Machine and Engineer return lost Machines.',
    gamePlan: ['Chain droid search attacks to hit every land drop and threat', 'Accelerate off Energy Reactor once the board is stable', 'Grind every trade with repaired Machines and Star Fighters'],
    complexity: 2,
    featuredCardIds: ['039-engineer', '022-cse-star-fighter', '079-retrieval-machine'],
    entries: [
      ['068-cleaning-droid', 2], ['083-scout-droid', 3], ['076-mining-droid', 3], ['082-scanner', 2],
      ['025-isu-carrier', 3], ['022-cse-star-fighter', 3], ['052-cse-sentry', 2],
      ['079-retrieval-machine', 2], ['087-transport-droid', 2], ['039-engineer', 3],
      ['090-deploy-armor', 3], ['028-energy-reactor', 3], ['048-energy-retrieval-service', 2],
      ['092-keltec-pr57', 2], ['057-incoming-warning', 2],
      ['energy-electron', 12], ['energy-boson', 8], ['energy-gluon', 3],
    ],
  },
  {
    id: 'xtremist-vanguard',
    name: 'X-Tremist Vanguard',
    faction: 'X-Tremists',
    archetype: 'Tempo swarm',
    tagline: 'Four of us is a movement.',
    description: 'A Photon-Muon-Gluon tempo deck that aims to control four X-Tremists. X-Tremist Jet replays your Units, and Dragoon provides an additional finisher.',
    gamePlan: ['Deploy three cheap X-Tremists by turn three', 'Turn on the DEF and Damage bonuses, rebuying drops with the Jet', 'Refuse removal with Narrow Escape, then swing with X-Tremists Unite'],
    complexity: 2,
    featuredCardIds: ['004-cyclops-super', '027-x-tremist-jet', '015-x-tremists-unite'],
    entries: [
      ['034-bob-ross', 3], ['038-eminem', 3], ['023-squidward', 3], ['045-murdoc-niccals', 3],
      ['017-cyclops-tactician', 3], ['003-barack-obama', 3], ['027-x-tremist-jet', 3],
      ['004-cyclops-super', 1], ['053-dragoon', 1],
      ['029-planet-n8318', 3], ['056-contract-with-the-tcr', 3], ['015-x-tremists-unite', 3],
      ['093-narrow-escape', 3], ['055-clearmind', 2],
      ['energy-photon', 7], ['energy-muon', 6], ['energy-electron', 5], ['energy-gluon', 3], ['energy-boson', 2],
    ],
  },
  {
    id: 'rift-toolbox',
    name: 'TCR Toolbox',
    faction: 'TCR',
    archetype: 'Toolbox midrange',
    tagline: 'There is a procedure for you.',
    description: 'A Gluon-Electron midrange deck with a low Energy curve and several search and draw effects. It uses TCR Units and Utilities to answer different board states.',
    gamePlan: ['Search early with Splinter Groups and Mark Rutte', 'Trade efficiently while Lawmaker denies their repositioning', 'Refuse the blowout with Zero Hour and Incoming Warning'],
    complexity: 2,
    featuredCardIds: ['020-mark-rutte', '008-jean-luc-picard', '016-zero-hour'],
    entries: [
      ['020-mark-rutte', 3], ['042-lawmaker', 3], ['033-antonije-pusic', 2], ['019-lola-bunny', 3],
      ['088-trooper', 3], ['043-marksman', 3], ['054-vale', 3], ['052-tech-specialist', 2],
      ['066-andy-king', 1], ['008-jean-luc-picard', 1],
      ['030-splinter-groups', 3], ['016-zero-hour', 2], ['057-incoming-warning', 3],
      ['096-tcr-v02-strike-gun', 3], ['048-energy-retrieval-service', 2],
      ['energy-gluon', 12], ['energy-electron', 9], ['energy-photon', 2],
    ],
  },
  {
    id: 'hyperversal-convergence',
    name: 'Hyperversal Convergence',
    faction: 'Hyperverse',
    archetype: 'Six-domain ramp',
    tagline: 'Every domain. One doorway.',
    description: 'A six-Energy ramp deck. Mining Droid and Energy Reactor set up Hyperversal Gate, which plays the most expensive legends in the archive ahead of schedule.',
    gamePlan: ['Fix Energy with Mining Droid and dig with the droid suite', 'Double your Energy drops with Energy Reactor and Earth-3021', 'Slam Hyperversal Gate and overwhelm with a wall of legends'],
    complexity: 3,
    featuredCardIds: ['014-hyperversal-gate', '054-popeye', '003-emperor-metron'],
    entries: [
      ['076-mining-droid', 3], ['083-scout-droid', 2], ['066-andy-king', 2], ['020-mark-rutte', 2],
      ['005-donald-trump', 2], ['011-terra', 2], ['012-xehanort', 1], ['003-emperor-metron', 1],
      ['006-emperor-uatu', 1], ['008-jean-luc-picard', 1], ['009-raiden', 1], ['001-aleph-atomic-titan', 1],
      ['054-popeye', 1],
      ['014-hyperversal-gate', 3], ['028-energy-reactor', 3], ['016-earth-3021', 2],
      ['030-splinter-groups', 2], ['089-battle-medicine', 2], ['092-keltec-pr57', 2],
      ['048-energy-retrieval-service', 2],
      ['energy-gluon', 5], ['energy-electron', 5], ['energy-boson', 5],
      ['energy-neutrino', 3], ['energy-photon', 3], ['energy-muon', 3],
    ],
  },
  {
    id: 'citizen-bloc',
    name: 'Citizen Bloc',
    faction: 'Citizens',
    archetype: 'Go-wide swarm',
    tagline: 'Small people. Large numbers.',
    description: 'A Photon-Gluon deck of one-cost Citizens that floods both rows and draws its own replacements, then turns the crowd lethal with Geert Wilders and Lawmaker.',
    gamePlan: ['Deploy two Citizens a turn and draw off Andy King and Salesman', 'Switch on the Wilders bonus for board-wide Damage and DEF', 'Heal through removal with Battle Medicine and Clearmind'],
    complexity: 1,
    featuredCardIds: ['040-geert-wilders', '066-andy-king', '089-battle-medicine'],
    entries: [
      ['065-2d', 3], ['067-civilian', 3], ['066-andy-king', 3], ['081-salesman', 3],
      ['034-bob-ross', 3], ['040-geert-wilders', 3], ['053-tupac', 3], ['042-lawmaker', 3],
      ['039-cse-trooper', 2],
      ['092-keltec-pr57', 3], ['089-battle-medicine', 3], ['055-clearmind', 2], ['030-splinter-groups', 3],
      ['energy-photon', 12], ['energy-gluon', 11],
    ],
  },
  {
    id: 'bulwark-line',
    name: 'Bulwark Line',
    faction: 'Wardens',
    archetype: 'Heavyweight defense',
    tagline: 'Outlast. Then step forward.',
    description: 'A Gluon-Boson wall of oversized HP and DEF that blocks the early turns, armors up the survivors, and closes with Garen Crownguard once the aggression has burned out.',
    gamePlan: ['Block the first four turns behind Guard and Rover', 'Bolt Deploy Armor onto anything that survived', 'Close with Garen or Asgore while the launchers pick off blockers'],
    complexity: 1,
    featuredCardIds: ['007-garen-crownguard', '073-guard', '090-deploy-armor'],
    entries: [
      ['073-guard', 3], ['072-grunt', 3], ['084-sentry', 3], ['080-rover', 3], ['076-mining-droid', 2],
      ['071-desert-droid', 2], ['023-cse-synth-lancer', 2], ['087-transport-droid', 2],
      ['007-garen-crownguard', 2], ['001-admiral-asgore-dreemurr', 1],
      ['090-deploy-armor', 3], ['092-keltec-pr57', 3], ['063-suppressing-fire', 3],
      ['095-stun-baton', 2], ['049-fcr-rpg-launcher', 3],
      ['energy-gluon', 12], ['energy-boson', 11],
    ],
  },
  {
    id: 'loaded-dice',
    name: 'Loaded Dice',
    faction: 'Rogues',
    archetype: 'Dice tempo',
    tagline: 'Roll again. I insist.',
    description: 'A Photon-Muon-Boson tempo deck built on effect dice, where every attacker scales with its roll, Bob Ross rerolls the bad ones, and Squidward the Mercenary taxes every Unit they deploy.',
    gamePlan: ['Land Bob Ross early so no roll is ever wasted', 'Swing with dice attackers and Herring Bandito for unfair spikes', 'Hold Muon Energy to snipe their Vanguard plays with the Mercenary'],
    complexity: 2,
    featuredCardIds: ['104-squidward-mercenary', '034-bob-ross', '091-herring-bandito'],
    entries: [
      ['034-bob-ross', 3], ['023-squidward', 3], ['045-murdoc-niccals', 3], ['038-eminem', 3],
      ['070-demoman', 3], ['053-tupac', 2], ['050-stanley-pines', 2], ['047-peter-griffin', 2],
      ['044-motu', 2], ['104-squidward-mercenary', 1],
      ['091-herring-bandito', 3], ['092-keltec-pr57', 3], ['093-narrow-escape', 3],
      ['089-battle-medicine', 2], ['055-clearmind', 2],
      ['energy-photon', 8], ['energy-muon', 9], ['energy-boson', 6],
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
