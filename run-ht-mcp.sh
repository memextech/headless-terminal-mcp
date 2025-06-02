#!/bin/bash

# Clean wrapper script for HT MCP Server
# Clears environment variables that might conflict with Node.js

# Clear potentially problematic environment variables
unset DYLD_LIBRARY_PATH
unset LD_LIBRARY_PATH
unset DYLD_FALLBACK_LIBRARY_PATH

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Use node from PATH and relative path to the built server
exec node "$SCRIPT_DIR/dist/index.js" "$@"