# FileWatcher Pro v1.2 — Complete Reference & Working Examples

This document corrects and expands on the original README.md. It documents all public and useful semi-public APIs found in the implementation and provides runnable examples and test guidance.

## Installation

```bash
npm install filewatcher-pro
```

> NOTE: This repository's examples assume you run them via `node` from the project workspace (no published package required). Examples use the local module `filewatcher.js`.

## Quick example (recommended)

```javascript
import { FileWatcher } from './filewatcher.js';

const watcher = new FileWatcher('./logs', { recursive: true });

watcher.on('change', (event) => {
  console.log('File changed:', event.filename, 'type:', event.eventType);
});

watcher.start();

// create files under ./logs to trigger events
```

## Constructor and options

`new FileWatcher(targetDir, options = {})`

- `targetDir` (string) — directory to monitor (required).
- `options.recursive` (boolean) — enable recursive watching (default: false). **Note:** the implementation uses `recursive` (not `recursiveMode` as in some older docs). If you previously copied `recursiveMode`, update it to `recursive`.
- `options.filter` (RegExp) — if provided, only file names matching this regular expression will emit events.
- `options.logFile` (string) — if provided, each internal log entry (timestamped) will be appended to this file.
- `options.usePolling` (boolean) — present in the code but not used for any active polling behavior; treated as a deprecated option. It is kept for backward compatibility and will be explicitly listed as deprecated.

The instance has these useful runtime properties (read-only helpful internal state):
- `watcher.recursive` (boolean) — the effective recursive flag used.
- `watcher.filter` (RegExp|null) — the filter provided.
- `watcher.logFile` (string|null) — path to log file if provided.
- `watcher.logs` (Array) — in-memory array of timestamped log entries (for debugging/testing).

## Methods

- `start()` — begin watching the targetDir (returns void). Emits `change` events.
- `stop()` — closes all watchers and emits `stopped`.
- `debounceEvents(delayMs = 100)` — installs a handler on `change` events that will emit `debouncedChange` with the last event after `delayMs` ms of inactivity.
- `waitForFile(filename, timeoutMs = 5000)` — returns a Promise that resolves to `true` when a path exists at `targetDir/filename`. Important: pass only the filename relative to `targetDir`, not an absolute or full path that also contains the target directory again. The promise rejects with Error on timeout.
- `watchOnce(filename)` — DEPRECATED: prints a console warning and returns `waitForFile(filename)` (Promise). Use `waitForFile` instead.

## Events

- `change` — emitted for each raw file change. Listener: (event) => { event.eventType, event.filename }
- `debouncedChange` — emitted when `debounceEvents()` is used and a debounced event fires.
- `stopped` — emitted when `stop()` completes.

## Examples

1) Working README-style example (fixed option name):

```javascript
import { FileWatcher } from './filewatcher.js';
const watcher = new FileWatcher('./logs', { recursive: true });
watcher.on('change', (event) => console.log('File changed:', event.filename));
watcher.start();
```

2) Example showing `filter` and `logFile`:

```javascript
import fs from 'fs';
import { FileWatcher } from './filewatcher.js';

if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');
const watcher = new FileWatcher('./logs', { filter: /\.log$/i, logFile: './watch.log' });
watcher.on('change', e => console.log('change:', e));
watcher.debounceEvents(80);
watcher.on('debouncedChange', e => console.log('debouncedChange:', e));
watcher.start();

// Create a matching file ./logs/some.LOG to see logs and watch.log entries
```

3) Using `waitForFile` and `watchOnce` (note the API expectations):

```javascript
import { FileWatcher } from './filewatcher.js';
const w = new FileWatcher('./logs');

// waitForFile takes the filename relative to targetDir
w.waitForFile('some-file.txt', 5000).then(() => console.log('file exists')).catch(err => console.error('timeout'));

// watchOnce is deprecated but still works:
w.watchOnce('once.txt').then(() => console.log('once observed'));
```

## Notes and recommendations

- If docs or older examples show `recursiveMode`, switch to `recursive` (or support both names in the constructor if you want backward compatibility).
- Document `filter` and `logFile` since they are handy for production usage.
- Consider removing `usePolling` or implementing actual polling if you advertise it.
- Keep `watchOnce` marked as deprecated — prefer `waitForFile`.

---

## Quick run / tests
For convenience, this workspace includes `examples/` with runnable scripts and a small `run_tests.sh` to exercise examples automatically.

(End of corrected_readme.md)