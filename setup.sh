#!/usr/bin/env bash
set -euo pipefail

# Ensure Node.js is installed (>=18 recommended)
node -v

# Install dependencies (none external; this will create node_modules/ if needed)
npm install
