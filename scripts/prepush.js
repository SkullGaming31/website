#!/usr/bin/env node
// Cross-platform pre-push runner that runs `npm test` and exits with the same code.
/* eslint-disable @typescript-eslint/no-require-imports */
/* Allow CommonJS require here because this script is executed by Node directly */
const { execSync } = require('child_process');

console.log('Running lint and tests (pre-push) using shell execSync ...');

try {
  // Use shell exec to avoid spawn EINVAL failures on some Windows environments.
  execSync('npm run lint && npm test', { stdio: 'inherit', shell: true });
  console.log('Lint and tests passed — continuing push.');
  process.exit(0);
} catch (e) {
  console.error('Lint or tests failed — aborting push.');
  process.exit(e.status || 1);
}
