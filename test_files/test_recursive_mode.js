// test_files/test_recursive_mode.js
// Test: Recursive watching (testing corrected parameter name)

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const testName = "Recursive Mode (Parameter Correction)";
console.log(`\n📋 Running: ${testName}`);

async function runTest() {
  const testDir = "./test_data/uploads";
  
  // Ensure test directory exists
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Create a subdirectory
  const subDir = path.join(testDir, "subdir_" + Date.now());
  fs.mkdirSync(subDir, { recursive: true });

  // IMPORTANT: Test uses 'recursive' (CORRECT) not 'recursiveMode' (INCORRECT from README)
  const watcher = new FileWatcher(testDir, { recursive: true });
  let changeDetected = false;

  watcher.on("change", (event) => {
    console.log(`  ✓ Change detected in subdirectory: ${event.filename}`);
    changeDetected = true;
  });

  watcher.start();
  console.log("  ✓ Watcher started with recursive: true");

  // Create a file in subdirectory
  setTimeout(() => {
    const testFile = path.join(subDir, "nested_test_" + Date.now() + ".txt");
    fs.writeFileSync(testFile, "Nested test content");
    console.log(`  ✓ Test file created in subdirectory`);
  }, 100);

  // Wait for change to be detected
  await new Promise((resolve) => setTimeout(resolve, 1500));

  watcher.stop();
  console.log("  ✓ Watcher stopped");

  if (changeDetected) {
    console.log(`  ✓ Test PASSED: Recursive watching works correctly`);
    console.log(`  ℹ️  DOCUMENTATION ERROR FOUND: README uses 'recursiveMode' but implementation expects 'recursive'`);
    return { passed: true, message: "Recursive mode works with correct parameter name 'recursive'" };
  } else {
    console.log(`  ❌ Test FAILED: No change detected in subdirectory`);
    return { passed: false, message: "Recursive mode not working" };
  }
}

export async function testRecursiveMode() {
  try {
    return await runTest();
  } catch (error) {
    console.error(`  ❌ Test FAILED with error: ${error.message}`);
    return { passed: false, message: error.message };
  }
}
