// test_files/test_option_recursive.js
// Test: Verify that "recursive" option works (not "recursiveMode")

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const watchDir = "./test_files/watch_dir";
console.log("TEST 2: Recursive Option Verification");
console.log("=====================================");

// Test with correct option name: "recursive"
const watcher = new FileWatcher(watchDir, { recursive: true });

let subdirChangeDetected = false;

watcher.on("change", (event) => {
  console.log(`✓ Event: ${event.filename}`);
  if (event.filename.includes("nested")) {
    subdirChangeDetected = true;
    console.log("✓ Change in subdirectory detected");
    watcher.stop();
  }
});

watcher.start();
console.log("Watcher started with recursive: true");
console.log("Modifying nested.log in subdirectory...");

setTimeout(() => {
  const filePath = path.join(watchDir, "subdir", "nested.log");
  fs.appendFileSync(filePath, "nested change\n");
  console.log("File modified");
}, 500);

setTimeout(() => {
  if (!subdirChangeDetected) {
    console.log("✗ FAILED: Recursive watching not working");
    process.exit(1);
  } else {
    console.log("✓ PASSED: Recursive option works correctly");
    process.exit(0);
  }
}, 3000);
