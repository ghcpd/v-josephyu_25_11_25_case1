// test_files/test_logs_property.js
// Test: logs property - undocumented internal logs

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const watchDir = "./test_files/watch_dir";
console.log("TEST 8: Internal Logs Property (Undocumented)");
console.log("=============================================");

const watcher = new FileWatcher(watchDir, {
  logFile: "./test_files/output/logs_test.log"
});

watcher.on("change", (event) => {
  console.log(`Change: ${event.filename}`);
});

watcher.start();
console.log("Watcher started with logging enabled");
console.log("Initial logs count:", watcher.logs.length);

setTimeout(() => {
  fs.appendFileSync(path.join(watchDir, "sample.txt"), "test\n");
}, 300);

setTimeout(() => {
  watcher.stop();
  
  console.log("Final logs count:", watcher.logs.length);
  console.log("First log entry:", watcher.logs[0] || "no logs");
  
  if (watcher.logs.length > 0) {
    console.log("✓ PASSED: logs property contains entries");
    console.log("\nAll log entries:");
    watcher.logs.forEach((log, idx) => {
      console.log(`  [${idx}] ${log}`);
    });
    process.exit(0);
  } else {
    console.log("✗ FAILED: logs property is empty");
    process.exit(1);
  }
}, 2000);
