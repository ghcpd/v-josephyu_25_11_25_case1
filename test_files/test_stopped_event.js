// test_files/test_stopped_event.js
// Test: "stopped" event (UNDOCUMENTED)

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const testName = "Stopped Event (Undocumented)";
console.log(`\n📋 Running: ${testName}`);

async function runTest() {
  const testDir = "./test_data/logs";
  
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  console.log("  ℹ️  DOCUMENTATION STATUS: 'stopped' event is completely UNDOCUMENTED");

  const watcher = new FileWatcher(testDir);
  
  let changeDetected = false;
  let stoppedEventEmitted = false;

  watcher.on("change", (event) => {
    changeDetected = true;
    console.log(`  ✓ Change detected: ${event.filename}`);
  });

  watcher.on("stopped", () => {
    stoppedEventEmitted = true;
    console.log("  ✓ Stopped event emitted");
  });

  watcher.start();
  console.log("  ✓ Watcher started");

  // Create a test file
  setTimeout(() => {
    const testFile = path.join(testDir, "stopped_test_" + Date.now() + ".txt");
    fs.writeFileSync(testFile, "Test content");
    console.log("  ✓ Test file created");
  }, 100);

  // Wait a bit then stop
  await new Promise((resolve) => setTimeout(resolve, 500));

  watcher.stop();
  console.log("  ✓ Called stop()");

  // Wait for stopped event
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (stoppedEventEmitted && changeDetected) {
    console.log("  ✓ Test PASSED: Stopped event works correctly");
    return { passed: true, message: "Stopped event works but is undocumented" };
  } else {
    console.log(`  ❌ Test FAILED: Change detected: ${changeDetected}, Stopped event: ${stoppedEventEmitted}`);
    return { passed: false, message: "Stopped event not working" };
  }
}

export async function testStoppedEvent() {
  try {
    return await runTest();
  } catch (error) {
    console.error(`  ❌ Test FAILED with error: ${error.message}`);
    return { passed: false, message: error.message };
  }
}
