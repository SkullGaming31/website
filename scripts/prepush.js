#!/usr/bin/env node
// Cross-platform pre-push runner that runs `npm test` and exits with the same code.
/* eslint-disable @typescript-eslint/no-require-imports */
/* Allow CommonJS require here because this script is executed by Node directly */
const { spawn } = require('child_process');

const isWin = process.platform === 'win32';
const cmd = isWin ? 'npm.cmd' : 'npm';
const args = ['test'];

console.log('Running `npm test` (pre-push) ...');

const child = spawn(cmd, args, { stdio: 'inherit' });

child.on('close', (code) => {
  if (code === 0) {
    console.log('Tests passed — continuing push.');
  } else {
    console.error(`Tests failed (exit ${code}) — aborting push.`);
  }
  process.exit(code);
});
