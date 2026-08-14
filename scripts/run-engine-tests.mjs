import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { runEngineSelfTests } = await server.ssrLoadModule('/src/game/engine.testHarness.ts');
  const results = runEngineSelfTests();
  for (const result of results) {
    console.log((result.passed ? 'PASS' : 'FAIL') + ' ' + result.name + (result.error ? ': ' + result.error : ''));
  }
  const failed = results.filter(({ passed }) => !passed);
  if (failed.length) process.exitCode = 1;
} finally {
  await server.close();
}
