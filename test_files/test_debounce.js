// test_files/test_debounce.js
// Test: debounceEvents() - undocumented feature

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const watchDir = "./test_files/watch_dir";
console.log("TEST 4: Debounce Events (Undocumented Feature)");
console.log("==============================================");

const watcher = new FileWatcher(watchDir);
watcher.debounceEvents(500);

let regularChangeCount = 0;
let debouncedChangeCount = 0;

watcher.on("change", (event) => {
  regularChangeCount++;
  console.log(`Regular change event #${regularChangeCount}: ${event.filename}`);
});

watcher.on("debouncedChange", (event) => {
  debouncedChangeCount++;
  console.log(`✓ Debounced change event #${debouncedChangeCount}: ${event.filename}`);
});

watcher.start();
console.log("Watcher started with debounce: 500ms");
console.log("Making 3 rapid changes to same file...");

let changesMade = 0;

setTimeout(() => {
  fs.appendFileSync(path.join(watchDir, "data.json"), "change 1\n");
  changesMade++;
}, 100);

setTimeout(() => {
  fs.appendFileSync(path.join(watchDir, "data.json"), "change 2\n");
  changesMade++;
}, 200);

setTimeout(() => {
  fs.appendFileSync(path.join(watchDir, "data.json"), "change 3\n");
  changesMade++;
}, 300);

setTimeout(() => {
  watcher.stop();
  
  console.log(`\nResults:`);
  console.log(`Regular change events: ${regularChangeCount}`);
  console.log(`Debounced change events: ${debouncedChangeCount}`);
  
  if (debouncedChangeCount >= 1) {
    console.log("✓ PASSED: Debounce functionality works");
    process.exit(0);
  } else {
    console.log("✗ FAILED: No debounced events received");
    process.exit(1);
  }
}, 2000);
