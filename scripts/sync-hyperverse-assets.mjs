import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const sourceRoot = process.env.HYPERVERSE_MAKER_PATH ??
  'C:/Users/Styn/Documents/GitHub/HyperTCGMaker';

// Each set is generated independently so new sets are added by appending one entry
// here plus their own effect/test folders — ORIG stays untouched.
const SETS = [
  { request: 'Hyperverse_Base_Set_ORIG.render-request.json', out: 'cardCatalog.generated.ts', export: 'GENERATED_CARDS' },
  { request: 'Hyperverse_FOUR_v5.render-request.json', out: 'cardCatalog.four.generated.ts', export: 'GENERATED_CARDS_FOUR' },
];

const cardsDir = new URL('../public/cards/', import.meta.url);
const energiesDir = new URL('../public/energies/', import.meta.url);
const dataDir = new URL('../src/data/', import.meta.url);
const effectsDir = new URL('../src/data/effects/cards/', import.meta.url);
const energyTypes = ['gluon', 'photon', 'electron', 'muon', 'boson', 'neutrino'];

await Promise.all([mkdir(cardsDir, { recursive: true }), mkdir(energiesDir, { recursive: true }), mkdir(dataDir, { recursive: true })]);

async function readEffectIds(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const ids = [];
  for (const entry of entries) {
    if (entry.isDirectory()) ids.push(...await readEffectIds(new URL(entry.name + '/', dir)));
    else if (entry.name.endsWith('.json')) {
      const script = JSON.parse(await readFile(new URL(entry.name, dir), 'utf8'));
      ids.push(script.cardId);
    }
  }
  return ids;
}

const effectIds = new Set(await readEffectIds(effectsDir));

const sets = await Promise.all(SETS.map(async (set) => {
  const request = JSON.parse(await readFile(join(sourceRoot, 'sets', set.request), 'utf8'));
  const catalog = request.cards.map(({ filename, card }) => ({
    ...card,
    id: filename.replace(/\.png$/i, ''),
    image: `/cards/${filename}`,
  }));
  return { ...set, catalog };
}));

const expectedIds = [
  ...sets.flatMap((set) => set.catalog.map(({ id }) => id)),
  ...energyTypes.map((energy) => 'energy-' + energy),
];
const missingEffects = expectedIds.filter((id) => !effectIds.has(id));
if (missingEffects.length) throw new Error('Missing JSON effect scripts: ' + missingEffects.join(', '));

async function copyIfPresent(from, to) {
  try {
    await copyFile(from, to);
  } catch (error) {
    // A set already synced to public/cards keeps its art even when the maker
    // output/ folder currently holds a different set's renders.
    if (error.code !== 'ENOENT') throw error;
  }
}

for (const set of sets) {
  await Promise.all(set.catalog.map((card) =>
    copyIfPresent(join(sourceRoot, 'output', basename(card.image)), new URL(`../public${card.image}`, import.meta.url))
  ));
  const generated = `// Generated from HyperTCGMaker. Run npm run sync:cards to refresh.\nexport const ${set.export} = ${JSON.stringify(set.catalog, null, 2)} as const;\n`;
  await writeFile(new URL(`../src/data/${set.out}`, import.meta.url), generated, 'utf8');
}

await Promise.all(energyTypes.map((energy) =>
  copyFile(join(sourceRoot, 'energies', `${energy}-energy.png`), new URL(`../public/energies/${energy}-energy.png`, import.meta.url))
));

const total = sets.reduce((sum, set) => sum + set.catalog.length, 0);
console.log(`Synced ${total} rendered cards across ${sets.length} set(s) and ${energyTypes.length} Energy cards.`);
