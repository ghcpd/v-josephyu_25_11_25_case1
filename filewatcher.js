// filewatcher.js
import fs from "fs";
import path from "path";
import EventEmitter from "events";

export class FileWatcher extends EventEmitter {
  constructor(targetDir, options = {}) {
    super();
    this.targetDir = targetDir;
    this.recursive = options.recursive || false;
    this.filter = options.filter || null; // undocumented feature
    this.logFile = options.logFile || null; // undocumented feature
    this.usePolling = options.usePolling || false; // optional polling fallback for environments where fs.watch is unreliable
    this.pollInterval = options.pollInterval || 200; // ms
    this.watchers = [];
    this.logs = [];
    this._fileStats = new Map();
    this._poller = null;
  }

  start() {
    if (this.usePolling) {
      this._startPollingWatcher();
      return;
    }

    const watcher = fs.watch(
      this.targetDir,
      { recursive: this.recursive },
      (eventType, filename) => {
        if (!filename) return; // in some cases filename is null
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
    if (this._poller) {
      clearInterval(this._poller);
      this._poller = null;
    }
  }

  _scanFiles(dir = this.targetDir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (this.recursive) {
          results.push(...this._scanFiles(fullPath));
        }
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
    return results;
  }

  _startPollingWatcher() {
    // initial population
    const files = this._scanFiles();
    this._fileStats.clear();
    for (const f of files) {
      try {
        const st = fs.statSync(f);
        this._fileStats.set(path.relative(this.targetDir, f), st.mtimeMs);
      } catch (e) {
        // ignore
      }
    }

    this._poller = setInterval(() => {
      try {
        const currentFiles = this._scanFiles();
        const currentStats = new Map();
        for (const f of currentFiles) {
          try {
            const st = fs.statSync(f);
            const rel = path.relative(this.targetDir, f);
            currentStats.set(rel, st.mtimeMs);
            if (!this._fileStats.has(rel)) {
              // new file
              if (this.filter && !rel.match(this.filter)) continue;
              this._log(`Event: rename -> ${rel}`);
              this.emit('change', { eventType: 'rename', filename: rel });
            } else if (this._fileStats.get(rel) !== st.mtimeMs) {
              // modified
              if (this.filter && !rel.match(this.filter)) continue;
              this._log(`Event: change -> ${rel}`);
              this.emit('change', { eventType: 'change', filename: rel });
            }
          } catch (e) {
            // ignore per-file stat failures
          }
        }

        // detect removed files
        for (const rel of Array.from(this._fileStats.keys())) {
          if (!currentStats.has(rel)) {
            if (this.filter && !rel.match(this.filter)) continue;
            this._log(`Event: rename -> ${rel}`);
            this.emit('change', { eventType: 'rename', filename: rel });
          }
        }

        // swap
        this._fileStats = currentStats;
      } catch (e) {
        // ignore scanning errors
      }
    }, this.pollInterval);
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
