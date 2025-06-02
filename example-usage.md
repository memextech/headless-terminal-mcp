# Example: Using HT MCP Server to Automate npm create-vite

This example shows how an AI assistant can use the HT MCP server to automate the interactive `npm create-vite` process.

## Step-by-Step Automation

### 1. Create HT Session
```json
{
  "method": "tools/call",
  "params": {
    "name": "ht_create_session",
    "arguments": {}
  }
}
```
**Response**: Session ID (e.g., `"13636da2-f0dc-4337-8b7d-1a89c7685b00"`)

### 2. Setup Working Directory
```json
{
  "method": "tools/call",
  "params": {
    "name": "ht_execute_command",
    "arguments": {
      "sessionId": "13636da2-f0dc-4337-8b7d-1a89c7685b00",
      "command": "cd /tmp && mkdir vite-test && cd vite-test"
    }
  }
}
```

### 3. Start npm create-vite
```json
{
  "method": "tools/call",
  "params": {
    "name": "ht_send_keys",
    "arguments": {
      "sessionId": "13636da2-f0dc-4337-8b7d-1a89c7685b00",
      "keys": ["npm create vite@latest my-app"]
    }
  }
}
```

```json
{
  "method": "tools/call",
  "params": {
    "name": "ht_send_keys",
    "arguments": {
      "sessionId": "13636da2-f0dc-4337-8b7d-1a89c7685b00",
      "keys": ["Enter"]
    }
  }
}
```

### 4. Check What Prompts Appeared
```json
{
  "method": "tools/call",
  "params": {
    "name": "ht_take_snapshot",
    "arguments": {
      "sessionId": "13636da2-f0dc-4337-8b7d-1a89c7685b00"
    }
  }
}
```

### 5. Respond to Framework Selection
Based on the snapshot, if it shows framework options, select Vanilla:
```json
{
  "method": "tools/call",
  "params": {
    "name": "ht_send_keys",
    "arguments": {
      "sessionId": "13636da2-f0dc-4337-8b7d-1a89c7685b00",
      "keys": ["Enter"]
    }
  }
}
```

### 6. Select TypeScript Variant
```json
{
  "method": "tools/call",
  "params": {
    "name": "ht_send_keys",
    "arguments": {
      "sessionId": "13636da2-f0dc-4337-8b7d-1a89c7685b00",
      "keys": ["Down"]
    }
  }
}
```

```json
{
  "method": "tools/call",
  "params": {
    "name": "ht_send_keys",
    "arguments": {
      "sessionId": "13636da2-f0dc-4337-8b7d-1a89c7685b00",
      "keys": ["Enter"]
    }
  }
}
```

### 7. Verify Project Creation
```json
{
  "method": "tools/call",
  "params": {
    "name": "ht_execute_command",
    "arguments": {
      "sessionId": "13636da2-f0dc-4337-8b7d-1a89c7685b00",
      "command": "ls -la"
    }
  }
}
```

### 8. Clean Up
```json
{
  "method": "tools/call",
  "params": {
    "name": "ht_close_session",
    "arguments": {
      "sessionId": "13636da2-f0dc-4337-8b7d-1a89c7685b00"
    }
  }
}
```

## Key Benefits

1. **State Visibility**: AI can see exactly what's on the terminal screen via snapshots
2. **Interactive Handling**: AI can respond to prompts by analyzing terminal content
3. **Reliable Automation**: Complex interactive workflows become programmatically controllable
4. **Error Recovery**: AI can take snapshots to debug when things go wrong

## Integration with Claude Desktop

To use this MCP server with Claude Desktop, add to your `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ht-server": {
      "command": "node",
      "args": ["/path/to/headless-terminal-mcp/dist/index.js"]
    }
  }
}
```

Or use the wrapper script for better environment handling:

```json
{
  "mcpServers": {
    "ht-server": {
      "command": "/path/to/headless-terminal-mcp/run-ht-mcp.sh",
      "args": []
    }
  }
}
```

Then restart Claude Desktop and you'll be able to ask Claude to automate terminal tasks using HT!