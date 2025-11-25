import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { FileWatcher } from '../filewatcher.js';
import { makeTempDir, waitForEvent, touch } from './helpers.js';

// Verifies the README usage snippet works (with the options as written)
test('README example watches for file changes', async () => {
  const tmpDir = makeTempDir('fw-readme-');
  const watcher = new FileWatcher(tmpDir, { recursiveMode: true }); // as in README

  watcher.start();

  const expected = 'foo.txt';
  touch(path.join(tmpDir, expected)); // creation triggers fs.watch event

  const event = await waitForEvent(watcher, 'change', {
    timeout: 4000,
    filter: (e) => e && e.filename === expected,
  });

  watcher.stop();

  assert.equal(event.filename, expected);
  assert.ok(['rename', 'change'].includes(event.eventType));
});
