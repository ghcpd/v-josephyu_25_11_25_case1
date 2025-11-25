import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { FileWatcher } from '../filewatcher.js';
import { makeTempDir, waitForEvent } from './helpers.js';

// Verifies debounceEvents publishes debouncedChange once
 test('debounceEvents emits a single debouncedChange for bursts', async () => {
  const tmpDir = makeTempDir('fw-debounce-');
  const watcher = new FileWatcher(tmpDir);

  watcher.debounceEvents(100);
  watcher.start();

  const file = path.join(tmpDir, 'a.log');
  fs.writeFileSync(file, 'v1');
  fs.writeFileSync(file, 'v2');
  fs.writeFileSync(file, 'v3');

  const event = await waitForEvent(watcher, 'debouncedChange', {
    timeout: 4000,
    filter: (e) => e && e.filename === 'a.log',
  });

  watcher.stop();

  assert.equal(event.filename, 'a.log');
});
