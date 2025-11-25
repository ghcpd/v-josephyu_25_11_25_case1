#!/usr/bin/env bash
# run_tests.sh — runs all example scripts to validate behavior
set -euo pipefail

# Cleanup old logs
rm -f watch.log || true
rm -rf logs || true
mkdir -p logs

echo "Running readme-style example (examples/test_readme_example.js)";
node "$(pwd)/examples/test_readme_example.js"

sleep 1

echo "\nRunning advanced example (examples/test_advanced.js)";
node "$(pwd)/examples/test_advanced.js"

# Show log file
if [ -f watch.log ]; then
  echo "\n=== watch.log contents ==="
  cat watch.log
else
  echo "\nNo watch.log created"
fi

echo "\nAll example scripts executed. Check console output for events and the defects.txt for notes."