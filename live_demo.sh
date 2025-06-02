#!/bin/bash

echo "=== Live HT Demo ==="
echo ""
echo "This simulates what you would type manually in an HT session"
echo ""

# Start HT and send commands via pipe
{
    echo "Step 1: Taking initial snapshot..."
    echo '{"type": "takeSnapshot"}'
    sleep 2
    
    echo ""
    echo "Step 2: Sending 'echo hello' command..."
    echo '{"type": "sendKeys", "keys": ["echo hello from HT"]}'
    echo '{"type": "sendKeys", "keys": ["Enter"]}'
    sleep 1
    
    echo ""
    echo "Step 3: Taking snapshot to see result..."
    echo '{"type": "takeSnapshot"}'
    sleep 2
    
    echo ""
    echo "Step 4: Running ls command..."
    echo '{"type": "sendKeys", "keys": ["ls -la /tmp"]}'
    echo '{"type": "sendKeys", "keys": ["Enter"]}'
    sleep 1
    
    echo ""
    echo "Step 5: Final snapshot..."
    echo '{"type": "takeSnapshot"}'
    sleep 2
    
} | ht --subscribe snapshot bash

echo ""
echo "=== Demo Complete ==="
echo ""
echo "In real usage, you would:"
echo "1. Run: ht --subscribe snapshot bash"
echo "2. Type each JSON command manually and press Enter"
echo "3. See the results immediately in your terminal"