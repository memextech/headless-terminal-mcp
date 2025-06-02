#!/bin/bash

# Simple manual test of HT with npm create-vite
# This shows the raw JSON commands you would send to HT

echo "=== Manual HT Test with npm create-vite ==="
echo ""
echo "1. Start HT in one terminal:"
echo "   ht --subscribe snapshot bash"
echo ""
echo "2. In another terminal, send these JSON commands to HT's stdin:"
echo ""
echo "# Take initial snapshot"
echo '{"type": "takeSnapshot"}'
echo ""
echo "# Navigate to temp directory"
echo '{"type": "sendKeys", "keys": ["cd /tmp && mkdir -p vite-test && cd vite-test"]}'
echo '{"type": "sendKeys", "keys": ["Enter"]}'
echo ""
echo "# Start npm create-vite"
echo '{"type": "sendKeys", "keys": ["npm create vite@latest my-test-app"]}'
echo '{"type": "sendKeys", "keys": ["Enter"]}'
echo ""
echo "# Wait for prompts, then take snapshot to see what's happening"
echo '{"type": "takeSnapshot"}'
echo ""
echo "# Select framework (Vanilla is usually first, so just press Enter)"
echo '{"type": "sendKeys", "keys": ["Enter"]}'
echo ""
echo "# Take another snapshot"
echo '{"type": "takeSnapshot"}'
echo ""
echo "# Select variant (TypeScript is usually second option)"
echo '{"type": "sendKeys", "keys": ["Down"]}'
echo '{"type": "sendKeys", "keys": ["Enter"]}'
echo ""
echo "# Take final snapshot"
echo '{"type": "takeSnapshot"}'
echo ""
echo "# Check what was created"
echo '{"type": "sendKeys", "keys": ["ls -la"]}'
echo '{"type": "sendKeys", "keys": ["Enter"]}'
echo ""
echo "# Final snapshot"
echo '{"type": "takeSnapshot"}'
echo ""
echo "Note: You can copy these JSON commands and paste them into the HT terminal to test interactively."