import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { FileWatcher } from '../filewatcher.js';
import { makeTempDir, delay } from './helpers.js';

// Verifies undocumented filter option
test('filter option emits only matching filenames', async () => {
  const tmpDir = makeTempDir('fw-filter-');
  const watcher = new FileWatcher(tmpDir, { filter: /\.log$/ });

  const events = [];
  watcher.on('change', (evt) => events.push(evt));

  watcher.start();

  fs.writeFileSync(path.join(tmpDir, 'foo.txt'), 'nope');
  fs.writeFileSync(path.join(tmpDir, 'bar.log'), 'yes');

  await delay(1000);
  watcher.stop();

  assert.ok(events.length >= 1);
  assert.ok(events.every((e) => /\.log$/.test(e.filename)), 'Only .log events should be emitted');
});
