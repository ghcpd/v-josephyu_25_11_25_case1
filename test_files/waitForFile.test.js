import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { FileWatcher } from '../filewatcher.js';
import { makeTempDir, delay } from './helpers.js';

// Verifies waitForFile resolves when file appears and rejects on timeout
 test('waitForFile resolves when file is created', async () => {
  const tmpDir = makeTempDir('fw-wait-');
  const watcher = new FileWatcher(tmpDir);

  const target = 'newfile.txt';
  const promise = watcher.waitForFile(target, 3000);

  setTimeout(() => {
    fs.writeFileSync(path.join(tmpDir, target), 'hello');
  }, 500);

  const result = await promise;
  assert.equal(result, true);
});

 test('waitForFile rejects when timeout elapses', async () => {
  const tmpDir = makeTempDir('fw-wait-');
  const watcher = new FileWatcher(tmpDir);

  await assert.rejects(() => watcher.waitForFile('missing.txt', 500), /Timeout/);
});
