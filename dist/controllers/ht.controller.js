import { htService } from '../services/ht.service.js';
/**
 * Create a new HT session
 */
export async function createSession(options = {}) {
    try {
        const sessionId = await htService.createSession(options.command, options.enableWebServer);
        const session = htService.getSession(sessionId);
        return {
            success: true,
            data: {
                sessionId,
                message: 'HT session created successfully',
                webServerEnabled: options.enableWebServer || false,
                webServerUrl: session?.webServerUrl
            }
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error creating session'
        };
    }
}
/**
 * Send keys to an HT session
 */
export async function sendKeys(options) {
    try {
        await htService.sendKeys(options.sessionId, options.keys);
        return {
            success: true,
            data: {
                message: `Keys sent to session ${options.sessionId}`,
                keys: options.keys
            }
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error sending keys'
        };
    }
}
/**
 * Take a snapshot of the terminal
 */
export async function takeSnapshot(options) {
    try {
        const snapshot = await htService.takeSnapshot(options.sessionId);
        return {
            success: true,
            data: {
                sessionId: options.sessionId,
                snapshot
            }
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error taking snapshot'
        };
    }
}
/**
 * Execute a command by sending keys and taking a snapshot
 */
export async function executeCommand(options) {
    try {
        // Send the command
        await htService.sendKeys(options.sessionId, [options.command]);
        // Send Enter key
        await htService.sendKeys(options.sessionId, ['Enter']);
        // Wait a moment for command to execute
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Take a snapshot to see the result
        const snapshot = await htService.takeSnapshot(options.sessionId);
        return {
            success: true,
            data: {
                sessionId: options.sessionId,
                command: options.command,
                snapshot
            }
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error executing command'
        };
    }
}
/**
 * List all active sessions
 */
export async function listSessions() {
    try {
        const sessions = htService.listSessions();
        const sessionInfo = sessions.map(session => ({
            id: session.id,
            isAlive: session.isAlive,
            createdAt: session.createdAt.toISOString()
        }));
        return {
            success: true,
            data: {
                sessions: sessionInfo,
                count: sessionInfo.length
            }
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error listing sessions'
        };
    }
}
/**
 * Close an HT session
 */
export async function closeSession(sessionId) {
    try {
        const session = htService.getSession(sessionId);
        if (!session) {
            return {
                success: false,
                error: `Session ${sessionId} not found`
            };
        }
        htService.closeSession(sessionId);
        return {
            success: true,
            data: {
                sessionId,
                message: 'Session closed successfully'
            }
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error closing session'
        };
    }
}
//# sourceMappingURL=ht.controller.js.map