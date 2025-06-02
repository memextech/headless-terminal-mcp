#!/usr/bin/env python3
"""
Minimal example showing the essential pattern for using HT with interactive commands
"""

import json
import subprocess
import time

# Start HT with bash, subscribing to snapshot events
process = subprocess.Popen(
    ['ht', '--subscribe', 'snapshot', 'bash'],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

def send_ht_command(cmd_dict):
    """Send a JSON command to HT"""
    cmd = json.dumps(cmd_dict) + '\n'
    process.stdin.write(cmd)
    process.stdin.flush()

def send_keys(keys):
    """Send keys to the terminal"""
    send_ht_command({"type": "sendKeys", "keys": keys})

def take_snapshot():
    """Take a snapshot (results will appear in stdout)"""
    send_ht_command({"type": "takeSnapshot"})

# Give HT time to start
time.sleep(1)

print("Starting npm create-vite automation...")

# Setup temp directory
send_keys(["cd /tmp && rm -rf test-vite && mkdir test-vite && cd test-vite"])
send_keys(["Enter"])
time.sleep(1)

# Start npm create-vite
send_keys(["npm create vite@latest my-app"])
send_keys(["Enter"])
time.sleep(3)  # Wait for npm to download

# Respond to prompts
send_keys(["Enter"])    # Accept default project name or select Vanilla
time.sleep(1)
send_keys(["Down"])     # Move to TypeScript variant
send_keys(["Enter"])    # Select TypeScript
time.sleep(2)

# Check result
send_keys(["ls -la"])
send_keys(["Enter"])
time.sleep(1)

# Take final snapshot to see results
take_snapshot()

# Clean up
time.sleep(2)
process.terminate()
process.wait()

print("Automation complete! Check the terminal output above.")