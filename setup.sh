#!/usr/bin/env bash
# setup.sh for FileWatcher Pro v1.2 test environment
# Creates required test directories, ensures package.json is set for ESM mode.

set -e

ROOT_DIR="$(pwd)"

# Ensure node_modules are installed (none by default)
if [ ! -f package.json ]; then
  echo "package.json not found. Creating a minimal package.json"
  cat > package.json <<'EOF'
{
  "name": "filewatcher-pro",
  "version": "1.2.0",
  "type": "module",
  "scripts": {
    "test:readme": "node ./test_files/test_readme_example_fixed.js",
    "test:all": "node ./test_files/test_all_features.js"
  }
}
EOF
fi

# Create test directories
mkdir -p test_files/logs
mkdir -p test_files/features

# Make scripts executable
chmod +x setup.sh || true
chmod +x run_tests.sh || true

# Install dependencies if present
if [ -f package.json ]; then
  npm install || true
fi

echo "Setup complete. Run './run_tests.sh' to run the tests." 
