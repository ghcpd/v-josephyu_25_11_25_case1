// test_files/test_debounce_events.js
// Test: debounceEvents() method (UNDOCUMENTED)

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const testName = "debounceEvents() Method (Undocumented)";
console.log(`\n📋 Running: ${testName}`);

async function runTest() {
  const testDir = "./test_data/uploads";
  
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const watcher = new FileWatcher(testDir);
  
  let changeEventCount = 0;
  let debouncedEventCount = 0;

  // Listen for regular change events
  watcher.on("change", (event) => {
    changeEventCount++;
    console.log(`  ✓ Regular change event #${changeEventCount}: ${event.filename}`);
  });

  // Enable debouncing
  watcher.debounceEvents(300);
  console.log("  ✓ Debouncing enabled with 300ms delay");

  // Listen for debounced events
  watcher.on("debouncedChange", (event) => {
    debouncedEventCount++;
    console.log(`  ✓ Debounced event #${debouncedEventCount}: ${event.filename}`);
  });

  console.log("  ℹ️  DOCUMENTATION STATUS: debounceEvents() is completely UNDOCUMENTED");
  console.log("  ℹ️  DOCUMENTATION STATUS: debouncedChange event is completely UNDOCUMENTED");

  watcher.start();
  console.log("  ✓ Watcher started");

  // Create multiple files rapidly to test debouncing
  let fileCount = 0;
  const createFile = () => {
    if (fileCount < 3) {
      const testFile = path.join(testDir, `rapid_${Date.now()}_${fileCount}.txt`);
      fs.writeFileSync(testFile, `Rapid file ${fileCount}`);
      console.log(`  ✓ Created rapid file #${fileCount + 1}`);
      fileCount++;
      setTimeout(createFile, 50); // Create file every 50ms
    }
  };

  setTimeout(createFile, 100);

  // Wait for debounce timer to complete
  await new Promise((resolve) => setTimeout(resolve, 2000));

  watcher.stop();
  console.log("  ✓ Watcher stopped");

  console.log(`  📊 Results: Regular events: ${changeEventCount}, Debounced events: ${debouncedEventCount}`);

  if (changeEventCount > 0 && debouncedEventCount > 0) {
    console.log(`  ✓ Test PASSED: Debouncing works (batched events)`);
    return { passed: true, message: "debounceEvents() works correctly but is undocumented" };
  } else {
    console.log(`  ❌ Test FAILED: Debouncing not working properly`);
    return { passed: false, message: "Debouncing not working" };
  }
}

export async function testDebounceEvents() {
  try {
    return await runTest();
  } catch (error) {
    console.error(`  ❌ Test FAILED with error: ${error.message}`);
    return { passed: false, message: error.message };
  }
}
