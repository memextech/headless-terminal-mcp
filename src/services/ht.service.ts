import { spawn, ChildProcess } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

export interface HTSession {
    id: string;
    process: ChildProcess;
    isAlive: boolean;
    createdAt: Date;
}

export interface HTCommand {
    type: string;
    [key: string]: any;
}

export interface HTResponse {
    type: string;
    data: any;
}

class HTService {
    private sessions = new Map<string, HTSession>();

    /**
     * Create a new HT session with bash (default)
     */
    async createSession(command: string[] = ['bash']): Promise<string> {
        const sessionId = uuidv4();
        
        try {
            // Check if HT is available first
            try {
                const testProcess = spawn('ht', ['--version'], { stdio: 'pipe' });
                await new Promise((resolve, reject) => {
                    testProcess.on('exit', (code) => {
                        if (code === 0) resolve(code);
                        else reject(new Error(`HT not available (exit code: ${code})`));
                    });
                    testProcess.on('error', reject);
                    setTimeout(() => reject(new Error('HT version check timeout')), 2000);
                });
            } catch (error) {
                throw new Error(`HT is not available: ${error}`);
            }

            // Start HT process with subscription to events
            const htProcess = spawn('ht', ['--subscribe', 'snapshot,output', ...command], {
                stdio: ['pipe', 'pipe', 'pipe'],
                detached: false
            });

            const session: HTSession = {
                id: sessionId,
                process: htProcess,
                isAlive: true,
                createdAt: new Date(),
            };

            // Handle process exit
            htProcess.on('exit', (code) => {
                session.isAlive = false;
                // Don't log to console - it confuses MCP clients
            });

            htProcess.on('error', (error) => {
                session.isAlive = false;
                this.sessions.delete(sessionId);
            });

            this.sessions.set(sessionId, session);
            
            // Give HT a moment to start
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Verify the session is still alive
            if (!session.isAlive) {
                this.sessions.delete(sessionId);
                throw new Error('HT session failed to start');
            }
            
            return sessionId;
        } catch (error) {
            throw new Error(`Failed to create HT session: ${error}`);
        }
    }

    /**
     * Send a command to an HT session
     */
    async sendCommand(sessionId: string, command: HTCommand): Promise<void> {
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
    async readOutput(sessionId: string, timeoutMs: number = 8000): Promise<HTResponse[]> {
        const session = this.sessions.get(sessionId);
        if (!session || !session.isAlive) {
            throw new Error(`Session ${sessionId} not found or not alive`);
        }

        return new Promise((resolve) => {
            const responses: HTResponse[] = [];
            let buffer = '';
            
            const cleanup = () => {
                session.process.stdout?.removeListener('data', onData);
            };

            const timeout = setTimeout(() => {
                cleanup();
                resolve(responses);
            }, timeoutMs);

            const onData = (data: Buffer) => {
                buffer += data.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const response = JSON.parse(line.trim());
                            responses.push(response);
                        } catch (error) {
                            // Ignore non-JSON lines
                        }
                    }
                }
            };

            session.process.stdout?.on('data', onData);
        });
    }

    /**
     * Execute a command and wait for output
     */
    async executeCommand(sessionId: string, command: HTCommand, timeoutMs: number = 8000): Promise<HTResponse[]> {
        await this.sendCommand(sessionId, command);
        // Small delay to let command process
        await new Promise(resolve => setTimeout(resolve, 200));
        return await this.readOutput(sessionId, timeoutMs);
    }

    /**
     * Take a snapshot of the terminal
     */
    async takeSnapshot(sessionId: string): Promise<string> {
        const session = this.sessions.get(sessionId);
        if (!session || !session.isAlive) {
            throw new Error(`Session ${sessionId} not found or not alive`);
        }

        return new Promise((resolve, reject) => {
            let buffer = '';
            let snapshotReceived = false;
            
            const onData = (data: Buffer) => {
                buffer += data.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const response = JSON.parse(line.trim());
                            if (response.type === 'snapshot' && response.data) {
                                snapshotReceived = true;
                                cleanup();
                                
                                if (response.data.text) {
                                    resolve(response.data.text);
                                } else if (response.data.seq) {
                                    resolve(response.data.seq);
                                } else {
                                    reject(new Error('Snapshot data missing text/seq fields'));
                                }
                                return;
                            }
                        } catch (error) {
                            // Ignore non-JSON lines
                        }
                    }
                }
            };

            const cleanup = () => {
                session.process.stdout?.removeListener('data', onData);
                clearTimeout(timeout);
            };

            const timeout = setTimeout(() => {
                cleanup();
                if (!snapshotReceived) {
                    reject(new Error('Snapshot timeout - no response received'));
                }
            }, 8000);

            // Listen for data
            session.process.stdout?.on('data', onData);
            
            // Send the snapshot command
            const commandJson = JSON.stringify({ type: 'takeSnapshot' }) + '\n';
            session.process.stdin?.write(commandJson);
        });
    }

    /**
     * Send keys to the terminal
     */
    async sendKeys(sessionId: string, keys: string[]): Promise<void> {
        await this.sendCommand(sessionId, { type: 'sendKeys', keys });
    }

    /**
     * Get session info
     */
    getSession(sessionId: string): HTSession | undefined {
        return this.sessions.get(sessionId);
    }

    /**
     * List all sessions
     */
    listSessions(): HTSession[] {
        return Array.from(this.sessions.values());
    }

    /**
     * Close a session
     */
    closeSession(sessionId: string): void {
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
    closeAllSessions(): void {
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