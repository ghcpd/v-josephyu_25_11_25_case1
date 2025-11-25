// test_files/test_log_file.js
// Test: logFile option - undocumented feature

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const watchDir = "./test_files/watch_dir";
const logFile = "./test_files/output/watcher.log";

console.log("TEST 6: Log File Option (Undocumented Feature)");
console.log("==============================================");

// Clean up log file if it exists
if (fs.existsSync(logFile)) {
  fs.unlinkSync(logFile);
}

const watcher = new FileWatcher(watchDir, {
  logFile: logFile
});

watcher.on("change", (event) => {
  console.log(`Change: ${event.filename}`);
});

watcher.start();
console.log("Watcher started with logFile:", logFile);
console.log("Modifying file...");

setTimeout(() => {
  fs.appendFileSync(path.join(watchDir, "sample.txt"), "logged change\n");
}, 300);

setTimeout(() => {
  watcher.stop();
  
  // Check if log file was created and contains data
  if (fs.existsSync(logFile)) {
    const content = fs.readFileSync(logFile, "utf-8");
    console.log("\nLog file content:");
    console.log(content);
    
    if (content.length > 0) {
      console.log("✓ PASSED: Log file created and populated");
      process.exit(0);
    } else {
      console.log("✗ FAILED: Log file is empty");
      process.exit(1);
    }
  } else {
    console.log("✗ FAILED: Log file was not created");
    process.exit(1);
  }
}, 2000);
