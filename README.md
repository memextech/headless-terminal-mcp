# HT MCP Server

A Model Context Protocol (MCP) server for interacting with HT (headless terminal) sessions. This allows AI assistants to programmatically control and interact with terminal applications through the HT interface.

## What is HT?

HT (headless terminal) wraps any binary with a VT100 style terminal interface and allows programmatic access via JSON commands. This MCP server provides a clean interface for AI assistants to create HT sessions, send commands, and capture terminal output.

## Prerequisites

- [HT (headless terminal)](https://github.com/andyk/ht) installed and available in PATH
- Node.js 18+ 
- TypeScript

## Installation

```bash
# Clone and setup
git clone <this-repo>
cd ht-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Running the MCP Server

```bash
# Start the MCP server
npm start

# Or run in development mode
npm run dev
```

### Available Tools

The server provides the following MCP tools:

#### `ht_create_session`
Create a new HT session.
- **Arguments**: 
  - `command` (optional): Array of command arguments (default: `["bash"]`)
- **Returns**: Session ID for use with other tools

#### `ht_send_keys`
Send keys to an HT session.
- **Arguments**:
  - `sessionId`: HT session ID
  - `keys`: Array of keys/text to send (supports special keys like "Enter", "Down", "^c", etc.)

#### `ht_take_snapshot`
Take a snapshot of the current terminal state.
- **Arguments**:
  - `sessionId`: HT session ID
- **Returns**: Current terminal content as text

#### `ht_execute_command`
Execute a command and return the output (convenience method).
- **Arguments**:
  - `sessionId`: HT session ID
  - `command`: Command to execute
- **Returns**: Terminal output after command execution

#### `ht_list_sessions`
List all active HT sessions.
- **Returns**: List of active sessions with metadata

#### `ht_close_session`
Close an HT session and clean up resources.
- **Arguments**:
  - `sessionId`: HT session ID to close

## Example Workflow

Here's how an AI assistant might use these tools to automate `npm create vite`:

```javascript
// 1. Create a new HT session
const session = await ht_create_session({});

// 2. Navigate to a working directory
await ht_execute_command({
    sessionId: session.sessionId,
    command: "cd /tmp && mkdir vite-test && cd vite-test"
});

// 3. Start npm create vite
await ht_send_keys({
    sessionId: session.sessionId,
    keys: ["npm create vite@latest my-app"]
});
await ht_send_keys({
    sessionId: session.sessionId,
    keys: ["Enter"]
});

// 4. Wait and check what prompts appeared
const snapshot = await ht_take_snapshot({
    sessionId: session.sessionId
});

// 5. Respond to prompts based on snapshot content
if (snapshot.snapshot.includes("framework")) {
    await ht_send_keys({
        sessionId: session.sessionId,
        keys: ["Enter"]  // Select default framework
    });
}

// 6. Continue responding to prompts...
await ht_send_keys({
    sessionId: session.sessionId,
    keys: ["Down"]  // Navigate to TypeScript variant
});
await ht_send_keys({
    sessionId: session.sessionId,
    keys: ["Enter"]  // Select TypeScript
});

// 7. Verify the project was created
const result = await ht_execute_command({
    sessionId: session.sessionId,
    command: "ls -la"
});

// 8. Clean up
await ht_close_session({
    sessionId: session.sessionId
});
```

## Key Features

- **Session Management**: Create and manage multiple HT sessions
- **Interactive Commands**: Handle interactive CLI tools like `npm create`, `git`, etc.
- **Terminal Snapshots**: Capture terminal state to understand what's happening
- **Special Key Support**: Send arrow keys, Ctrl combinations, Enter, etc.
- **Error Handling**: Robust error handling and session cleanup

## Integration with AI Assistants

This MCP server enables AI assistants to:

- Automate complex interactive CLI workflows
- Debug terminal applications by taking snapshots
- Handle multi-step processes that require user input
- Work with any CLI tool that has interactive prompts

## Development

```bash
# Build
npm run build

# Development mode with hot reload
npm run dev

# Lint
npm run lint

# Clean build artifacts
npm run clean
```

## Troubleshooting

1. **HT not found**: Make sure HT is installed and in your PATH
2. **Session timeouts**: Increase timeout values for slow commands
3. **Non-JSON output**: The service filters out non-JSON lines automatically
4. **Process cleanup**: Sessions are automatically cleaned up on server shutdown

## License

ISC