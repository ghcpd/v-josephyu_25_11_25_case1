# FileWatcher Pro v1.2 - Complete API Documentation

A powerful Node.js utility for watching file changes in a directory with advanced filtering, logging, and event-driven capabilities.

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
  console.log("Event type:", event.eventType);
});

watcher.start();
```

## API Reference

### Constructor: `new FileWatcher(targetDir, options)`

Creates a new file watcher instance for the specified directory.

**Parameters:**
- `targetDir` (string): Path to the directory to watch
- `options` (object, optional): Configuration object with the following properties:
  - `recursive` (boolean, default: `false`): Enable recursive watching of subdirectories
  - `filter` (RegExp, optional): Regular expression to filter which files trigger events
  - `logFile` (string, optional): Path to a log file where all events will be appended with timestamps
  - ~~`usePolling`~~ (deprecated): This option is accepted but has no effect in v1.2

**Example:**
```javascript
// Basic watcher
const watcher = new FileWatcher("./uploads");

// Recursive watching with filtering
const watcher2 = new FileWatcher("./logs", { 
  recursive: true,
  filter: /\.json$/,  // Only watch .json files
  logFile: "./watch.log"
});
```

---

### `start()`

Begins watching for file changes in the target directory.

**Returns:** void

**Emits:**
- `"change"` event when a file change is detected

**Example:**
```javascript
const watcher = new FileWatcher("./files");
watcher.start();
```

---

### `stop()`

Stops all active file watchers and closes file descriptors.

**Returns:** void

**Emits:**
- `"stopped"` event when all watchers have been stopped

**Example:**
```javascript
watcher.stop();
```

---

### `debounceEvents(delayMs)`

Enables debouncing of file change events to prevent rapid successive triggers.
Useful for scenarios where multiple events fire in quick succession for a single user action.

**Parameters:**
- `delayMs` (number, default: `100`): Delay in milliseconds before emitting the debounced event

**Returns:** void

**Emits:**
- `"debouncedChange"` event containing the last file change event after the specified delay

**Example:**
```javascript
const watcher = new FileWatcher("./uploads", { recursive: true });

// Only emit event after 500ms of no changes
watcher.debounceEvents(500);

watcher.on("debouncedChange", (event) => {
  console.log("File change (debounced):", event.filename);
});

watcher.start();
```

**Use Case:** Processing multiple file updates as a single batch operation

---

### `async waitForFile(filename, timeoutMs)`

Asynchronously waits for a specific file to appear in the watched directory.

**Parameters:**
- `filename` (string): Name of the file to wait for
- `timeoutMs` (number, default: `5000`): Maximum time to wait in milliseconds

**Returns:** Promise<boolean> - Resolves to `true` if file appears within timeout

**Throws:** Error if timeout is exceeded before file appears

**Example:**
```javascript
const watcher = new FileWatcher("./imports");
watcher.start();

try {
  // Wait up to 10 seconds for the file to appear
  await watcher.waitForFile("data.csv", 10000);
  console.log("File arrived!");
} catch (error) {
  console.error("File did not arrive in time:", error.message);
}
```

**Use Case:** Coordinating async operations based on file availability

---

### `watchOnce(filename)` ⚠️ DEPRECATED

**Deprecated in v1.2.** Use `waitForFile()` instead.

Logs a deprecation warning and delegates to `waitForFile()` with default 5-second timeout.

**Parameters:**
- `filename` (string): Name of the file to watch for

**Returns:** Promise (same as `waitForFile()`)

**Example:**
```javascript
// ❌ Don't use this
await watcher.watchOnce("myfile.txt");

// ✅ Use this instead
await watcher.waitForFile("myfile.txt");
```

---

## Events

### `"change"` Event

Emitted when a file change is detected.

**Event Data:**
```javascript
{
  eventType: string,  // "rename" or "change"
  filename: string    // Name of the file that changed
}
```

**Example:**
```javascript
watcher.on("change", (event) => {
  console.log(`File ${event.filename} was ${event.eventType}d`);
});
```

---

### `"debouncedChange"` Event

Emitted after debounceEvents() is enabled and the debounce delay expires.
Contains the last change event during the debounce window.

**Event Data:** Same as `"change"` event

**Example:**
```javascript
watcher.debounceEvents(300);

