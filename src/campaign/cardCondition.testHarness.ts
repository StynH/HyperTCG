import { rollCardCondition } from './cardCondition';

interface TestResult { name: string; passed: boolean; error?: string }

function run(name: string, test: () => void): TestResult {
  try {
    test();
    return { name, passed: true };
  } catch (error) {
    return { name, passed: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function expect(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

export function runCardConditionTests(): TestResult[] {
  return [
    run('condition rolls respect their minimum values', () => {
      const condition = rollCardCondition(() => 0);
      expect(condition.centering === 8, 'Centering minimum was not 8');
      expect(condition.corners === 9, 'Corners minimum was not 9');
      expect(condition.edges === 9, 'Edges minimum was not 9');
      expect(condition.surface === 9, 'Surface minimum was not 9');
    }),
    run('condition rolls can reach their rounded maximum values', () => {
      const condition = rollCardCondition(() => 0.999);
      expect(Object.values(condition).every((score) => score === 10), 'A condition score did not reach 10');
    }),
    run('condition rolls are stored to one decimal place', () => {
      const condition = rollCardCondition(() => 0.333);
      expect(condition.centering === 8.7, 'Centering was not rounded to one decimal');
      expect(condition.corners === 9.3, 'A condition score was not rounded to one decimal');
    }),
    run('condition rolls reject invalid random values', () => {
      let didThrow = false;
      try {
        rollCardCondition(() => 1);
      } catch {
        didThrow = true;
      }
      expect(didThrow, 'An invalid random value was accepted');
    }),
  ];
}
