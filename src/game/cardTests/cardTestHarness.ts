import { CARD_CATALOG, getCard } from '../../data/catalog';
import { getEffectScript } from '../../data/effects';
import type { CardGameplayTest, GameplayScenario } from './gameplayTestTypes';
import { runGameplayScenario } from './gameplayScenarioRunner';

const modules = import.meta.glob('./cards/**/*.test.ts', { eager: true, import: 'default' }) as Record<string, CardGameplayTest>;

export interface CardTestResult {
  suiteId: string;
  file: string;
  name: string;
  passed: boolean;
  error?: string;
}

export interface CardTestRunOptions {
  filters?: readonly string[];
  caseFilter?: string;
  failFast?: boolean;
}

export interface CardTestListing {
  cardId: string;
  cardName: string;
  file: string;
  cases: readonly string[];
}

interface LoadedTest {
  test: CardGameplayTest;
  file: string;
}

const loadedTests: LoadedTest[] = Object.entries(modules)
  .map(([file, test]) => ({ file: normalizePath(file), test }))
  .sort((left, right) => left.test.cardId.localeCompare(right.test.cardId));

function normalizePath(path: string): string {
  return path.replaceAll('\\', '/');
}

function requiredCoverage(cardId: string): Set<string> {
  const script = getEffectScript(cardId);
  return new Set([
    ...(script.activated ?? []).map(({ id }) => `activated:${id}`),
    ...(script.triggers ?? []).map(({ id }) => `trigger:${id}`),
    ...(script.continuous ?? []).map(({ id }) => `continuous:${id}`),
    ...(script.attacks ?? []).map(({ id }) => `attack:${id}`),
    ...(script.utility ? ['utility'] : []),
    ...(script.energy ? ['energy'] : []),
  ]);
}

function hasConditional(value: unknown): boolean {
  return JSON.stringify(value)?.includes('"op":"if"') ?? false;
}

function conditionalCoverage(cardId: string): Set<string> {
  const script = getEffectScript(cardId);
  return new Set([
    ...(script.activated ?? []).filter(({ effects }) => hasConditional(effects)).map(({ id }) => `activated:${id}`),
    ...(script.triggers ?? []).filter(({ effects }) => hasConditional(effects)).map(({ id }) => `trigger:${id}`),
    ...(script.continuous ?? []).filter((effect) => hasConditional(effect)).map(({ id }) => `continuous:${id}`),
    ...(script.attacks ?? []).filter((attack) => hasConditional(attack)).map(({ id }) => `attack:${id}`),
    ...(script.utility && hasConditional(script.utility.effects) ? ['utility'] : []),
  ]);
}

function validateTestInventory(): void {
  const errors: string[] = [];
  const catalogIds = new Set(CARD_CATALOG.map(({ id }) => id));
  const seen = new Set<string>();

  for (const { test, file } of loadedTests) {
    if (seen.has(test.cardId)) errors.push(`Duplicate gameplay test for ${test.cardId}.`);
    seen.add(test.cardId);
    if (!catalogIds.has(test.cardId)) errors.push(`${file}: unknown card ${test.cardId}.`);
    if (file.split('/').at(-1) !== `${test.cardId}.test.ts`) errors.push(`${file}: filename must match ${test.cardId}.`);
    if (!test.scenarios.length) errors.push(`${file}: no gameplay scenarios.`);

    const required = requiredCoverage(test.cardId);
    const covered = new Set(test.scenarios.flatMap(({ covers }) => covers));
    for (const key of required) {
      if (!covered.has(key)) errors.push(`${file}: missing observable gameplay scenario for ${key}.`);
    }
    for (const key of conditionalCoverage(test.cardId)) {
      const outcomeScenarios = test.scenarios.filter(({ covers }) => covers.includes(key));
      if (outcomeScenarios.length < 2) {
        errors.push(`${file}: ${key} contains conditional logic and requires scenarios for both outcomes.`);
      }
    }
    for (const scenario of test.scenarios) {
      if (!scenario.expect.length) errors.push(`${file}: “${scenario.name}” has no gameplay assertions.`);
      for (const key of scenario.covers) {
        if (!required.has(key)) errors.push(`${file}: “${scenario.name}” claims unknown coverage ${key}.`);
      }
    }
  }

  for (const card of CARD_CATALOG) {
    if (!seen.has(card.id)) errors.push(`${card.id}: missing individual gameplay test file.`);
  }
  if (loadedTests.length !== CARD_CATALOG.length) {
    errors.push(`Expected ${CARD_CATALOG.length} individual test files, found ${loadedTests.length}.`);
  }
  if (errors.length) throw new Error(`Card gameplay-test inventory is invalid:\n${errors.join('\n')}`);
}

function wildcardPattern(filter: string): RegExp {
  const escaped = normalizePath(filter).replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*');
  return new RegExp(`^${escaped}$`, 'i');
}

function matchesFilter(loaded: LoadedTest, filter: string): boolean {
  const normalized = normalizePath(filter);
  const card = getCard(loaded.test.cardId);
  const repositoryPath = `src/game/cardTests/${loaded.file.replace(/^\.\//, '')}`;
  const candidates = [loaded.test.cardId, card.name, loaded.file, repositoryPath, loaded.file.split('/').at(-1) ?? ''];
  if (normalized.includes('*')) {
    const pattern = wildcardPattern(normalized);
    return candidates.some((candidate) => pattern.test(candidate));
  }
  const lowered = normalized.toLowerCase();
  return candidates.some((candidate) => candidate.toLowerCase() === lowered)
    || loaded.test.cardId.toLowerCase().includes(lowered)
    || card.name.toLowerCase().includes(lowered);
}

function selectTests(filters: readonly string[]): LoadedTest[] {
  if (!filters.length) return loadedTests;
  const selected = loadedTests.filter((loaded) => filters.some((filter) => matchesFilter(loaded, filter)));
  const unmatched = filters.filter((filter) => !loadedTests.some((loaded) => matchesFilter(loaded, filter)));
  if (unmatched.length) throw new Error(`No card test matched: ${unmatched.join(', ')}`);
  return selected;
}

function runScenario(loaded: LoadedTest, scenario: GameplayScenario): CardTestResult {
  try {
    runGameplayScenario(loaded.test, scenario);
    return { suiteId: loaded.test.cardId, file: loaded.file, name: scenario.name, passed: true };
  } catch (error) {
    return {
      suiteId: loaded.test.cardId,
      file: loaded.file,
      name: scenario.name,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function listCardTests(filters: readonly string[] = []): CardTestListing[] {
  validateTestInventory();
  return selectTests(filters).map((loaded) => ({
    cardId: loaded.test.cardId,
    cardName: getCard(loaded.test.cardId).name,
    file: loaded.file,
    cases: loaded.test.scenarios.map(({ name }) => name),
  }));
}

export function runCardTests(options: CardTestRunOptions = {}): CardTestResult[] {
  validateTestInventory();
  const caseFilter = options.caseFilter?.toLowerCase();
  const results: CardTestResult[] = [];
  for (const loaded of selectTests(options.filters ?? [])) {
    const scenarios = loaded.test.scenarios.filter(({ name }) => !caseFilter || name.toLowerCase().includes(caseFilter));
    for (const scenario of scenarios) {
      const result = runScenario(loaded, scenario);
      results.push(result);
      if (!result.passed && options.failFast) return results;
    }
  }
  if (caseFilter && !results.length) throw new Error(`No test case matched: ${options.caseFilter}`);
  return results;
}
