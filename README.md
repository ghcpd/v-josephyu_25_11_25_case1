# FileWatcher Pro v1.2

A simple Node.js utility for watching file changes in a directory.

## Installation

```bash
npm install filewatcher-pro
```

## Usage

```javascript
import { FileWatcher } from "./filewatcher.js";

const watcher = new FileWatcher("./logs", { recursiveMode: true });

watcher.on("change", (event) => {
  console.log("File changed:", event.filename);
});

watcher.start();
```

## API Reference

### `new FileWatcher(targetDir, options)`
Create a watcher for the specified directory.

Options:
- `recursiveMode` (boolean): Enable recursive watching.  

### `start()`
Begin watching for file changes.

### `stop()`
Stop all watchers.

---

### Notes
More advanced APIs will be added in the future.
