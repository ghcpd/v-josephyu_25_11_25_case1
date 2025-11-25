# FileWatcher Pro v1.2

A simple Node.js utility for watching file changes in a directory.

## Installation

```bash
npm install filewatcher-pro
```

## Usage

```javascript
import { FileWatcher } from "./filewatcher.js";

const watcher = new FileWatcher("./logs", { recursive: true });

watcher.on("change", (event) => {
  console.log("File changed:", event.filename);
});

watcher.start();
```

## API Reference

### `new FileWatcher(targetDir, options)`
Create a watcher for the specified directory.

Options:
- `recursive` (boolean): Enable recursive watching.  

Notes:
- The project also exposes additional options such as `filter` (RegExp), `logFile` (string), `usePolling` (deprecated) and APIs like `debounceEvents()`, `waitForFile()` and `watchOnce()` — see `corrected_readme.md` for full details.

### `start()`
Begin watching for file changes.

### `stop()`
Stop all watchers.

---

### Notes
More advanced APIs will be added in the future.
