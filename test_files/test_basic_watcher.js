// test_files/test_basic_watcher.js
// Test: Basic watch functionality and change event

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const watchDir = "./test_files/watch_dir";
console.log("TEST 1: Basic Watch Functionality");
console.log("==================================");

const watcher = new FileWatcher(watchDir);

let changeDetected = false;

watcher.on("change", (event) => {
  console.log(`✓ Change detected: ${event.eventType} - ${event.filename}`);
  changeDetected = true;
  watcher.stop();
});

watcher.start();
console.log("Watcher started, watching:", watchDir);
console.log("Modifying sample.txt in 500ms...");

// Modify a file to trigger change event
setTimeout(() => {
  const filePath = path.join(watchDir, "sample.txt");
  fs.appendFileSync(filePath, "\ntest data\n");
  console.log("File modified");
}, 500);

// Timeout to ensure test completes
setTimeout(() => {
  if (!changeDetected) {
    console.log("✗ FAILED: No change event detected");
    process.exit(1);
  } else {
    console.log("✓ PASSED: Change event detected successfully");
    process.exit(0);
  }
}, 3000);
