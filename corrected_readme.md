# FileWatcher Pro v1.2 (Corrected Documentation)

This updated README expands the API documentation and provides working examples for all features found in the implementation (`filewatcher.js`) including undocumented features like `filter`, `logFile`, `debounceEvents`, `waitForFile`, and a deprecated `watchOnce` method.

---

## Installation

```bash
npm install filewatcher-pro
```

*Note: This repository contains a local implementation for testing. If you copy to another project, ensure `filewatcher.js` is available in your module resolution path.*

## Quick Usage (fixed example)

```javascript
import { FileWatcher } from "./filewatcher.js";

// Ensure the target folder exists before starting the watcher
import fs from 'fs';
if (!fs.existsSync('./logs')) fs.mkdirSync('./logs', { recursive: true });

const watcher = new FileWatcher('./logs', { recursive: true });

watcher.on('change', (event) => {
  console.log('File changed:', event.filename, 'type:', event.eventType);
});

watcher.on('stopped', () => { console.log('All watchers stopped'); });

watcher.start();

// Later, to stop
// watcher.stop();
```

### What changed from older README
- The options object uses `recursive` (boolean) to enable recursion, not `recursiveMode`.
- You must create the folder before calling `start()` to avoid an ENOENT error.

---

## API Reference

### Class: `new FileWatcher(targetDir, options = {})`
Create a watcher for the specified directory.

- `targetDir` (string) - Path to the directory to watch. Must exist before calling `start()`.
- `options` (object)
  - `recursive` (boolean) - Enable recursive watching (applies to platforms that support it).
  - `filter` (RegExp) - Optional RegExp to filter which filenames will emit `change` events.
  - `logFile` (string) - Optional file path to append log messages (synchronously by design).
  - `usePolling` (boolean) - Deprecated. Present for compatibility, but no effect.

  - `usePolling` (boolean) - Optional polling fallback for environments where native `fs.watch` may be unreliable (e.g., Git Bash on Windows). When enabled, FileWatcher will scan files on an interval and emit equivalent `change`/`rename` events. Use with caution for high-throughput directories.
  - `pollInterval` (number) - Optional interval in milliseconds used when `usePolling` is enabled (default 200ms).

Properties:
- `logs` (string[]) - In-memory array of log entries appended via `_log()`.

Events (EventEmitter):
- `change` - Emitted on every change. Callback signature: `(event) => { event.eventType, event.filename }`.
  - `event.eventType` is a string from Node's `fs.watch` API (commonly `rename` or `change`).
  - Node's `fs.watch` is platform-dependent and may emit both `rename` and `change` events for a single file operation.
- `debouncedChange` - Emitted by `debounceEvents()` (see below) for debounced events.
- `stopped` - Emitted after `stop()` is called and watchers are closed.

Methods:
- `start()` - Begin watching for file changes. Note: if `targetDir` doesn't exist, this will throw an ENOENT error.
- `stop()` - Stop all watchers and emit `stopped`.
- `debounceEvents(delayMs = 100)` - Attach an internal debouncer such that multiple `change` events within `delayMs` are collapsed and a single `debouncedChange` is emitted with the last event.
- `waitForFile(filename, timeoutMs = 5000)` - Returns a Promise that resolves if the file appears under `targetDir` within `timeoutMs`, otherwise the Promise rejects with a Timeout error.
- `watchOnce(filename)` - Deprecated; console.warn('deprecated'). Internally calls `waitForFile(filename)`; prefer `waitForFile` directly.

Private / Internal:
- `_log(message)` - Adds a timestamped message to the `logs` array and appends it to `logFile` synchronously if set. Avoid calling heavy log write operations in high-throughput production scenarios.

---

## Advanced usage and tests

- Recursive watching and filter

```javascript
import { FileWatcher } from './filewatcher.js';
import fs from 'fs';

fs.mkdirSync('./tmplogs', { recursive: true });
const watcher = new FileWatcher('./tmplogs', { recursive: true, filter: /\\.txt$/ });
watcher.on('change', (e) => console.log('change: ', e));
watcher.start();

// Only .txt files will emit change events
fs.writeFileSync('./tmplogs/hello.txt','x');
fs.writeFileSync('./tmplogs/hello.log','x');

setTimeout(() => watcher.stop(), 2000);
```

- Debounced change events

```javascript
import { FileWatcher } from './filewatcher.js';

const watcher = new FileWatcher('./tmplogs');
watcher.debounceEvents(200); // emits debouncedChange after 200ms
watcher.on('debouncedChange', (e) => console.log('debounced:', e));
watcher.start();
```

- Waiting for files

```javascript
import { FileWatcher } from './filewatcher.js'

const w = new FileWatcher('./tmplogs');
await w.waitForFile('myfile.txt'); // resolves if file appears
```

- Logs

```javascript
const w = new FileWatcher('./tmplogs', { logFile: './awatch.log' });
// later inspect w.logs array and the file './awatch.log'
```

---

## Platform notes
- `fs.watch` behavior is platform-dependent. On some platforms you may see `rename` + `change` for the same filesystem operation. If you need consistent cross-platform behavior, consider using a library like `chokidar` which normalizes events across platforms.

## Migration & Deprecation
- `watchOnce()` is deprecated: prefer `waitForFile()`.
- `usePolling` option present for compatibility and currently has no effect; will be removed in future major release.

- `usePolling` is now supported as a fallback; set `usePolling: true` and optional `pollInterval` to enable it. This helps when running tests or using the package under shells where `fs.watch` seems to miss events (e.g., Git Bash on Windows). Note that polling consumes more CPU and can cause higher I/O.

---

## Running the test harness
1. Ensure `node` and `npm` are installed (node >= 16 recommended).
2. From repository root:

```bash
npm run test:readme
node ./test_files/test_all_features.js
```

Or run the provided `run_tests.sh`.

---

For any questions or to request changes to the behavior (e.g., creating the target directory automatically), file an issue or submit a PR.
