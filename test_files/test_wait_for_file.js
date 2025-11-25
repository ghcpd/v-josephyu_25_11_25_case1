// test_files/test_wait_for_file.js
// Test: waitForFile() - undocumented async method

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const watchDir = "./test_files/watch_dir";
console.log("TEST 5: Wait For File (Undocumented Async Method)");
console.log("=================================================");

const watcher = new FileWatcher(watchDir);
watcher.start();

const testFile = "future_file.txt";

console.log(`Waiting for file: ${testFile}`);
console.log("File will be created in 800ms...");

// Create file after delay
setTimeout(() => {
  fs.writeFileSync(path.join(watchDir, testFile), "created!\n");
  console.log(`✓ File created: ${testFile}`);
}, 800);

// Wait for the file with 3 second timeout
watcher.waitForFile(testFile, 3000)
  .then(() => {
    console.log("✓ PASSED: File appeared within timeout");
    watcher.stop();
    process.exit(0);
  })
  .catch((err) => {
    console.log("✗ FAILED: Timeout or error:", err.message);
    watcher.stop();
    process.exit(1);
  });
