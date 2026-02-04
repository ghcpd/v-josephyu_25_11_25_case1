#!/bin/bash

# setup.sh - Setup environment for FileWatcher Pro v1.2 testing
# This script prepares the test environment and dependencies

set -e

echo "=========================================="
echo "FileWatcher Pro v1.2 - Setup Script"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"

# Create necessary directories
echo ""
echo "Creating test directories..."
mkdir -p test_files/watch_dir
mkdir -p test_files/output
mkdir -p test_files/logs
mkdir -p test_files/temp

echo "✓ Directories created"

# Initialize test files
echo ""
echo "Initializing test files..."

# Create initial test files
touch test_files/watch_dir/sample.txt
touch test_files/watch_dir/data.json
touch test_files/watch_dir/document.js

# Create subdirectory for recursive tests
mkdir -p test_files/watch_dir/subdir
touch test_files/watch_dir/subdir/nested.log

echo "✓ Test files created"

# Create package.json if it doesn't exist
if [ ! -f package.json ]; then
    echo ""
    echo "Creating package.json..."
    cat > package.json << 'EOF'
{
  "name": "filewatcher-pro-tests",
  "version": "1.2.0",
  "type": "module",
  "description": "Test suite for FileWatcher Pro v1.2",
  "main": "filewatcher.js",
  "scripts": {
    "test": "bash run_tests.sh"
  },
  "author": "",
  "license": "MIT"
}
EOF
    echo "✓ package.json created"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Run tests with: bash run_tests.sh"
echo ""
