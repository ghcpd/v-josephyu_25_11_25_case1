#!/usr/bin/env bash
set -euo pipefail

# Run Node.js test suite
node --test test_files/*.test.js
