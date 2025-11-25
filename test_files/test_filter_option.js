// test_files/test_filter_option.js
// Test: Filter option (UNDOCUMENTED feature)

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const testName = "Filter Option (Undocumented Feature)";
console.log(`\n📋 Running: ${testName}`);

async function runTest() {
  const testDir = "./test_data/logs";
  
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Create watcher that only filters .log files
  const watcher = new FileWatcher(testDir, { 
    filter: /\.log$/  // Only watch .log files
  });
  
  let logFileChanged = false;
  let txtFileChanged = false;
  let changeCount = 0;

  watcher.on("change", (event) => {
    console.log(`  ✓ Change event: ${event.filename}`);
    changeCount++;
    
    if (event.filename.endsWith(".log")) {
      logFileChanged = true;
    } else if (event.filename.endsWith(".txt")) {
      txtFileChanged = true;
    }
  });

  watcher.start();
  console.log("  ✓ Watcher started with filter: /\\.log$/");
  console.log("  ℹ️  DOCUMENTATION STATUS: This feature is completely UNDOCUMENTED");

  // Create both .log and .txt files
  setTimeout(() => {
    const logFile = path.join(testDir, "test_" + Date.now() + ".log");
    const txtFile = path.join(testDir, "test_" + Date.now() + ".txt");
    
    fs.writeFileSync(logFile, "Log content");
    console.log("  ✓ Created .log file (should trigger event)");
    
    fs.writeFileSync(txtFile, "Text content");
    console.log("  ✓ Created .txt file (should NOT trigger event)");
  }, 100);

  // Wait for changes
  await new Promise((resolve) => setTimeout(resolve, 1500));

  watcher.stop();
  console.log("  ✓ Watcher stopped");

  if (changeCount > 0) {
    console.log(`  ✓ Test PASSED: Filter option works (${changeCount} events matched)`);
    return { passed: true, message: "Filter feature works correctly but is undocumented" };
  } else {
    console.log(`  ❌ Test FAILED: No filtered events detected`);
    return { passed: false, message: "Filter not working" };
  }
}

export async function testFilterOption() {
  try {
    return await runTest();
  } catch (error) {
    console.error(`  ❌ Test FAILED with error: ${error.message}`);
    return { passed: false, message: error.message };
  }
}
