// test_files/test_stopped_event.js
// Test: "stopped" event - undocumented event

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const watchDir = "./test_files/watch_dir";
console.log("TEST 7: Stopped Event (Undocumented Event)");
console.log("==========================================");

const watcher = new FileWatcher(watchDir);

let stoppedEventFired = false;

watcher.on("change", (event) => {
  console.log(`Change: ${event.filename}`);
});

watcher.on("stopped", () => {
  stoppedEventFired = true;
  console.log("✓ 'stopped' event emitted");
});

watcher.start();
console.log("Watcher started");
console.log("Stopping watcher in 1 second...");

setTimeout(() => {
  fs.appendFileSync(path.join(watchDir, "sample.txt"), "change\n");
}, 300);

setTimeout(() => {
  watcher.stop();
  
  setTimeout(() => {
    if (stoppedEventFired) {
      console.log("✓ PASSED: 'stopped' event works correctly");
      process.exit(0);
    } else {
      console.log("✗ FAILED: 'stopped' event was not emitted");
      process.exit(1);
    }
  }, 100);
}, 1500);
