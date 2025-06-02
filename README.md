# HT (Headless Terminal) Simple Examples

This repository contains simple examples of using [HT (headless terminal)](https://github.com/andyk/ht) to automate interactive command-line tools like `npm create-vite`.

## What is HT?

HT (headless terminal) is a Rust-based tool that wraps any binary with a VT100 style terminal interface and allows easy programmatic access to the input and output via JSON over STDIN/STDOUT. It's perfect for automating interactive CLI tools.

## Installation

Install HT using Cargo:

```bash
cargo install --git https://github.com/andyk/ht
```

Make sure `$HOME/.cargo/bin` is in your PATH.

## Files in this Repository

1. **`working_example.py`** - ✅ **RECOMMENDED** - Complete working example that:
   - Properly captures and displays HT output
   - Automates `npm create-vite` from start to finish
   - Shows terminal snapshots at each step

2. **`basic_ht_example.py`** - Comprehensive Python class-based example with:
   - HTController class for easier interaction
   - Both basic commands and npm create-vite automation
   - Queue-based output handling

3. **`minimal_example.py`** - Bare-bones example showing the essential pattern

4. **`quick_test.sh`** - Shell script that pipes JSON commands to HT

5. **`manual_ht_test.sh`** - Reference showing raw JSON commands for manual testing

## Running the Examples

### Python Example (Recommended)

```bash
python3 working_example.py
```

This will:
1. Start HT with bash
2. Navigate to a temp directory
3. Run `npm create-vite` and respond to all prompts automatically
4. Show terminal snapshots and real-time output
5. Verify the project was created successfully

### Alternative Examples

```bash
# Class-based approach with more features
python3 basic_ht_example.py

# Minimal example showing just the essentials
python3 minimal_example.py

# Shell script approach
./quick_test.sh
```

### Manual Testing

You can test HT manually by running it in interactive mode:

```bash
# Start HT with event subscriptions
ht --subscribe snapshot,output bash
```

Then in the same terminal, type JSON commands like:
```json
{"type": "takeSnapshot"}
{"type": "sendKeys", "keys": ["echo hello"]}
{"type": "sendKeys", "keys": ["Enter"]}
{"type": "takeSnapshot"}
```

## Key HT Commands

### Taking Snapshots
```json
{"type": "takeSnapshot"}
```
Returns the current terminal state as plain text.

### Sending Keys
```json
{"type": "sendKeys", "keys": ["npm create vite@latest"]}
{"type": "sendKeys", "keys": ["Enter"]}
```
Sends keystrokes to the terminal. Supports special keys like "Enter", "Down", "Up", "^c" (Ctrl+C), etc.

### Navigation Keys
- `"Enter"` - Enter key
- `"Down"`, `"Up"`, `"Left"`, `"Right"` - Arrow keys  
- `"Tab"` - Tab key
- `"^c"` or `"C-c"` - Ctrl+C
- `"Escape"` - Escape key

## How the npm create-vite Example Works

1. **Setup**: Start HT with bash and subscribe to events
2. **Navigate**: Go to a temp directory for testing
3. **Execute**: Run `npm create vite@latest my-app`
4. **Interact**: Respond to interactive prompts:
   - Project name (press Enter for default)
   - Framework selection (arrow keys + Enter)
   - Variant selection (arrow keys + Enter)
5. **Verify**: Check that the project was created successfully

## Use Cases

HT is perfect for:
- **Testing CLI tools** that have interactive prompts
- **Automating development workflows** 
- **LLM/AI agents** that need to interact with terminals
- **CI/CD pipelines** that need to handle interactive commands
- **Scripting complex terminal interactions**

## Tips

1. **Use snapshots liberally** - They help you understand what's happening
2. **Add delays** - Give interactive tools time to respond (`time.sleep()`)
3. **Subscribe to events** - Use `--subscribe snapshot,output` to see what's happening
4. **Test manually first** - Use the interactive mode to understand the flow
5. **Handle different terminal states** - Interactive tools may vary in their prompts

## Troubleshooting

- **Commands not working?** Check that the target tool (npm, etc.) is installed
- **Prompts different?** Interactive tools may change their prompts between versions
- **Timing issues?** Add more sleep time between commands
- **Output not captured?** Make sure you're subscribed to the right events

## Next Steps

- Explore the [HT documentation](https://github.com/andyk/ht) for advanced features
- Try automating other interactive CLI tools
- Add error handling and retries to your automation scripts
- Consider using HT's WebSocket API for real-time applications