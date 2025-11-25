// filewatcher.js
import fs from "fs";
import EventEmitter from "events";

export class FileWatcher extends EventEmitter {
  constructor(targetDir, options = {}) {
    super();
    this.targetDir = targetDir;
    this.recursive = options.recursive || false;
    this.filter = options.filter || null; // undocumented feature
    this.logFile = options.logFile || null; // undocumented feature
    this.deprecatedOption = options.usePolling || false; // should be marked deprecated
    this.watchers = [];
    this.logs = [];
  }

  start() {
    const watcher = fs.watch(
      this.targetDir,
      { recursive: this.recursive },
      (eventType, filename) => {
        if (this.filter && !filename.match(this.filter)) return;
        this._log(`Event: ${eventType} -> ${filename}`);
        this.emit("change", { eventType, filename });
      }
    );
    this.watchers.push(watcher);
  }

  stop() {
    this.watchers.forEach((w) => w.close());
    this.watchers = [];
    this._log("All watchers stopped");
    this.emit("stopped");
  }

  debounceEvents(delayMs = 100) {
    let timer = null;
    let lastEvent = null;
    const handler = (event) => {
      lastEvent = event;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        this.emit("debouncedChange", lastEvent);
      }, delayMs);
    };
    this.on("change", handler);
  }

  async waitForFile(filename, timeoutMs = 5000) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const check = () => {
        if (fs.existsSync(`${this.targetDir}/${filename}`)) {
          resolve(true);
        } else if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timeout waiting for ${filename}`));
        } else {
          setTimeout(check, 200);
        }
      };
      check();
    });
  }

  _log(message) {
    const entry = `[${new Date().toISOString()}] ${message}`;
    this.logs.push(entry);
    if (this.logFile) fs.appendFileSync(this.logFile, entry + "\n");
  }

  watchOnce(filename) {
    console.warn("watchOnce() is deprecated. Use waitForFile() instead.");
    return this.waitForFile(filename);
  }
}
