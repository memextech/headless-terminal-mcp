import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
class HTService {
    sessions = new Map();
    /**
     * Create a new HT session with bash (default)
     */
    async createSession(command = ['bash']) {
        const sessionId = uuidv4();
        try {
            // Start HT process with subscription to events
            const htProcess = spawn('ht', ['--subscribe', 'snapshot,output', ...command], {
                stdio: ['pipe', 'pipe', 'pipe'],
            });
            const session = {
                id: sessionId,
                process: htProcess,
                isAlive: true,
                createdAt: new Date(),
            };
            // Handle process exit
            htProcess.on('exit', (code) => {
                session.isAlive = false;
                console.log(`HT session ${sessionId} exited with code ${code}`);
            });
            htProcess.on('error', (error) => {
                session.isAlive = false;
                console.error(`HT session ${sessionId} error:`, error);
            });
            this.sessions.set(sessionId, session);
            // Give HT a moment to start
            await new Promise(resolve => setTimeout(resolve, 500));
            return sessionId;
        }
        catch (error) {
            throw new Error(`Failed to create HT session: ${error}`);
        }
    }
    /**
     * Send a command to an HT session
     */
    async sendCommand(sessionId, command) {
        const session = this.sessions.get(sessionId);
        if (!session || !session.isAlive) {
            throw new Error(`Session ${sessionId} not found or not alive`);
        }
        const commandJson = JSON.stringify(command) + '\n';
        session.process.stdin?.write(commandJson);
    }
    /**
     * Read output from an HT session with timeout
     */
    async readOutput(sessionId, timeoutMs = 5000) {
        const session = this.sessions.get(sessionId);
        if (!session || !session.isAlive) {
            throw new Error(`Session ${sessionId} not found or not alive`);
        }
        return new Promise((resolve, reject) => {
            const responses = [];
            let buffer = '';
            const timeout = setTimeout(() => {
                session.process.stdout?.removeListener('data', onData);
                resolve(responses);
            }, timeoutMs);
            const onData = (data) => {
                buffer += data.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer
                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const response = JSON.parse(line.trim());
                            responses.push(response);
                        }
                        catch (error) {
                            // Ignore non-JSON lines
                        }
                    }
                }
            };
            session.process.stdout?.on('data', onData);
            // Clean up after timeout or when we get data
            setTimeout(() => {
                clearTimeout(timeout);
                session.process.stdout?.removeListener('data', onData);
                resolve(responses);
            }, timeoutMs);
        });
    }
    /**
     * Execute a command and wait for output
     */
    async executeCommand(sessionId, command, timeoutMs = 5000) {
        await this.sendCommand(sessionId, command);
        // Small delay to let command process
        await new Promise(resolve => setTimeout(resolve, 100));
        return await this.readOutput(sessionId, timeoutMs);
    }
    /**
     * Take a snapshot of the terminal
     */
    async takeSnapshot(sessionId) {
        const responses = await this.executeCommand(sessionId, { type: 'takeSnapshot' });
        const snapshotResponse = responses.find(r => r.type === 'snapshot');
        if (snapshotResponse && snapshotResponse.data && snapshotResponse.data.text) {
            return snapshotResponse.data.text;
        }
        throw new Error('No snapshot data received');
    }
    /**
     * Send keys to the terminal
     */
    async sendKeys(sessionId, keys) {
        await this.sendCommand(sessionId, { type: 'sendKeys', keys });
    }
    /**
     * Get session info
     */
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    /**
     * List all sessions
     */
    listSessions() {
        return Array.from(this.sessions.values());
    }
    /**
     * Close a session
     */
    closeSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.process.kill();
            session.isAlive = false;
            this.sessions.delete(sessionId);
        }
    }
    /**
     * Close all sessions
     */
    closeAllSessions() {
        for (const session of this.sessions.values()) {
            session.process.kill();
        }
        this.sessions.clear();
    }
}
// Singleton instance
export const htService = new HTService();
// Clean up on process exit
process.on('exit', () => {
    htService.closeAllSessions();
});
process.on('SIGINT', () => {
    htService.closeAllSessions();
    process.exit(0);
});
process.on('SIGTERM', () => {
    htService.closeAllSessions();
    process.exit(0);
});
//# sourceMappingURL=ht.service.js.map