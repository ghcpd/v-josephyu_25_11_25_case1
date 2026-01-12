// test_files/test_basic_watch.js
// Test: Basic file watching functionality

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const testName = "Basic File Watching";
console.log(`\n📋 Running: ${testName}`);

async function runTest() {
  const testDir = "./test_data/logs";
  const logFile = "./test_output/test_basic_watch.log";
  
  // Ensure test directory exists
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const watcher = new FileWatcher(testDir);
  let changeDetected = false;
  let eventData = null;

  watcher.on("change", (event) => {
    console.log(`  ✓ Change detected: ${event.filename} (${event.eventType})`);
    changeDetected = true;
    eventData = event;
  });

  watcher.start();
  console.log("  ✓ Watcher started");

  // Create a test file
  setTimeout(() => {
    const testFile = path.join(testDir, "test_file_" + Date.now() + ".txt");
    fs.writeFileSync(testFile, "Test content");
    console.log(`  ✓ Test file created: ${path.basename(testFile)}`);
  }, 100);

  // Wait for change to be detected
  await new Promise((resolve) => setTimeout(resolve, 1500));

  watcher.stop();
  console.log("  ✓ Watcher stopped");

  // Verify results
  if (changeDetected && eventData) {
    console.log(`  ✓ Test PASSED: Event detected with filename: ${eventData.filename}`);
    return { passed: true, message: "Basic watching works correctly" };
  } else {
    console.log(`  ❌ Test FAILED: No change event detected`);
    return { passed: false, message: "Change event not detected" };
  }
}

export async function testBasicWatch() {
  try {
    return await runTest();
  } catch (error) {
    console.error(`  ❌ Test FAILED with error: ${error.message}`);
    return { passed: false, message: error.message };
  }
}
