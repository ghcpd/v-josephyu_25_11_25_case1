import { testBasicWatch } from "../test_files/test_basic_watch.js";
import { testRecursiveMode } from "../test_files/test_recursive_mode.js";
import { testFilterOption } from "../test_files/test_filter_option.js";
import { testLogFileOption } from "../test_files/test_log_file_option.js";
import { testDebounceEvents } from "../test_files/test_debounce_events.js";
import { testWaitForFile } from "../test_files/test_wait_for_file.js";
import { testStoppedEvent } from "../test_files/test_stopped_event.js";

const tests = [
  { name: "Basic File Watching", fn: testBasicWatch },
  { name: "Recursive Mode (Parameter Correction)", fn: testRecursiveMode },
  { name: "Filter Option (Undocumented)", fn: testFilterOption },
  { name: "LogFile Option (Undocumented)", fn: testLogFileOption },
  { name: "debounceEvents() Method (Undocumented)", fn: testDebounceEvents },
  { name: "waitForFile() Async Method (Undocumented)", fn: testWaitForFile },
  { name: "Stopped Event (Undocumented)", fn: testStoppedEvent }
];

let passedTests = 0;
let failedTests = 0;
const results = [];

console.log("\n🧪 Running Test Suite...\n");

for (const test of tests) {
  try {
    const result = await test.fn();
    const status = result.passed ? "✅ PASSED" : "❌ FAILED";
    console.log(`${status} - ${test.name}`);
    console.log(`   Message: ${result.message}\n`);
    
    if (result.passed) {
      passedTests++;
    } else {
      failedTests++;
    }
    
    results.push({
      name: test.name,
      passed: result.passed,
      message: result.message
    });
  } catch (error) {
    console.log(`❌ FAILED - ${test.name}`);
    console.log(`   Error: ${error.message}\n`);
    failedTests++;
    
    results.push({
      name: test.name,
      passed: false,
      message: error.message
    });
  }
}

console.log("========================================");
console.log("📊 Test Summary");
console.log("========================================");
console.log(`✅ Passed: ${passedTests}/${tests.length}`);
console.log(`❌ Failed: ${failedTests}/${tests.length}`);
console.log(`📈 Success Rate: ${((passedTests / tests.length) * 100).toFixed(1)}%`);
console.log("========================================\n");

// Generate detailed report
const reportContent = `# FileWatcher Pro v1.2 - Test Report

Generated: ${new Date().toISOString()}

## Summary
- Total Tests: ${tests.length}
- Passed: ${passedTests}
- Failed: ${failedTests}
- Success Rate: ${((passedTests / tests.length) * 100).toFixed(1)}%

## Detailed Results

${results.map((r, i) => `### Test ${i + 1}: ${r.name}
**Status:** ${r.passed ? "✅ PASSED" : "❌ FAILED"}
**Message:** ${r.message}
`).join('\n')}

## Documentation Issues Identified

1. **CRITICAL** - Parameter Name Mismatch: README documents \`recursiveMode\` but implementation expects \`recursive\`
2. **CRITICAL** - Multiple undocumented APIs:
   - \`filter\` option
   - \`logFile\` option
   - \`debounceEvents()\` method
   - \`waitForFile()\` async method
   - \`stopped\` event
   - \`debouncedChange\` event

3. **HIGH** - \`usePolling\` option is accepted but not implemented

## Recommendations

1. Update README.md with all documented parameters and methods (see corrected_readme.md)
2. Add deprecation warning for \`watchOnce()\` method
3. Document all undocumented features and events
4. Fix recursive mode parameter name in documentation
5. Clarify which options have no effect in current implementation

## Notes
- See defects.txt for detailed evidence of documentation gaps
- See corrected_readme.md for complete and accurate documentation
`;

import fs from "fs";
fs.writeFileSync("./test_output/TEST_REPORT.md", reportContent);

console.log("✅ Test report generated: test_output/TEST_REPORT.md");

process.exit(failedTests > 0 ? 1 : 0);
