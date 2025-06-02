# Manual HT Usage Guide

## The Simple Answer

Yes, you send JSON objects to HT! Here's exactly how:

### 1. Start HT in your terminal
```bash
ht --subscribe snapshot bash
```

### 2. Type JSON commands directly in that same terminal

Each command is a JSON object on one line. Press Enter after each one.

## Example Session

Here's what a real manual session looks like:

```bash
$ ht --subscribe snapshot bash
The default interactive shell is now zsh.
To update your account to use zsh, please run `chsh -s /bin/zsh`.
For more details, please visit https://support.apple.com/kb/HT208050.
bash-3.2$ 
```

Now you type these JSON commands:

**Take a snapshot:**
```json
{"type": "takeSnapshot"}
```
Press Enter → You'll see the current terminal state printed as JSON

**Send a command:**
```json
{"type": "sendKeys", "keys": ["echo hello"]}
```
Press Enter

**Press Enter key in the virtual terminal:**
```json
{"type": "sendKeys", "keys": ["Enter"]}
```
Press Enter → You'll see "hello" appear in the output

**Take another snapshot:**
```json
{"type": "takeSnapshot"}
```
Press Enter → You'll see the updated terminal state

## For npm create-vite specifically:

**1. Navigate to temp directory:**
```json
{"type": "sendKeys", "keys": ["cd /tmp && mkdir vite-test && cd vite-test"]}
```
```json
{"type": "sendKeys", "keys": ["Enter"]}
```

**2. Start npm create-vite:**
```json
{"type": "sendKeys", "keys": ["npm create vite@latest"]}
```
```json
{"type": "sendKeys", "keys": ["Enter"]}
```

**3. Wait a few seconds, then check what prompts appeared:**
```json
{"type": "takeSnapshot"}
```

**4. Respond to prompts (framework selection):**
```json
{"type": "sendKeys", "keys": ["Enter"]}
```

**5. Check again:**
```json
{"type": "takeSnapshot"}
```

**6. Select variant (e.g., TypeScript):**
```json
{"type": "sendKeys", "keys": ["Down"]}
```
```json
{"type": "sendKeys", "keys": ["Enter"]}
```

**7. Check final result:**
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

- **Same terminal**: You type JSON into the same terminal where you started HT
- **One line per command**: Each JSON object goes on its own line
- **Press Enter**: After each JSON command, press Enter
- **Real-time feedback**: With `--subscribe snapshot` you see results immediately
- **Snapshots are your friend**: Use `{"type": "takeSnapshot"}` liberally to see what's happening

## Try it now:

1. Open a terminal
2. Run: `ht --subscribe snapshot bash`
3. Type: `{"type": "takeSnapshot"}` and press Enter
4. You'll see the current terminal state!

It's that simple!