# Manual HT Demo - Step by Step

## 1. Start HT with event subscriptions

In your terminal, run:
```bash
ht --subscribe snapshot,output bash
```

You'll see something like:
```
The default interactive shell is now zsh.
To update your account to use zsh, please run `chsh -s /bin/zsh`.
For more details, please visit https://support.apple.com/kb/HT208050.
bash-3.2$ 
```

## 2. Now type JSON commands directly in the same terminal

### Take a snapshot to see current state:
```json
{"type": "takeSnapshot"}
```
Press Enter. You'll see the current terminal state printed out.

### Send some keys to run a command:
```json
{"type": "sendKeys", "keys": ["echo hello world"]}
```
Press Enter.

### Send the Enter key to execute the command:
```json
{"type": "sendKeys", "keys": ["Enter"]}
```
Press Enter. You'll see "hello world" appear in the output.

### Take another snapshot:
```json
{"type": "takeSnapshot"}
```
Press Enter. You'll see the updated terminal state with your command and its output.

## 3. For npm create-vite specifically:

### Navigate to a temp directory:
```json
{"type": "sendKeys", "keys": ["cd /tmp && mkdir test-dir && cd test-dir"]}
```
```json
{"type": "sendKeys", "keys": ["Enter"]}
```

### Start npm create-vite:
```json
{"type": "sendKeys", "keys": ["npm create vite@latest my-app"]}
```
```json
{"type": "sendKeys", "keys": ["Enter"]}
```

Wait a few seconds for npm to download, then take a snapshot to see the prompts:
```json
{"type": "takeSnapshot"}
```

### Respond to prompts:
```json
{"type": "sendKeys", "keys": ["Enter"]}
```
(This selects the default or first framework option)

```json
{"type": "sendKeys", "keys": ["Down"]}
```
(This moves down to TypeScript variant)

```json
{"type": "sendKeys", "keys": ["Enter"]}
```
(This selects TypeScript)

### Check the result:
```json
{"type": "sendKeys", "keys": ["ls -la"]}
```
```json
{"type": "sendKeys", "keys": ["Enter"]}
```
```json
{"type": "takeSnapshot"}
```

## Key Points:

- You type the JSON directly into the HT terminal
- Each JSON command should be on its own line
- Press Enter after each JSON command
- The `--subscribe snapshot,output` flag makes HT print events to stdout
- You'll see both the raw terminal output AND structured JSON events