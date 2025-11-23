#!/usr/bin/env node
// Cross-platform pre-push runner that runs `npm test` and exits with the same code.
/* eslint-disable @typescript-eslint/no-require-imports */
/* Allow CommonJS require here because this script is executed by Node directly */
const { execSync } = require('child_process');

console.log('Running lint and tests (pre-push) using shell execSync ...');

try {
  // Run lint first but do NOT abort the push on lint failures (show errors only).
  try {
    execSync('npm run lint', { stdio: 'inherit', shell: true });
    console.log('Lint passed.');
  } catch (lintErr) {
    console.warn('Lint finished with errors (push will continue, but consider fixing):', lintErr && lintErr.status);
  }

  // Now run tests and abort if they fail.
  execSync('npm test', { stdio: 'inherit', shell: true });
  console.log('Tests passed — continuing push.');
  process.exit(0);
} catch (e) {
  console.error('Tests failed — aborting push.');
  process.exit(e.status || 1);
}
