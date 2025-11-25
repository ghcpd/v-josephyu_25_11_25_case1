#!/bin/bash

# FileWatcher Pro v1.2 - Setup Script
# This script sets up the environment for testing FileWatcher Pro

set -e  # Exit on error

echo "=========================================="
echo "FileWatcher Pro v1.2 - Environment Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Create test directories
echo "Creating test directories..."
mkdir -p test_files
mkdir -p test_data/logs
mkdir -p test_data/uploads
mkdir -p test_data/imports
mkdir -p test_data/config
mkdir -p test_data/incoming
mkdir -p test_output

echo "✓ Test directories created"
echo ""

# Initialize npm package if needed
if [ ! -f "package.json" ]; then
    echo "Creating package.json..."
    cat > package.json << 'EOF'
{
  "name": "filewatcher-pro-tests",
  "version": "1.0.0",
  "description": "Test suite for FileWatcher Pro v1.2",
  "type": "module",
  "main": "filewatcher.js",
  "scripts": {
    "test": "bash run_tests.sh",
    "setup": "bash setup.sh"
  },
  "keywords": ["filewatcher", "filesystem", "monitoring"],
  "author": "",
  "license": "MIT"
}
EOF
    echo "✓ package.json created"
else
    echo "✓ package.json already exists"
fi

echo ""

# Install dependencies (if any needed in future)
echo "Setting up npm dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Create sample files for testing
echo "Creating sample test files..."
echo "Sample log entry 1" > test_data/logs/sample1.log
echo "Sample log entry 2" > test_data/logs/sample2.log
echo '{"test": "data"}' > test_data/uploads/sample.json
echo "Configuration data" > test_data/config/config.txt

echo "✓ Sample files created"
echo ""

# Make run_tests.sh executable if it exists
if [ -f "run_tests.sh" ]; then
    chmod +x run_tests.sh
    echo "✓ run_tests.sh is executable"
fi

# Make setup.sh executable
chmod +x setup.sh
echo "✓ setup.sh is executable"
echo ""

echo "=========================================="
echo "✓ Setup completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Run: bash run_tests.sh"
echo "2. Check test_output/ for results"
echo "3. Review defects.txt for documentation issues"
echo "4. Review corrected_readme.md for complete API documentation"
echo ""
