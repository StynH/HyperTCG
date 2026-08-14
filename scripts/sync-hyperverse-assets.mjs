import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const sourceRoot = process.env.HYPERVERSE_MAKER_PATH ??
  'C:/Users/Styn/Documents/GitHub/HyperTCGMaker';
const requestPath = join(sourceRoot, 'sets', 'Hyperverse_Base_Set_ORIG.render-request.json');
const request = JSON.parse(await readFile(requestPath, 'utf8'));
const cardsDir = new URL('../public/cards/', import.meta.url);
const energiesDir = new URL('../public/energies/', import.meta.url);
const dataDir = new URL('../src/data/', import.meta.url);
const effectsDir = new URL('../src/data/effects/cards/', import.meta.url);
const energyTypes = ['gluon', 'photon', 'electron', 'muon', 'boson', 'neutrino'];

await Promise.all([mkdir(cardsDir, { recursive: true }), mkdir(energiesDir, { recursive: true }), mkdir(dataDir, { recursive: true })]);

const catalog = request.cards.map(({ filename, card }) => ({
  ...card,
  id: filename.replace(/\.png$/i, ''),
  image: `/cards/${filename}`,
}));

const effectFiles = await readdir(effectsDir);
const effectIds = new Set(await Promise.all(effectFiles.filter((file) => file.endsWith('.json')).map(async (file) => {
  const script = JSON.parse(await readFile(new URL(file, effectsDir), 'utf8'));
  return script.cardId;
})));
const expectedIds = [...catalog.map(({ id }) => id), ...energyTypes.map((energy) => 'energy-' + energy)];
const missingEffects = expectedIds.filter((id) => !effectIds.has(id));
if (missingEffects.length) throw new Error('Missing JSON effect scripts: ' + missingEffects.join(', '));

await Promise.all(catalog.map((card) =>
  copyFile(join(sourceRoot, 'output', basename(card.image)), new URL(`../public${card.image}`, import.meta.url))
));

await Promise.all(energyTypes.map((energy) =>
  copyFile(join(sourceRoot, 'energies', `${energy}-energy.png`), new URL(`../public/energies/${energy}-energy.png`, import.meta.url))
));

const generated = `// Generated from HyperTCGMaker. Run npm run sync:cards to refresh.\nexport const GENERATED_CARDS = ${JSON.stringify(catalog, null, 2)} as const;\n`;
await writeFile(new URL('../src/data/cardCatalog.generated.ts', import.meta.url), generated, 'utf8');
console.log(`Synced ${catalog.length} rendered cards and ${energyTypes.length} Energy cards.`);