watcher.on("debouncedChange", (event) => {
  console.log("Batched change event:", event.filename);
});
```

---

### `"stopped"` Event

Emitted when the watcher is stopped via `stop()`.

**Event Data:** None

**Example:**
```javascript
watcher.on("stopped", () => {
  console.log("Watcher has stopped");
});
```

---

## Complete Examples

### Example 1: Basic File Monitoring
```javascript
import { FileWatcher } from "./filewatcher.js";

const watcher = new FileWatcher("./uploads", { recursive: true });

watcher.on("change", (event) => {
  console.log(`[${new Date().toISOString()}] ${event.filename} - ${event.eventType}`);
});

watcher.start();
console.log("Watching for changes...");
```

### Example 2: Selective Monitoring with Filter
```javascript
import { FileWatcher } from "./filewatcher.js";

// Only watch .log files
const watcher = new FileWatcher("./logs", { 
  recursive: true,
  filter: /\.log$/
});

watcher.on("change", (event) => {
  console.log("Log file updated:", event.filename);
});

watcher.start();
```

### Example 3: Logging Events to File
```javascript
import { FileWatcher } from "./filewatcher.js";

const watcher = new FileWatcher("./data", {
  recursive: true,
  logFile: "./watcher.log"
});

watcher.on("change", (event) => {
  console.log("Change detected:", event.filename);
});

watcher.start();
// All events are automatically logged to ./watcher.log with timestamps
```

### Example 4: Debounced Event Processing
```javascript
import { FileWatcher } from "./filewatcher.js";

const watcher = new FileWatcher("./config", { recursive: true });

// Debounce rapid changes (e.g., during bulk file operations)
watcher.debounceEvents(500);

watcher.on("debouncedChange", async (event) => {
  console.log("Processing batch of changes...");
  // Perform expensive operation only once per debounce cycle
  await processConfigUpdate();
});

watcher.start();
```

### Example 5: Waiting for Specific File
```javascript
import { FileWatcher } from "./filewatcher.js";

const watcher = new FileWatcher("./imports");
watcher.start();

async function waitForImport() {
  try {
    await watcher.waitForFile("import.csv", 30000);
    console.log("Import file received!");
  } catch (error) {
    console.error("Import timeout:", error.message);
  }
}

waitForImport();
```

### Example 6: Complete Production Example
```javascript
import { FileWatcher } from "./filewatcher.js";
import fs from "fs";

const watcher = new FileWatcher("./incoming", {
  recursive: true,
  filter: /\.(json|csv|xlsx)$/,
  logFile: "./audit.log"
});

watcher.debounceEvents(1000);

watcher.on("debouncedChange", async (event) => {
  console.log(`Processing: ${event.filename}`);
  // Process file
  const filePath = `./incoming/${event.filename}`;
  if (fs.existsSync(filePath)) {
    // Your processing logic here
    console.log(`Successfully processed ${event.filename}`);
  }
});

watcher.on("stopped", () => {
  console.log("Watcher stopped. Check audit.log for history.");
});

watcher.start();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down...");
  watcher.stop();
  process.exit(0);
});
```

---

## Configuration Guide

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `recursive` | boolean | `false` | Watch all subdirectories |
| `filter` | RegExp | null | Only trigger on matching filenames |
| `logFile` | string | null | Append all events to this file |

## Best Practices

1. **Use `filter`** when you only care about specific file types
2. **Enable `recursive`** only when needed to improve performance
3. **Use `debounceEvents()`** when file operations generate rapid changes
4. **Use `waitForFile()`** for coordination between asynchronous operations
5. **Always handle promise rejections** with `waitForFile()` for timeout scenarios

## Migration Guide (v1.1 → v1.2)

- **No breaking changes** if you're using basic API
- **Parameter renamed:** Use `recursive` instead of `recursiveMode`
- **Deprecated:** `watchOnce()` - use `waitForFile()` instead
- **New features:** `debounceEvents()`, advanced filtering with `filter` option

## Troubleshooting

### Changes not detected
- Ensure `recursive: true` if watching subdirectories
- Check that the filter regex doesn't exclude your files
- Verify the watch target directory exists

### Missing events from `waitForFile()`
- Default timeout is 5000ms; increase if needed
- Ensure watcher is started before waiting

### Performance issues
- Disable `recursive` if not needed
- Use `filter` to reduce processed events
- Enable `debounceEvents()` for rapid file operations
