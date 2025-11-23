#!/usr/bin/env node
// Cross-platform pre-push runner that runs `npm test` and exits with the same code.
/* eslint-disable @typescript-eslint/no-require-imports */
/* Allow CommonJS require here because this script is executed by Node directly */
const { spawn, execSync } = require('child_process');

console.log('Running `npm run lint` then `npm test` (pre-push) ...');

function runCommandSpawn(command, args) {
  const isWin = process.platform === 'win32';
  const cmd = isWin ? `${command}.cmd` : command;
  return spawn(cmd, args, { stdio: 'inherit' });
}

async function runChecks() {
  try {
    // 1) Run lint first (preferred). If lint fails, abort push.
    console.log('Running lint (npm run lint) ...');
    try {
      const lintChild = runCommandSpawn('npm', ['run', 'lint']);
      await new Promise((resolve, reject) => {
        lintChild.on('close', (code) => (code === 0 ? resolve() : reject(code)));
        lintChild.on('error', reject);
      });
      console.log('Lint passed.');
    } catch (lintErr) {
      console.error('Lint failed (exit', lintErr, ') — aborting push.');
      process.exit(typeof lintErr === 'number' ? lintErr : 1);
    }

    // 2) Run tests
    console.log('Running tests (npm test) ...');
    try {
      const testChild = runCommandSpawn('npm', ['test']);
      await new Promise((resolve, reject) => {
        testChild.on('close', (code) => (code === 0 ? resolve() : reject(code)));
        testChild.on('error', reject);
      });
      console.log('Tests passed — continuing push.');
      process.exit(0);
    } catch (testErr) {
      console.error('Tests failed (exit', testErr, ') — aborting push.');
      process.exit(typeof testErr === 'number' ? testErr : 1);
    }
  } catch (err) {
    // If spawn throws synchronously (some Windows environments), fall back to execSync shell invocation
    console.warn('Spawn failed or threw; falling back to shell execSync:', err && err.code);
    try {
      // Run lint then tests in a single shell invocation to preserve ordering
      execSync('npm run lint && npm test', { stdio: 'inherit', shell: true });
      console.log('Lint and tests passed — continuing push.');
      process.exit(0);
    } catch (e) {
      console.error('Lint or tests failed via fallback — aborting push.');
      process.exit(e.status || 1);
    }
  }
}

runChecks();
