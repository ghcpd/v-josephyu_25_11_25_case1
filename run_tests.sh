#!/usr/bin/env bash
# Run test scripts for FileWatcher Pro
set -e
node ./test_files/test_example.mjs
node ./test_files/test_watchonce.mjs

echo "All tests executed."