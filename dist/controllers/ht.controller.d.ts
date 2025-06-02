export interface CreateSessionOptions {
    command?: string[];
    enableWebServer?: boolean;
}
export interface SendKeysOptions {
    sessionId: string;
    keys: string[];
}
export interface TakeSnapshotOptions {
    sessionId: string;
}
export interface ExecuteCommandOptions {
    sessionId: string;
    command: string;
}
export interface ControllerResponse {
    success: boolean;
    data?: any;
    error?: string;
}
/**
 * Create a new HT session
 */
export declare function createSession(options?: CreateSessionOptions): Promise<ControllerResponse>;
/**
 * Send keys to an HT session
 */
export declare function sendKeys(options: SendKeysOptions): Promise<ControllerResponse>;
/**
 * Take a snapshot of the terminal
 */
export declare function takeSnapshot(options: TakeSnapshotOptions): Promise<ControllerResponse>;
/**
 * Execute a command by sending keys and taking a snapshot
 */
export declare function executeCommand(options: ExecuteCommandOptions): Promise<ControllerResponse>;
/**
 * List all active sessions
 */
export declare function listSessions(): Promise<ControllerResponse>;
/**
 * Close an HT session
 */
export declare function closeSession(sessionId: string): Promise<ControllerResponse>;
