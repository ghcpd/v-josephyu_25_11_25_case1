#!/bin/bash

# run_tests.sh - Run all FileWatcher Pro v1.2 test cases

echo ""
echo "=========================================="
echo "FileWatcher Pro v1.2 - Test Suite"
echo "=========================================="
echo ""

# Check if setup has been run
if [ ! -d "test_files/watch_dir" ]; then
    echo "ERROR: Test directory not found. Please run setup.sh first:"
    echo "  bash setup.sh"
    exit 1
fi

# Ensure output directory exists
mkdir -p test_files/output

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_file=$1
    local test_name=$2
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo ""
    echo "────────────────────────────────────────"
    echo "Running: $test_name"
    echo "File: $test_file"
    echo "────────────────────────────────────────"
    
    # Run the test with timeout
    if timeout 10s node "$test_file" 2>&1; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo ""
        echo "✓ PASSED: $test_name"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo ""
        echo "✗ FAILED: $test_name"
    fi
}

# Run all tests
echo "Initializing test environment..."
echo ""

# Reset test files
echo "" > test_files/watch_dir/sample.txt
echo "" > test_files/watch_dir/data.json
echo "// test" > test_files/watch_dir/document.js
echo "" > test_files/watch_dir/subdir/nested.log

# Run each test
run_test "test_files/test_basic_watcher.js" "Basic Watch Functionality"
run_test "test_files/test_option_recursive.js" "Recursive Option (recursive vs recursiveMode)"
run_test "test_files/test_filter_option.js" "Filter Option - Undocumented Feature"
run_test "test_files/test_debounce.js" "Debounce Events - Undocumented Feature"
run_test "test_files/test_wait_for_file.js" "Wait For File - Undocumented Async Method"
run_test "test_files/test_log_file.js" "Log File Option - Undocumented Feature"
run_test "test_files/test_stopped_event.js" "Stopped Event - Undocumented Event"
run_test "test_files/test_logs_property.js" "Internal Logs Property - Undocumented"

# Summary
echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo "Total Tests: $TOTAL_TESTS"
echo "Passed:      $PASSED_TESTS"
echo "Failed:      $FAILED_TESTS"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo "✓ All tests passed!"
    echo ""
    exit 0
else
    echo "✗ Some tests failed"
    echo ""
    exit 1
fi
