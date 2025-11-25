# FileWatcher Pro v1.2 (Corrected)

A minimal Node.js utility (ESM) for watching file changes. Extends Node's `EventEmitter` and wraps `fs.watch` with filtering, debouncing, and async helpers.

## Requirements
- Node.js ≥ 18
- ESM enabled (set `"type": "module"` in `package.json`, or run with `node --input-type=module`)

> **CommonJS?** This package ships as ESM. Use dynamic `import()` from CommonJS if needed.

## Installation
```bash
npm install
# local usage: npm install .
```

## Quick Start (ESM)
```js
import { FileWatcher } from './filewatcher.js';

const watcher = new FileWatcher('./logs', {
  recursive: true,        // platform: macOS/Windows only
  filter: /\.log$/        // only watch .log files
});

watcher.on('change', ({ eventType, filename }) => {
  console.log(`[change] ${eventType}: ${filename}`);
});

watcher.on('stopped', () => {
  console.log('Watcher stopped');
});

watcher.start();

// later...
// watcher.stop();
```

## API Reference

### `new FileWatcher(targetDir, options = {})`
Creates a watcher for `targetDir`.

| Option        | Type                | Default | Description |
|---------------|---------------------|---------|-------------|
| `recursive`   | `boolean`           | `false` | Watch subdirectories (macOS/Windows only). |
| `filter`      | `RegExp`\|`string`  | `null`  | Only emit `change` events whose `filename` matches. |
| `logFile`     | `string`            | `null`  | Append logs to this file (sync writes). |
| `usePolling`  | `boolean`           | `false` | **Deprecated / no-op.** Present for backward compatibility. |

> **Note:** The prior README used `recursiveMode`; the implementation expects `recursive`.

### Events
- `change`: `{ eventType, filename }` emitted directly from `fs.watch` callback.
- `debouncedChange`: emitted by `debounceEvents()` with the *last* `change` payload after the configured delay.
- `stopped`: emitted after `.stop()` closes all watchers.

### Methods
- `start()`: Begin watching. Not idempotent (calling twice creates two watchers).
- `stop()`: Close all watchers, log `"All watchers stopped"`, emit `stopped`.
- `debounceEvents(delayMs = 100)`: Subscribes internally to `change` and emits `debouncedChange` after quiescence.
- `waitForFile(filename, timeoutMs = 5000)`: Promise that resolves `true` when `targetDir/filename` appears; rejects on timeout.
- `watchOnce(filename)`: **Deprecated.** Alias for `waitForFile` with a deprecation warning.
- `_log(message)`: Internal helper; also pushes into `watcher.logs`.

### Properties
- `watchers`: Array of active `fs.FSWatcher` instances (internal).
- `logs`: Array of in-memory log strings.

## Usage Examples

### Filtered Watch
```js
import { FileWatcher } from './filewatcher.js';
const watcher = new FileWatcher('./logs', { filter: /\.log$/ });
watcher.on('change', ({ filename }) => console.log('log changed:', filename));
watcher.start();
```

### Debounced Watch
```js
import { FileWatcher } from './filewatcher.js';
const watcher = new FileWatcher('./data');
watcher.debounceEvents(200);
watcher.on('debouncedChange', ({ filename }) => console.log('debounced:', filename));
watcher.start();
```

### Wait for a File
```js
import { FileWatcher } from './filewatcher.js';
const watcher = new FileWatcher('./uploads');
await watcher.waitForFile('incoming.csv', 10000);
console.log('File arrived!');
```

### Logging to a File
```js
import { FileWatcher } from './filewatcher.js';
const watcher = new FileWatcher('./logs', { logFile: './events.log' });
watcher.start();
// ... create/modify files ...
watcher.stop(); // events.log will contain entries and a stop message
```

### CommonJS Interop
```js
// index.cjs
(async () => {
  const { FileWatcher } = await import('./filewatcher.js');
  const watcher = new FileWatcher('./logs');
  watcher.on('change', console.log);
  watcher.start();
})();
```

## Testing
```bash
npm test
# or
node --test test_files/*.test.js
```

The included tests validate the README example and all documented APIs.

## Caveats
- `fs.watch` behavior varies by OS; `recursive` is unsupported on Linux.
- Multiple calls to `.start()` will create multiple watchers; call `.stop()` to clean up.
- `logFile` writes synchronously; avoid high-frequency events if logging to disk.
