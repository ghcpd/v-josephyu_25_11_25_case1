import test from 'node:test';
import assert from 'node:assert/strict';
import { FileWatcher } from '../filewatcher.js';
import { makeTempDir, waitForEvent } from './helpers.js';

// Verifies stop emits 'stopped' and clears watchers
 test('stop emits stopped event and clears watchers', async () => {
  const tmpDir = makeTempDir('fw-stop-');
  const watcher = new FileWatcher(tmpDir);
  watcher.start();

  const stoppedPromise = waitForEvent(watcher, 'stopped');
  watcher.stop();

  await stoppedPromise;
  assert.equal(watcher.watchers.length, 0);
});
