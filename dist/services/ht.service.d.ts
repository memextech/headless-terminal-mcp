import { ChildProcess } from 'child_process';
export interface HTSession {
    id: string;
    process: ChildProcess;
    isAlive: boolean;
    createdAt: Date;
    webServerUrl?: string;
}
export interface HTCommand {
    type: string;
    [key: string]: any;
}
export interface HTResponse {
    type: string;
    data: any;
}
declare class HTService {
    private sessions;
    /**
     * Create a new HT session with bash (default)
     */
    createSession(command?: string[], enableWebServer?: boolean): Promise<string>;
    /**
     * Send a command to an HT session
     */
    sendCommand(sessionId: string, command: HTCommand): Promise<void>;
    /**
     * Read output from an HT session with timeout
     */
    readOutput(sessionId: string, timeoutMs?: number): Promise<HTResponse[]>;
    /**
     * Execute a command and wait for output
     */
    executeCommand(sessionId: string, command: HTCommand, timeoutMs?: number): Promise<HTResponse[]>;
    /**
     * Take a snapshot of the terminal
     */
    takeSnapshot(sessionId: string): Promise<string>;
    /**
     * Send keys to the terminal
     */
    sendKeys(sessionId: string, keys: string[]): Promise<void>;
    /**
     * Get session info
     */
    getSession(sessionId: string): HTSession | undefined;
    /**
     * List all sessions
     */
    listSessions(): HTSession[];
    /**
     * Close a session
     */
    closeSession(sessionId: string): void;
    /**
     * Close all sessions
     */
    closeAllSessions(): void;
}
export declare const htService: HTService;
export {};
