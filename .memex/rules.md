# HT Headless Terminal Simple

## Project Purpose

This project exists to experiment with headless terminal (HT) and build tools to make working with HT easier from LLM agents.

## The Problem

Many command-line tools require interactive input, which makes them difficult or impossible to use for LLMs working with bash, zsh, or fish directly. For example, `npm create vite` presents interactive menus that require user navigation and selection.

## The Solution: HT (Headless Terminal)

HT (headless terminal) wraps any binary with a VT100 style terminal interface and allows programmatic access via JSON commands over STDIN/STDOUT. This enables LLM agents to interact with interactive CLI tools by:

1. Sending keystrokes programmatically
2. Taking terminal snapshots to see current state
3. Responding to interactive prompts based on terminal content

## Example: Using HT with `npm create vite`

Below is the sequence of steps required to use HT to perform `npm create vite`:

### 1. Start HT with subscriptions and web interface
```bash
ht --subscribe snapshot bash -l
```

### 2. Send the npm create vite command
```json
{"type": "sendKeys", "keys": ["npm create vite"]}
{"type": "sendKeys", "keys": ["Enter"]}
```

### 3. Take snapshot to see interactive menu
```json
{"type": "takeSnapshot"}
```
This gets the current state from the terminal and shows the interactive menu options.

### 4. Provide project name
```json
{"type": "sendKeys", "keys": ["my-app"]}
{"type": "sendKeys", "keys": ["Enter"]}
```
The first option for `npm create vite` is the project name.

### 5. Take snapshot to see next menu
```json
{"type": "takeSnapshot"}
```
This gets the current state from the terminal and shows the next interactive menu options.

### 6. Navigate framework selection menu
```json
{"type": "sendKeys", "keys": ["Down"]}
{"type": "sendKeys", "keys": ["Down"]}
{"type": "sendKeys", "keys": ["Enter"]}
```
Navigate the menu options using arrow keys and select with Enter.

### 7. Take snapshot to see next menu
```json
{"type": "takeSnapshot"}
```
This gets the current state from the terminal and shows the next interactive menu options.

### 8. Select variant option
```json
{"type": "sendKeys", "keys": ["Enter"]}
```
Select the default menu option.

### 9. Take final snapshot
```json
{"type": "takeSnapshot"}
```
Get the current state from the terminal to discover if the interactive menu options are finished and the command has executed (or may still be executing).

## Key HT Commands

- `{"type": "sendKeys", "keys": ["text"]}` - Send text to the terminal
- `{"type": "sendKeys", "keys": ["Enter"]}` - Send Enter key
- `{"type": "sendKeys", "keys": ["Down"]}` - Send Down arrow key
- `{"type": "sendKeys", "keys": ["Up"]}` - Send Up arrow key
- `{"type": "takeSnapshot"}` - Capture current terminal state as text

## Benefits for LLM Agents

1. **State visibility**: Agents can see exactly what's on the terminal screen
2. **Interactive handling**: Agents can respond to prompts by analyzing terminal content
3. **Reliable automation**: Complex interactive workflows become programmatically controllable
4. **Debugging**: Terminal snapshots provide clear feedback about what's happening

## Files in this Project

- `working_example.py` - Complete Python automation of npm create-vite
- `basic_ht_example.py` - Class-based HT controller for reusable interactions
- `MANUAL_USAGE.md` - Step-by-step guide for manual HT usage
- `README.md` - Complete project documentation and examples