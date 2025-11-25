// test_files/test_wait_for_file.js
// Test: waitForFile() async method (UNDOCUMENTED)

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const testName = "waitForFile() Async Method (Undocumented)";
console.log(`\n📋 Running: ${testName}`);

async function runTest() {
  const testDir = "./test_data/imports";
  
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  console.log("  ℹ️  DOCUMENTATION STATUS: waitForFile() is completely UNDOCUMENTED");

  const watcher = new FileWatcher(testDir);
  watcher.start();
  console.log("  ✓ Watcher started");

  const targetFile = `expected_file_${Date.now()}.txt`;
  let fileWasCreated = false;

  // Start waiting for file (non-blocking with setTimeout)
  const waitPromise = watcher.waitForFile(targetFile, 5000);
  console.log(`  ✓ Started waiting for: ${targetFile}`);

  // Create the file after a delay
  setTimeout(() => {
    const filePath = path.join(testDir, targetFile);
    fs.writeFileSync(filePath, "Expected content");
    console.log("  ✓ File created");
    fileWasCreated = true;
  }, 500);

  try {
    const result = await waitPromise;
    watcher.stop();
    
    if (result === true && fileWasCreated) {
      console.log("  ✓ Test PASSED: waitForFile() correctly detected file");
      return { passed: true, message: "waitForFile() works correctly but is undocumented" };
    }
  } catch (error) {
    console.log(`  ❌ Test FAILED: ${error.message}`);
    watcher.stop();
    return { passed: false, message: error.message };
  }

  return { passed: false, message: "Unknown error" };
}

export async function testWaitForFile() {
  try {
    return await runTest();
  } catch (error) {
    console.error(`  ❌ Test FAILED with error: ${error.message}`);
    return { passed: false, message: error.message };
  }
}
