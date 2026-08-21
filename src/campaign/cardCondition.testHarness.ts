import { rollCardCondition } from './cardCondition';
import {
  calculateSgsGrade, getSgsSubgrades, gradeCardWithSgs,
} from './grading';

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
    run('SGS rounds hidden condition averages to half grades', () => {
      const roundedDown = calculateSgsGrade({ centering: 9.2, corners: 9.2, edges: 9.2, surface: 9.2 });
      const roundedUp = calculateSgsGrade({ centering: 9.3, corners: 9.3, edges: 9.3, surface: 9.3 });
      expect(roundedDown === 9, `Expected 9.2 to round to 9.0, received ${roundedDown}`);
      expect(roundedUp === 9.5, `Expected 9.3 to round to 9.5, received ${roundedUp}`);
    }),
    run('SGS subgrades use the same half-grade scale as the overall grade', () => {
      const subgrades = getSgsSubgrades({ centering: 8.6, corners: 9.9, edges: 9.6, surface: 9.1 });
      expect(subgrades.centering === 8.5, `Expected 8.6 to round to 8.5, received ${subgrades.centering}`);
      expect(subgrades.corners === 10, `Expected 9.9 to round to 10.0, received ${subgrades.corners}`);
      expect(subgrades.edges === 9.5, `Expected 9.6 to round to 9.5, received ${subgrades.edges}`);
      expect(subgrades.surface === 9, `Expected 9.1 to round to 9.0, received ${subgrades.surface}`);
      expect(calculateSgsGrade(subgrades) === 9.5, 'Rounded subgrades did not produce the expected 9.5 overall grade');
    }),
    run('SGS certification is stable and does not regrade a card', () => {
      const card = {
        instanceId: '12345678-abcd-4000-8000-123456789abc',
        cardId: 'test-card',
        condition: { centering: 9.5, corners: 10, edges: 9.7, surface: 9.8 },
      };
      const graded = gradeCardWithSgs(card);
      const gradedAgain = gradeCardWithSgs(graded);
      expect(graded.grading?.grade === 10, `Expected a 10.0 SGS grade, received ${graded.grading?.grade}`);
      expect(graded.grading?.certificateNumber === 'SGS-12345678ABCD', 'SGS certificate number was not stable');
      expect(gradedAgain === graded, 'SGS regraded an already certified card');
    }),
  ];
}
