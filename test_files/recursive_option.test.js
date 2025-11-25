import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { FileWatcher } from '../filewatcher.js';
import { makeTempDir, waitForEvent, supportsRecursiveWatch } from './helpers.js';

const tmpProbeDir = makeTempDir('fw-rec-probe-');
const canRecursive = supportsRecursiveWatch(tmpProbeDir);
fs.rmSync(tmpProbeDir, { recursive: true, force: true });

// Verifies recursive option works when supported by platform
 test('recursive option watches nested directories', { skip: !canRecursive }, async () => {
  const tmpDir = makeTempDir('fw-rec-');
  const nestedDir = path.join(tmpDir, 'nested');
  fs.mkdirSync(nestedDir, { recursive: true });

  const watcher = new FileWatcher(tmpDir, { recursive: true });
  watcher.start();

  const filename = 'foo.txt';
  fs.writeFileSync(path.join(nestedDir, filename), 'hi');

  const event = await waitForEvent(watcher, 'change', {
    timeout: 4000,
    filter: (e) => e && e.filename === path.join('nested', filename) || e.filename === filename,
  });

  watcher.stop();

  // fs.watch on Windows may report filename with subpath or only basename; accept either
  assert.ok(event.filename.includes('foo'));
});
