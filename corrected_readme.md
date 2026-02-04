# FileWatcher Pro v1.2 - Complete Documentation

A simple Node.js utility for watching file changes in a directory with advanced features like event debouncing, file existence waiting, and optional logging.

## Installation

```bash
npm install filewatcher-pro
```

## Quick Start

```javascript
import { FileWatcher } from "./filewatcher.js";

const watcher = new FileWatcher("./logs", { recursive: true });

watcher.on("change", (event) => {
  console.log("File changed:", event.filename);
});

watcher.start();
```

## API Reference

### Constructor

#### `new FileWatcher(targetDir, options)`

Create a watcher for the specified directory.

**Parameters:**
- `targetDir` (string): The directory path to watch
- `options` (object): Configuration options
  - `recursive` (boolean, default: `false`): Watch subdirectories recursively
  - `filter` (RegExp, optional): Only emit events for files matching this pattern
  - `logFile` (string, optional): Path to file where internal logs should be written
  - `usePolling` (boolean, default: `false`, **DEPRECATED**): Use polling instead of native watching

**Example:**
```javascript
import { FileWatcher } from "./filewatcher.js";

// Basic usage
const watcher = new FileWatcher("./data");

// Recursive with filter
const jsWatcher = new FileWatcher("./src", {
  recursive: true,
  filter: /\.js$/  // Only watch .js files
});

// With logging
const loggedWatcher = new FileWatcher("./logs", {
  logFile: "./watcher.log"
});
```

### Methods

#### `start()`

Begin watching for file changes. Starts the file system watcher.

**Example:**
```javascript
const watcher = new FileWatcher("./data");
watcher.start();
console.log("Watcher started");
```

#### `stop()`

Stop all watchers and close the file system handles. Emits a "stopped" event.

**Example:**
```javascript
watcher.stop();
console.log("Watcher stopped");
```

#### `debounceEvents(delayMs)`

Debounce rapid file change events. Prevents multiple "change" events from firing in quick succession.

**Parameters:**
- `delayMs` (number, default: `100`): Debounce delay in milliseconds

**Behavior:** 
- Only the last change event within the debounce window is emitted as "debouncedChange"
- Call this method before `start()` for best results

**Example:**
```javascript
const watcher = new FileWatcher("./uploads");
watcher.debounceEvents(500);  // Wait 500ms for changes to settle

watcher.on("debouncedChange", (event) => {
  console.log("Settled change detected:", event.filename);
});

watcher.start();
```

#### `async waitForFile(filename, timeoutMs)`

Wait for a specific file to appear in the watched directory. Returns a Promise that resolves when the file exists or rejects on timeout.

**Parameters:**
- `filename` (string): Name of the file to wait for
- `timeoutMs` (number, default: `5000`): Timeout in milliseconds

**Returns:** `Promise<boolean>` - Resolves to `true` when file appears, rejects with Error on timeout

**Example:**
```javascript
const watcher = new FileWatcher("./uploads");
watcher.start();

try {
  await watcher.waitForFile("document.pdf", 10000);
  console.log("File appeared!");
} catch (err) {
  console.error("File did not appear within 10 seconds:", err.message);
}
```

#### `watchOnce(filename)`

**DEPRECATED** - Use `waitForFile()` instead.

Waits for a specific file to appear. This method is deprecated and will print a warning.

**Example:**
```javascript
// Don't use this - use waitForFile() instead
watcher.watchOnce("temp.txt");
```

### Events

#### `"change"`

Emitted when a file change is detected.

**Event Data:**
```javascript
{
  eventType: "change" | "rename",  // Type of file system event
  filename: string                  // Name of the changed file
}
```

**Example:**
```javascript
watcher.on("change", (event) => {
  console.log(`${event.eventType}: ${event.filename}`);
});
```

#### `"debouncedChange"`

Emitted after debounce delay when using `debounceEvents()`. Only fires after changes have settled.

**Event Data:**
```javascript
{
  eventType: "change" | "rename",
  filename: string
}
```

**Example:**
```javascript
watcher.debounceEvents(300);

watcher.on("debouncedChange", (event) => {
  console.log("Final change:", event.filename);
});
```

#### `"stopped"`

Emitted when the `stop()` method is called and all watchers are closed.

**Example:**
```javascript
watcher.on("stopped", () => {
  console.log("Watcher has stopped");
});

watcher.stop();
```

### Properties

#### `logs` (Array)

Internal array storing all logged messages. Only populated if `_log()` was called or `logFile` is configured.

**Type:** `string[]`

**Example:**
```javascript
const watcher = new FileWatcher("./data", { logFile: "./watcher.log" });
watcher.start();
// ... later ...
console.log("All logs:", watcher.logs);
```

## Complete Example

```javascript
import { FileWatcher } from "./filewatcher.js";
import fs from "fs";

// Create watcher for source files
const watcher = new FileWatcher("./src", {
  recursive: true,
  filter: /\.(js|ts)$/,  // Only JS and TS files
  logFile: "./debug.log"
});

// Setup debouncing for compilation
watcher.debounceEvents(1000);

// Listen for settled changes
watcher.on("debouncedChange", (event) => {
  console.log(`[${new Date().toISOString()}] Recompiling due to: ${event.filename}`);
});

// Handle explicit stops
watcher.on("stopped", () => {
  console.log("File watcher stopped - logs saved to debug.log");
});

watcher.start();

// Example: Wait for a config file
async function waitForConfig() {
  try {
    await watcher.waitForFile("config.json", 30000);
    console.log("Config file detected!");
  } catch (err) {
    console.error("Config file not found:", err.message);
  }
}

// Stop after 5 minutes
setTimeout(() => {
  watcher.stop();
  console.log("Internal logs:", watcher.logs.slice(0, 5)); // First 5 logs
}, 5 * 60 * 1000);
```

## Migration Guide from v1.0

If you're upgrading from v1.0, note the following:

- **Option name change:** `recursiveMode` → `recursive`
- **New feature:** `debounceEvents()` method for performance
- **New feature:** `waitForFile()` async method
- **New feature:** `filter` option for selective watching
- **New feature:** `logFile` option for audit trails
- **Deprecated:** `usePolling` option (ignored in v1.2)
- **Deprecated:** `watchOnce()` method - use `waitForFile()` instead

## Notes

- Uses Node.js native `fs.watch()` for efficient file monitoring
- Events are immediate unless debounced
- File filter is applied at the watcher level for performance
- Logs are stored in memory and optionally written to disk
- Recursive watching available on all platforms (fs.watch compatibility varies)
