#!/usr/bin/env node
'use strict';
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const command = process.argv[2] || '--help';
if (command === 'path') { console.log(root); }
else if (command === '--help' || command === '-h') {
 console.log('progress-checklist: install | path | --help\ninstall registers the npm package marketplace and installs the plugin in Codex.\nRequires Node.js 20+ and the Codex CLI on PATH.');
} else if (command === 'install') {
 const executable = process.env.CODEX_BIN || (process.platform === 'win32' ? 'codex.exe' : 'codex');
 for (const args of [['plugin','marketplace','add',root],['plugin','add','progress-checklist@progress-checklist-local']]) {
  const result = spawnSync(executable, args, { stdio: 'inherit', shell: false });
  if (result.error) { console.error('Cannot start Codex. Put its executable on PATH or set CODEX_BIN to its full executable path. ' + result.error.message); process.exit(1); }
  if (result.status !== 0) process.exit(result.status || 1);
 }
 console.log('Installed. Restart the desktop app and start a new chat to load the plugin.');
} else { console.error('Unknown command: ' + command + '. Use --help.'); process.exitCode = 1; }
