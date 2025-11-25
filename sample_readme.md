# FileWatcher Pro v1.2 (Corrected Documentation)

A robust Node.js library for watching files and directories with advanced features like filtering, debouncing, logging, and async file detection.

---

## Installation

```bash
npm install filewatcher-pro
```

---

## Basic Usage

```javascript
import { FileWatcher } from "./filewatcher.js";

const watcher = new FileWatcher("./logs", { recursive: true });

watcher.on("change", (event) => {
  console.log("File changed:", event.filename);
});

watcher.start();
```

---

## Advanced Options

### `filter` (RegExp)
Watch only files matching a given pattern.

```javascript
const watcher = new FileWatcher("./src", { filter: /\.js$/ });
```

### `logFile` (string)
Save all watcher logs to a file.

```javascript
const watcher = new FileWatcher("./data", { logFile: "./watcher.log" });
```

### `recursive` (boolean)
Watch all subdirectories recursively.

---

## Advanced APIs

### `debounceEvents(delayMs = 100)`
Emit debounced file change events to avoid noisy triggers.

```javascript
watcher.debounceEvents(200);
watcher.on("debouncedChange", (e) => console.log("Debounced:", e.filename));
```

### `async waitForFile(filename, timeoutMs = 5000)`
Wait asynchronously until a file exists.

```javascript
await watcher.waitForFile("ready.txt", 10000);
```

---

## Deprecated API

### `watchOnce(filename)`
> ⚠️ Deprecated — use `waitForFile()` instead.

---

## Internal Logging
FileWatcher automatically logs events if `logFile` is specified.

---

## API Summary

| Method | Description |
|--------|--------------|
| `start()` | Begin watching for file changes |
| `stop()` | Stop watching |
| `debounceEvents(delayMs)` | Enable debounced "change" events |
| `waitForFile(filename, timeoutMs)` | Wait for specific file |
| `watchOnce(filename)` | Deprecated |
