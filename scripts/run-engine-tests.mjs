import { createServer } from 'vite';

function parseArguments(arguments_) {
  const options = {
    filters: [],
    caseFilter: undefined,
    failFast: false,
    json: false,
    list: false,
    coreOnly: false,
    cardsOnly: false,
    help: false,
  };
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (argument === '--case') {
      options.caseFilter = arguments_[++index];
      if (!options.caseFilter) throw new Error('--case requires a value.');
    } else if (argument === '--fail-fast') options.failFast = true;
    else if (argument === '--json') options.json = true;
    else if (argument === '--list') options.list = true;
    else if (argument === '--core') options.coreOnly = true;
    else if (argument === '--cards') options.cardsOnly = true;
    else if (argument === '--all') continue;
    else if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument.startsWith('-')) throw new Error(`Unknown option: ${argument}`);
    else options.filters.push(argument);
  }
  if (options.coreOnly && options.cardsOnly) throw new Error('Choose either --core or --cards, not both.');
  return options;
}

function printHelp() {
  console.log(`Hyperverse test runner

Usage:
  npm test                         Run core tests and every card test
  npm test -- <card-id|name>       Run matching card test files
  npm test -- <file.test.ts>       Run a specific card test file
  npm test -- "001-*"              Run card/file wildcard matches
  npm test -- --cards              Run all card tests only
  npm test -- --core               Run core engine tests only
  npm test -- --list [filter]      List suites and cases

Options:
  --case <text>       Run matching case names inside selected suites
  --fail-fast         Stop after the first failure
  --json              Emit machine-readable JSON
  -h, --help          Show this help`);
}

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  printHelp();
  process.exit(0);
}

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { runEngineSelfTests } = await server.ssrLoadModule('/src/game/engine.testHarness.ts');
  const cardHarness = await server.ssrLoadModule('/src/game/cardTests/cardTestHarness.ts');

  if (options.list) {
    const listings = cardHarness.listCardTests(options.filters);
    if (options.json) console.log(JSON.stringify(listings, null, 2));
    else {
      for (const listing of listings) {
        console.log(`${listing.cardId} — ${listing.cardName} (${listing.file})`);
        for (const testCase of listing.cases) console.log(`  ${testCase}`);
      }
      console.log(`\n${listings.length} card test file(s).`);
    }
  } else {
    const shouldRunCore = options.coreOnly || (!options.cardsOnly && options.filters.length === 0);
    const shouldRunCards = !options.coreOnly;
    const coreResults = shouldRunCore
      ? runEngineSelfTests().map((result) => ({ suiteId: 'engine', file: 'src/game/engine.testHarness.ts', ...result }))
      : [];
    const cardResults = shouldRunCards ? cardHarness.runCardTests({
      filters: options.filters,
      caseFilter: options.caseFilter,
      failFast: options.failFast,
    }) : [];
    const results = [...coreResults, ...cardResults];

    if (options.json) console.log(JSON.stringify(results, null, 2));
    else {
      let previousSuite;
      for (const result of results) {
        if (result.suiteId !== previousSuite) {
          console.log(`\n${result.suiteId}`);
          previousSuite = result.suiteId;
        }
        console.log(`  ${result.passed ? 'PASS' : 'FAIL'} ${result.name}${result.error ? `: ${result.error}` : ''}`);
      }
      const passed = results.filter(({ passed }) => passed).length;
      console.log(`\n${passed}/${results.length} tests passed across ${new Set(results.map(({ suiteId }) => suiteId)).size} suite(s).`);
    }
    const failed = results.filter(({ passed }) => !passed);
    if (failed.length) process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  await server.close();
}
