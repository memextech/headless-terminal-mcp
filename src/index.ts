#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools/ht.tool.js';

/**
 * Main MCP Server for HT (headless terminal) interactions
 */
async function main() {
    try {
        // Create the MCP server
        const server = new McpServer({
            name: 'ht-mcp-server',
            version: '1.0.0'
        });

        // Register HT tools
        registerTools(server);

        // Create stdio transport
        const transport = new StdioServerTransport();

        // Set up graceful shutdown
        let isShuttingDown = false;
        const cleanup = () => {
            if (!isShuttingDown) {
                isShuttingDown = true;
                try {
                    transport.close();
                } catch (e) {
                    // Ignore cleanup errors
                }
                process.exit(0);
            }
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        process.on('SIGPIPE', cleanup);

        // Connect the server to the transport
        await server.connect(transport);
        
    } catch (error) {
        // Log error to stderr and exit
        process.stderr.write(`HT MCP Server error: ${error}\n`);
        process.exit(1);
    }
}

// Start the server
main();