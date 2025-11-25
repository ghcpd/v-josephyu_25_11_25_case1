import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { FileWatcher } from '../filewatcher.js';
import { makeTempDir } from './helpers.js';

// Verifies deprecated watchOnce works and warns
 test('watchOnce warns and resolves when file appears', async () => {
  const tmpDir = makeTempDir('fw-once-');
  const watcher = new FileWatcher(tmpDir);
  const target = 'foo-bar.txt';

  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (msg) => warnings.push(msg);

  const promise = watcher.watchOnce(target);

  setTimeout(() => {
    fs.writeFileSync(path.join(tmpDir, target), 'hello');
  }, 300);

  const result = await promise;
  console.warn = originalWarn;

  assert.equal(result, true);
  assert.ok(warnings.length > 0);
  assert.ok(warnings.some((w) => String(w).includes('deprecated')));
});
