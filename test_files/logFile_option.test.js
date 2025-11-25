import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { FileWatcher } from '../filewatcher.js';
import { makeTempDir, waitForEvent, touch } from './helpers.js';

// Verifies logFile option writes events and stop message
 test('logFile option writes change and stop logs', async () => {
  const tmpDir = makeTempDir('fw-log-');
  const logFile = path.join(tmpDir, 'events.log');

  const watcher = new FileWatcher(tmpDir, { logFile });
  watcher.start();

  const filename = 'logme.txt';
  touch(path.join(tmpDir, filename));
  await waitForEvent(watcher, 'change', { filter: (e) => e.filename === filename });

  watcher.stop();

  const content = fs.readFileSync(logFile, 'utf8');
  assert.match(content, /Event:/);
  assert.match(content, /All watchers stopped/);
});
