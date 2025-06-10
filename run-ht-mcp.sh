#!/bin/bash

# Robust wrapper script for HT MCP Server
# Validates HT installation and provides clear error messages

set -euo pipefail

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to log errors to stderr
log_error() {
    echo "ERROR: $1" >&2
}

# Function to log info to stderr  
log_info() {
    echo "INFO: $1" >&2
}

# Function to check if HT is properly installed
check_ht_installation() {
    # Check if ht command exists
    if ! command -v ht >/dev/null 2>&1; then
        log_error "HT (headless terminal) is not installed or not in PATH"
        log_error "Please install HT using: cargo install --git https://github.com/andyk/ht"
        log_error "Make sure ~/.cargo/bin is in your PATH"
        return 1
    fi
    
    # Check if it's the correct ht binary by testing for expected options
    if ! ht --help 2>/dev/null | grep -q "headless terminal\|Terminal size\|Enable HTTP server" >/dev/null 2>&1; then
        log_error "Found 'ht' command but it doesn't appear to be the headless terminal binary"
        log_error "There might be another 'ht' command in your PATH"
        log_error "Expected: headless terminal from https://github.com/andyk/ht"
        log_error "Found: $(which ht)"
        log_error "Try: cargo install --git https://github.com/andyk/ht --force"
        return 1
    fi
    
    # Get version info for debugging
    local ht_version
    if ht_version=$(ht --version 2>/dev/null); then
        log_info "Using HT: $ht_version at $(which ht)"
    else
        log_info "Using HT at $(which ht)"
    fi
    
    return 0
}

# Function to check Node.js installation
check_node_installation() {
    if ! command -v node >/dev/null 2>&1; then
        log_error "Node.js is not installed or not in PATH"
        log_error "Please install Node.js 18+ from https://nodejs.org"
        return 1
    fi
    
    local node_version
    node_version=$(node --version)
    log_info "Using Node.js: $node_version at $(which node)"
    
    # Check if Node.js version is 18+
    local major_version
    major_version=$(echo "$node_version" | sed 's/v\([0-9]*\).*/\1/')
    if [[ $major_version -lt 18 ]]; then
        log_error "Node.js version $node_version is too old. Requires Node.js 18+"
        return 1
    fi
    
    return 0
}

# Function to check if the MCP server is built
check_mcp_server() {
    if [[ ! -f "$SCRIPT_DIR/dist/index.js" ]]; then
        log_error "MCP server is not built. dist/index.js not found"
        log_error "Please run: cd '$SCRIPT_DIR' && npm run build"
        return 1
    fi
    
    log_info "MCP server found at: $SCRIPT_DIR/dist/index.js"
    return 0
}

# Main execution
main() {
    log_info "Starting HT MCP Server validation..."
    
    # Run all checks
    if ! check_ht_installation; then
        exit 1
    fi
    
    if ! check_node_installation; then
        exit 1
    fi
    
    if ! check_mcp_server; then
        exit 1
    fi
    
    log_info "All checks passed. Starting HT MCP Server..."
    
    # Clear potentially problematic environment variables
    unset DYLD_LIBRARY_PATH
    unset LD_LIBRARY_PATH  
    unset DYLD_FALLBACK_LIBRARY_PATH
    
    # Start the MCP server
    exec node "$SCRIPT_DIR/dist/index.js" "$@"
}

# Run main function
main "$@"