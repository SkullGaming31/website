#!/usr/bin/env node
// Cross-platform pre-push runner that runs `npm test` and exits with the same code.
/* eslint-disable @typescript-eslint/no-require-imports */
/* Allow CommonJS require here because this script is executed by Node directly */
const { spawn, execSync } = require('child_process');

console.log('Running `npm test` (pre-push) ...');

try {
  // Try a cross-platform spawn first (preferred for streaming output).
  const isWin = process.platform === 'win32';
  const cmd = isWin ? 'npm.cmd' : 'npm';
  const args = ['test'];

  const child = spawn(cmd, args, { stdio: 'inherit' });
  child.on('close', (code) => {
    if (code === 0) {
      console.log('Tests passed — continuing push.');
    } else {
      console.error(`Tests failed (exit ${code}) — aborting push.`);
    }
    process.exit(code);
  });
} catch (err) {
  // Some Windows environments throw EINVAL on spawn; fall back to execSync with a shell.
  console.warn('Spawn failed, falling back to execSync shell invocation:', err && err.code);
  try {
    execSync('npm test', { stdio: 'inherit', shell: true });
    console.log('Tests passed — continuing push.');
    process.exit(0);
  } catch (e) {
    console.error('Tests failed or could not be run via execSync — aborting push.');
    process.exit(e.status || 1);
  }
}
