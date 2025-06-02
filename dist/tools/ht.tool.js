import { z } from 'zod';
import * as htController from '../controllers/ht.controller.js';
// Zod schemas for tool arguments
const CreateSessionArgs = z.object({
    command: z.array(z.string()).optional().describe('Command to run in the terminal (default: ["bash"])'),
    enableWebServer: z.boolean().optional().describe('Enable HT web server for live terminal preview (default: false)')
});
const SendKeysArgs = z.object({
    sessionId: z.string().describe('HT session ID'),
    keys: z.array(z.string()).describe('Array of keys to send (can include text and special keys like "Enter", "Down", etc.)')
});
const TakeSnapshotArgs = z.object({
    sessionId: z.string().describe('HT session ID')
});
const ExecuteCommandArgs = z.object({
    sessionId: z.string().describe('HT session ID'),
    command: z.string().describe('Command to execute in the terminal')
});
const CloseSessionArgs = z.object({
    sessionId: z.string().describe('HT session ID to close')
});
// Tool handlers
async function handleCreateSession(args) {
    const result = await htController.createSession({
        command: args.command,
        enableWebServer: args.enableWebServer
    });
    if (!result.success) {
        return {
            content: [{
                    type: 'text',
                    text: `Error creating HT session: ${result.error}`
                }],
            isError: true
        };
    }
    const webServerInfo = result.data.webServerEnabled
        ? `\n\n🌐 Web server enabled!${result.data.webServerUrl ? ` View live terminal at: ${result.data.webServerUrl}` : ' Check console for URL.'}`
        : '';
    return {
        content: [{
                type: 'text',
                text: `HT session created successfully!\n\nSession ID: ${result.data.sessionId}\n\nYou can now use this session ID with other HT tools to send commands and take snapshots.${webServerInfo}`
            }]
    };
}
async function handleSendKeys(args) {
    const result = await htController.sendKeys({
        sessionId: args.sessionId,
        keys: args.keys
    });
    if (!result.success) {
        return {
            content: [{
                    type: 'text',
                    text: `Error sending keys: ${result.error}`
                }],
            isError: true
        };
    }
    return {
        content: [{
                type: 'text',
                text: `Keys sent successfully to session ${args.sessionId}\n\nKeys: ${JSON.stringify(args.keys)}`
            }]
    };
}
async function handleTakeSnapshot(args) {
    const result = await htController.takeSnapshot({
        sessionId: args.sessionId
    });
    if (!result.success) {
        return {
            content: [{
                    type: 'text',
                    text: `Error taking snapshot: ${result.error}`
                }],
            isError: true
        };
    }
    return {
        content: [{
                type: 'text',
                text: `Terminal Snapshot (Session: ${args.sessionId})\n\n\`\`\`\n${result.data.snapshot}\n\`\`\``
            }]
    };
}
async function handleExecuteCommand(args) {
    const result = await htController.executeCommand({
        sessionId: args.sessionId,
        command: args.command
    });
    if (!result.success) {
        return {
            content: [{
                    type: 'text',
                    text: `Error executing command: ${result.error}`
                }],
            isError: true
        };
    }
    return {
        content: [{
                type: 'text',
                text: `Command executed: ${args.command}\n\nTerminal Output:\n\`\`\`\n${result.data.snapshot}\n\`\`\``
            }]
    };
}
async function handleListSessions() {
    const result = await htController.listSessions();
    if (!result.success) {
        return {
            content: [{
                    type: 'text',
                    text: `Error listing sessions: ${result.error}`
                }],
            isError: true
        };
    }
    const sessionsList = result.data.sessions.map((session) => `- ${session.id} (${session.isAlive ? 'alive' : 'dead'}) - Created: ${session.createdAt}`).join('\n');
    return {
        content: [{
                type: 'text',
                text: `Active HT Sessions (${result.data.count}):\n\n${sessionsList || 'No active sessions'}`
            }]
    };
}
async function handleCloseSession(args) {
    const result = await htController.closeSession(args.sessionId);
    if (!result.success) {
        return {
            content: [{
                    type: 'text',
                    text: `Error closing session: ${result.error}`
                }],
            isError: true
        };
    }
    return {
        content: [{
                type: 'text',
                text: `Session ${args.sessionId} closed successfully.`
            }]
    };
}
// Register tools with the MCP server
export function registerTools(server) {
    server.tool('ht_create_session', 'Create a new HT (headless terminal) session. Returns a session ID that can be used with other HT tools. Optionally enable web server for live terminal preview.', CreateSessionArgs.shape, handleCreateSession);
    server.tool('ht_send_keys', 'Send keys to an HT session. Keys can include text and special keys like "Enter", "Down", "Up", "^c" (Ctrl+C), etc.', SendKeysArgs.shape, handleSendKeys);
    server.tool('ht_take_snapshot', 'Take a snapshot of the current terminal state. Returns the terminal content as text.', TakeSnapshotArgs.shape, handleTakeSnapshot);
    server.tool('ht_execute_command', 'Execute a command in the terminal and return the output. This combines sending the command + Enter key + taking a snapshot.', ExecuteCommandArgs.shape, handleExecuteCommand);
    server.tool('ht_list_sessions', 'List all active HT sessions.', {}, handleListSessions);
    server.tool('ht_close_session', 'Close an HT session and clean up resources.', CloseSessionArgs.shape, handleCloseSession);
}
//# sourceMappingURL=ht.tool.js.map