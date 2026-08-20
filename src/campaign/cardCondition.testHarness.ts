import { rollCardCondition } from './cardCondition';
import { calculateSgsGrade, gradeCardWithSgs } from './grading';

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
    run('SGS calculates a one-decimal average from hidden condition scores', () => {
      const grade = calculateSgsGrade({ centering: 8, corners: 9, edges: 9, surface: 9 });
      expect(grade === 8.8, `Expected an 8.8 SGS grade, received ${grade}`);
    }),
    run('SGS certification is stable and does not regrade a card', () => {
      const card = {
        instanceId: '12345678-abcd-4000-8000-123456789abc',
        cardId: 'test-card',
        condition: { centering: 9.5, corners: 10, edges: 9.7, surface: 9.8 },
      };
      const graded = gradeCardWithSgs(card);
      const gradedAgain = gradeCardWithSgs(graded);
      expect(graded.grading?.grade === 9.8, `Expected a 9.8 SGS grade, received ${graded.grading?.grade}`);
      expect(graded.grading?.certificateNumber === 'SGS-12345678ABCD', 'SGS certificate number was not stable');
      expect(gradedAgain === graded, 'SGS regraded an already certified card');
    }),
  ];
}
