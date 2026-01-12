// test_files/test_log_file_option.js
// Test: LogFile option (UNDOCUMENTED feature)

import { FileWatcher } from "../filewatcher.js";
import fs from "fs";
import path from "path";

const testName = "LogFile Option (Undocumented Feature)";
console.log(`\n📋 Running: ${testName}`);

async function runTest() {
  const testDir = "./test_data/config";
  const logFilePath = "./test_output/filewatcher_test.log";
  
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Clear any existing log file
  if (fs.existsSync(logFilePath)) {
    fs.unlinkSync(logFilePath);
  }

  const watcher = new FileWatcher(testDir, { 
    logFile: logFilePath  // Enable logging to file
  });

  watcher.on("change", (event) => {
    console.log(`  ✓ Change detected: ${event.filename}`);
  });

  watcher.start();
  console.log("  ✓ Watcher started with logFile option");
  console.log("  ℹ️  DOCUMENTATION STATUS: LogFile feature is completely UNDOCUMENTED");

  // Create a test file
  setTimeout(() => {
    const testFile = path.join(testDir, "config_" + Date.now() + ".txt");
    fs.writeFileSync(testFile, "Config content");
    console.log("  ✓ Test file created");
  }, 100);

  // Wait for file to be logged
  await new Promise((resolve) => setTimeout(resolve, 1500));

  watcher.stop();
  console.log("  ✓ Watcher stopped");

  // Check if log file was created and has content
  if (fs.existsSync(logFilePath)) {
    const logContent = fs.readFileSync(logFilePath, "utf-8");
    const hasTimestamp = logContent.includes("Event:");
    
    if (hasTimestamp && logContent.length > 0) {
      console.log("  ✓ Log file created with events");
      console.log(`  ℹ️  Sample log entry: ${logContent.split('\n')[0]}`);
      return { passed: true, message: "LogFile feature works correctly but is undocumented" };
    }
  }
  
  console.log(`  ❌ Test FAILED: Log file not created or empty`);
  return { passed: false, message: "LogFile not working" };
}

export async function testLogFileOption() {
  try {
    return await runTest();
  } catch (error) {
    console.error(`  ❌ Test FAILED with error: ${error.message}`);
    return { passed: false, message: error.message };
  }
}
