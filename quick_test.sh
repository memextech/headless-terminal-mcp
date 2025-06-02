#!/bin/bash

# Quick test script showing HT basics

echo "=== HT Quick Test ==="
echo ""
echo "This script demonstrates using HT to automate npm create-vite"
echo ""

# Create a simple test that pipes commands to HT
(
echo '{"type": "takeSnapshot"}'
sleep 1
echo '{"type": "sendKeys", "keys": ["cd /tmp && mkdir -p ht-quick-test && cd ht-quick-test"]}'
echo '{"type": "sendKeys", "keys": ["Enter"]}'
sleep 1
echo '{"type": "sendKeys", "keys": ["npm create vite@latest quick-app"]}'
echo '{"type": "sendKeys", "keys": ["Enter"]}'
sleep 4
echo '{"type": "sendKeys", "keys": ["Enter"]}'
sleep 1
echo '{"type": "sendKeys", "keys": ["Down"]}'
echo '{"type": "sendKeys", "keys": ["Enter"]}'
sleep 2
echo '{"type": "sendKeys", "keys": ["ls -la"]}'
echo '{"type": "sendKeys", "keys": ["Enter"]}'
sleep 1
echo '{"type": "takeSnapshot"}'
sleep 2
) | ht --subscribe snapshot bash

echo ""
echo "=== Test Complete ==="