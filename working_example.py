#!/usr/bin/env python3
"""
Working example that properly captures and displays HT output
"""

import json
import subprocess
import time
import threading
import sys

def run_npm_create_vite():
    print("=== HT npm create-vite Automation ===\n")
    
    # Start HT
    process = subprocess.Popen(
        ['ht', '--subscribe', 'snapshot,output', 'bash'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    def send_command(cmd_dict):
        """Send JSON command to HT"""
        cmd = json.dumps(cmd_dict) + '\n'
        print(f"Sending: {cmd.strip()}")
        process.stdin.write(cmd)
        process.stdin.flush()
    
    def send_keys(keys):
        """Send keys to terminal"""
        send_command({"type": "sendKeys", "keys": keys})
    
    def read_output():
        """Read and print HT output"""
        for line in iter(process.stdout.readline, ''):
            if line.strip():
                try:
                    data = json.loads(line.strip())
                    if data.get('type') == 'snapshot':
                        print("\n--- Terminal Snapshot ---")
                        print(data['data']['text'])
                        print("--- End Snapshot ---\n")
                    elif data.get('type') == 'output':
                        sys.stdout.write(data['data']['seq'])
                        sys.stdout.flush()
                except json.JSONDecodeError:
                    print(f"Non-JSON output: {line.strip()}")
    
    # Start output reader thread
    output_thread = threading.Thread(target=read_output)
    output_thread.daemon = True
    output_thread.start()
    
    try:
        # Give HT time to start
        time.sleep(1)
        
        print("1. Taking initial snapshot...")
        send_command({"type": "takeSnapshot"})
        time.sleep(1)
        
        print("2. Setting up temp directory...")
        send_keys(["cd /tmp && rm -rf ht-vite-test && mkdir ht-vite-test && cd ht-vite-test"])
        send_keys(["Enter"])
        time.sleep(1)
        
        print("3. Starting npm create-vite...")
        send_keys(["npm create vite@latest my-vite-app"])
        send_keys(["Enter"])
        time.sleep(4)  # Give npm time to download
        
        print("4. Taking snapshot to see prompts...")
        send_command({"type": "takeSnapshot"})
        time.sleep(1)
        
        print("5. Selecting framework (Vanilla - pressing Enter)...")
        send_keys(["Enter"])
        time.sleep(1)
        
        print("6. Taking snapshot after framework selection...")
        send_command({"type": "takeSnapshot"})
        time.sleep(1)
        
        print("7. Selecting TypeScript variant...")
        send_keys(["Down"])  # Move to TypeScript
        send_keys(["Enter"])
        time.sleep(2)
        
        print("8. Checking what was created...")
        send_keys(["ls -la"])
        send_keys(["Enter"])
        time.sleep(1)
        
        print("9. Taking final snapshot...")
        send_command({"type": "takeSnapshot"})
        time.sleep(2)
        
        print("\n=== Automation Complete ===")
        
    except KeyboardInterrupt:
        print("\nInterrupted by user")
    finally:
        process.terminate()
        process.wait()

if __name__ == "__main__":
    run_npm_create_vite()