#!/usr/bin/env bash
# run_tests.sh runs the packaged tests for FileWatcher Pro v1.2

set -e

ROOT_DIR="$(pwd)"

echo "Running README example test"
npm run test:readme

echo "Running all feature tests"
npm run test:all

echo "All tests finished."
