import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function makeTempDir(prefix = 'fw-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function waitForEvent(emitter, eventName, { timeout = 2000, filter = null } = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for '${eventName}'`));
    }, timeout);

    const handler = (payload) => {
      if (filter && !filter(payload)) return;
      cleanup();
      resolve(payload);
    };

    const cleanup = () => {
      clearTimeout(timer);
      emitter.off(eventName, handler);
    };

    emitter.on(eventName, handler);
  });
}

export function touch(filePath) {
  fs.writeFileSync(filePath, Math.random().toString());
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function supportsRecursiveWatch(dir) {
  try {
    const watcher = fs.watch(dir, { recursive: true });
    watcher.close();
    return true;
  } catch (e) {
    return false;
  }
}
