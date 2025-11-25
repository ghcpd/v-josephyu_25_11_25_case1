#!/usr/bin/env bash
# Setup script for FileWatcher Pro test environment
set -e
# Create tmp folders used by tests
mkdir -p tmp_watch tmp_watch2
# Remove old logs
rm -f tmp_watch/log.txt tmp_watch2/log.txt

echo "Setup complete. Run './run_tests.sh' to execute tests."