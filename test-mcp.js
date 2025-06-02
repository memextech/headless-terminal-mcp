#!/usr/bin/env node

import { spawn } from 'child_process';

/**
 * Simple test client for the HT MCP server
 */
function testMCPServer() {
    console.log('Testing HT MCP Server...\n');

    // Start the MCP server
    const server = spawn('node', ['dist/index.js'], {
        stdio: ['pipe', 'pipe', 'inherit']
    });

    let responseBuffer = '';

    server.stdout.on('data', (data) => {
        responseBuffer += data.toString();
        
        // Try to parse JSON responses
        const lines = responseBuffer.split('\n');
        responseBuffer = lines.pop() || ''; // Keep incomplete line
        
        lines.forEach(line => {
            if (line.trim()) {
                try {
                    const response = JSON.parse(line);
                    console.log('📨 Response:', JSON.stringify(response, null, 2));
                } catch (e) {
                    console.log('📝 Output:', line);
                }
            }
        });
    });

    // Test sequence
    const tests = [
        // 1. Initialize the MCP connection
        {
            jsonrpc: "2.0",
            id: 1,
            method: "initialize",
            params: {
                protocolVersion: "2024-11-05",
                capabilities: {},
                clientInfo: {
                    name: "test-client",
                    version: "1.0.0"
                }
            }
        },
        
        // 2. List available tools
        {
            jsonrpc: "2.0",
            id: 2,
            method: "tools/list",
            params: {}
        },
        
        // 3. Create an HT session
        {
            jsonrpc: "2.0",
            id: 3,
            method: "tools/call",
            params: {
                name: "ht_create_session",
                arguments: {}
            }
        }
    ];

    let testIndex = 0;

    function sendNextTest() {
        if (testIndex < tests.length) {
            const test = tests[testIndex++];
            console.log(`\n🚀 Sending test ${testIndex}: ${test.method}`);
            server.stdin.write(JSON.stringify(test) + '\n');
            
            // Send next test after delay
            setTimeout(sendNextTest, 2000);
        } else {
            console.log('\n✅ All tests sent! Check responses above.');
            setTimeout(() => {
                server.kill();
                process.exit(0);
            }, 5000);
        }
    }

    // Start testing after server starts
    setTimeout(sendNextTest, 1000);

    server.on('error', (error) => {
        console.error('❌ Server error:', error);
    });

    server.on('exit', (code) => {
        console.log(`\n🏁 Server exited with code ${code}`);
    });
}

testMCPServer();