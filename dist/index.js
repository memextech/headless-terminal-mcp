#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools/ht.tool.js';
/**
 * Main MCP Server for HT (headless terminal) interactions
 */
async function main() {
    // Create the MCP server
    const server = new McpServer({
        name: 'ht-mcp-server',
        version: '1.0.0'
    });
    // Register HT tools
    registerTools(server);
    // Log server capabilities
    console.error('HT MCP Server starting...');
    console.error('Available tools:');
    console.error('  - ht_create_session: Create a new HT session');
    console.error('  - ht_send_keys: Send keys to an HT session');
    console.error('  - ht_take_snapshot: Take a terminal snapshot');
    console.error('  - ht_execute_command: Execute a command and get output');
    console.error('  - ht_list_sessions: List active sessions');
    console.error('  - ht_close_session: Close a session');
    console.error('');
    // Create stdio transport
    const transport = new StdioServerTransport();
    // Connect the server to the transport
    await server.connect(transport);
    console.error('HT MCP Server connected and ready for requests!');
}
// Handle process termination gracefully
process.on('SIGINT', () => {
    console.error('\nShutting down HT MCP Server...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.error('\nShutting down HT MCP Server...');
    process.exit(0);
});
// Start the server
main().catch((error) => {
    console.error('Failed to start HT MCP Server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map