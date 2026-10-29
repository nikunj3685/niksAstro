const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const source = path.join(__dirname, '..', 'offline-tiles', 'dss-color-offline');
const dest = path.join(__dirname, '..', 'dist', 'niks-astro', 'browser', 'vendor', 'dss-color-offline');

if (!fs.existsSync(source)) {
  console.warn(`[copy-tiles] Offline tile cache not found at ${source} - skipping (app will fall back to the online survey).`);
  process.exit(0);
}

console.log(`[copy-tiles] Syncing offline tile cache into ${dest} (only changed files are copied)...`);
const result = spawnSync(
  'robocopy',
  [source, dest, '/MIR', '/MT:32', '/NFL', '/NDL', '/NJH', '/NJS', '/NP', '/R:2', '/W:2'],
  { stdio: 'inherit', shell: true }
);

// Robocopy's exit code is a bitmask: 0-7 means success (including "nothing to
// copy"), 8+ means at least one failure - it is not a conventional 0-on-success code.
if (result.status !== null && result.status >= 8) {
  console.error(`[copy-tiles] robocopy reported failures (exit code ${result.status})`);
  process.exit(1);
}

console.log('[copy-tiles] Done.');
process.exit(0);
