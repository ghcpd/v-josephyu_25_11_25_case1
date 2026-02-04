// test_files/test_filter_option.js
// Test: Filter option - undocumented feature

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const watchDir = "./test_files/watch_dir";
console.log("TEST 3: Filter Option (Undocumented Feature)");
console.log("============================================");

// Create test files
fs.writeFileSync(path.join(watchDir, "test.js"), "");
fs.writeFileSync(path.join(watchDir, "test.txt"), "");

// Watch only .js files
const watcher = new FileWatcher(watchDir, {
  filter: /\.js$/
});

let jsChangeDetected = false;
let txtChangeDetected = false;
let eventCount = 0;

watcher.on("change", (event) => {
  eventCount++;
  console.log(`Event #${eventCount}: ${event.filename}`);
  
  if (event.filename.includes(".js")) {
    jsChangeDetected = true;
    console.log("✓ JS file change detected (expected)");
  }
  if (event.filename.includes(".txt")) {
    txtChangeDetected = true;
    console.log("✗ TXT file change detected (should be filtered)");
    watcher.stop();
  }
});

watcher.start();
console.log("Watcher started with filter: /\\.js$/");
console.log("Modifying both .js and .txt files...");

setTimeout(() => {
  fs.appendFileSync(path.join(watchDir, "test.js"), "// js code\n");
  console.log("test.js modified");
}, 300);

setTimeout(() => {
  fs.appendFileSync(path.join(watchDir, "test.txt"), "text\n");
  console.log("test.txt modified");
}, 600);

setTimeout(() => {
  watcher.stop();
  
  if (jsChangeDetected && !txtChangeDetected) {
    console.log("✓ PASSED: Filter option works correctly");
    process.exit(0);
  } else {
    console.log("✗ FAILED: Filter option not working properly");
    console.log("  JS detected:", jsChangeDetected);
    console.log("  TXT detected:", txtChangeDetected);
    process.exit(1);
  }
}, 2000);
