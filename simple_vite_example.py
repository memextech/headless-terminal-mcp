#!/usr/bin/env python3
"""
Simple example of using HT (headless terminal) to automate npm create-vite
"""

import json
import subprocess
import time
import sys

def send_command(process, command_dict):
    """Send a JSON command to HT"""
    command_json = json.dumps(command_dict) + '\n'
    print(f"Sending: {command_json.strip()}")
    process.stdin.write(command_json.encode())
    process.stdin.flush()

def take_snapshot(process):
    """Take a snapshot of the terminal and return the output"""
    send_command(process, {"type": "takeSnapshot"})
    time.sleep(0.5)  # Give it a moment to process

def send_keys(process, keys):
    """Send keys to the terminal"""
    send_command(process, {"type": "sendKeys", "keys": keys})

def main():
    print("Starting HT headless terminal example...")
    
    # Start HT with bash, subscribing to snapshot events
    ht_process = subprocess.Popen(
        ['ht', '--subscribe', 'snapshot,output', 'bash'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=False  # We'll handle encoding ourselves
    )
    
    try:
        # Give HT a moment to start
        time.sleep(1)
        
        print("Taking initial snapshot...")
        take_snapshot(ht_process)
        
        # Create a temporary directory for our project
        print("Creating temp directory...")
        send_keys(ht_process, ["mkdir -p /tmp/vite-test && cd /tmp/vite-test"])
        send_keys(ht_process, ["Enter"])
        time.sleep(1)
        
        # Start npm create-vite
        print("Starting npm create-vite...")
        send_keys(ht_process, ["npm create vite@latest"])
        send_keys(ht_process, ["Enter"])
        time.sleep(2)
        
        take_snapshot(ht_process)
        
        # Project name (just press enter for default)
        print("Setting project name...")
        send_keys(ht_process, ["my-vite-app"])
        send_keys(ht_process, ["Enter"])
        time.sleep(1)
        
        take_snapshot(ht_process)
        
        # Select framework (let's choose vanilla)
        print("Selecting framework...")
        send_keys(ht_process, ["Down", "Down"])  # Navigate to Vanilla
        send_keys(ht_process, ["Enter"])
        time.sleep(1)
        
        take_snapshot(ht_process)
        
        # Select variant (TypeScript)
        print("Selecting variant...")
        send_keys(ht_process, ["Down"])  # Navigate to TypeScript
        send_keys(ht_process, ["Enter"])
        time.sleep(2)
        
        take_snapshot(ht_process)
        
        # Check if the project was created
        print("Checking if project was created...")
        send_keys(ht_process, ["ls -la"])
        send_keys(ht_process, ["Enter"])
        time.sleep(1)
        
        take_snapshot(ht_process)
        
        print("Done! The example completed successfully.")
        
        # Read any remaining output
        print("\n--- HT Output ---")
        for line in iter(ht_process.stdout.readline, b''):
            if not line:
                break
            try:
                decoded_line = line.decode('utf-8').strip()
                if decoded_line:
                    data = json.loads(decoded_line)
                    if data.get('type') == 'snapshot':
                        print("Terminal snapshot:")
                        print(data['data']['text'])
                        print("-" * 40)
                    elif data.get('type') == 'output':
                        print(f"Output: {data['data']['seq']}")
            except (json.JSONDecodeError, UnicodeDecodeError):
                # Skip non-JSON lines
                pass
        
    except KeyboardInterrupt:
        print("\nInterrupted by user")
    finally:
        # Clean up
        ht_process.terminate()
        ht_process.wait()

if __name__ == "__main__":
    main()