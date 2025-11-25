# FileWatcher Pro v1.2 — Corrected Documentation

A simple Node.js utility for watching file changes in a directory.

## Installation

```bash
npm install filewatcher-pro
```

## Usage (basic)

```javascript
import { FileWatcher } from "./filewatcher.js";

// Note: option name is `recursive` (not `recursiveMode`).
const watcher = new FileWatcher("./logs", { recursive: true });

watcher.on("change", (event) => {
  console.log("File changed:", event.filename);
});

watcher.start();
```

## Full API Reference

### new FileWatcher(targetDir, options)
Create a watcher for the specified directory.

Options (supported):
- `recursive` (boolean) — Enable recursive watching of subdirectories. Default false. (README previously said `recursiveMode` — that's incorrect.)
- `filter` (RegExp) — Optional. If provided, only file names matching this RegExp will trigger events.
- `logFile` (string) — Optional path to append a log entry for each event.
- `usePolling` (boolean) — Deprecated; library keeps a handshake flag but no polling implementation. Avoid using.

### start()
Begin watching for file changes.

### stop()
Stop all watchers. Emits `stopped` event.

### debounceEvents(delayMs = 100)
Debounce `change` events; when you call this method it registers an internal handler that will emit a single `debouncedChange` event after `delayMs` of inactivity. Use this to suppress rapid sequences of change events.

Example:
```javascript
watcher.debounceEvents(200);
watcher.on('debouncedChange', e => console.log('debounced event', e));
```

### waitForFile(filename, timeoutMs = 5000)
Return a Promise which resolves when `filename` exists inside the watched directory, or rejects after `timeoutMs`.

Example:
```javascript
await watcher.waitForFile('done.txt', 10000);
```

### Events
- `change` — emitted each time `fs.watch` reports a change: listener receives { eventType, filename }.
- `debouncedChange` — emitted after `debounceEvents()` consolidates rapid events.
- `stopped` — emitted after `stop()` is called.

### Deprecated API
- `watchOnce(filename)` — deprecated in favor of `waitForFile(filename)`. Calling it emits a console warn and performs the same behavior as `waitForFile`.

## Examples

1) Basic watch
```javascript
import { FileWatcher } from './filewatcher.js';
const watcher = new FileWatcher('./logs', { recursive: true });
watcher.on('change', e => console.log('changed', e));
watcher.start();
```

2) Use filter and a log file
```javascript
const watcher = new FileWatcher('./tmp', { recursive: false, filter: /\.txt$/, logFile: './tmp/watch.log' });
watcher.start();
```

3) Debounce events and wait for a file
```javascript
const watcher = new FileWatcher('./tmp');
watcher.debounceEvents(200);
watcher.on('debouncedChange', e => console.log('debounced', e));
watcher.start();

await watcher.waitForFile('trigger.txt', 5000);
```

---

Notes
- The module supports additional helper options (`filter`, `logFile`) not present in the original README and documented here.
- `usePolling` is a deprecated flag in the implementation and should not be used.
