#!/usr/bin/env bash
# Setup script for local testing of FileWatcher Pro examples
# Creates package.json with ESM support and ensures logs directory exists

set -euo pipefail

# Create package.json with type=module so `import` in .js files works in node
if [ ! -f package.json ]; then
  cat > package.json <<'JSON'
{
  "name": "filewatcher-pro-local",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "test:examples": "bash run_tests.sh"
  }
}
JSON
  echo "Created package.json with type=module"
else
  echo "package.json exists, skipping creation"
fi

# Ensure logs dir
if [ ! -d logs ]; then
  mkdir -p logs
  echo "Created logs/"
fi

# Ensure examples present
if [ ! -d examples ]; then
  mkdir -p examples
fi

echo "Setup complete. To run examples: bash run_tests.sh"