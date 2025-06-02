#!/usr/bin/env python3
"""
Basic example showing how to use HT to interact with terminal programs
"""

import json
import subprocess
import time
import threading
import queue

class HTController:
    def __init__(self, command=['bash']):
        """Initialize HT with the given command"""
        self.process = subprocess.Popen(
            ['ht', '--subscribe', 'snapshot,output'] + command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Queue to collect output
        self.output_queue = queue.Queue()
        
        # Start thread to read output
        self.output_thread = threading.Thread(target=self._read_output)
        self.output_thread.daemon = True
        self.output_thread.start()
        
        # Give HT a moment to start
        time.sleep(0.5)
    
    def _read_output(self):
        """Read output from HT in a separate thread"""
        for line in iter(self.process.stdout.readline, ''):
            if line.strip():
                try:
                    data = json.loads(line.strip())
                    self.output_queue.put(data)
                except json.JSONDecodeError:
                    pass
    
    def send_command(self, command_dict):
        """Send a JSON command to HT"""
        command_json = json.dumps(command_dict) + '\n'
        self.process.stdin.write(command_json)
        self.process.stdin.flush()
    
    def send_keys(self, keys):
        """Send keys to the terminal"""
        self.send_command({"type": "sendKeys", "keys": keys})
    
    def take_snapshot(self):
        """Take a snapshot and return the terminal text"""
        self.send_command({"type": "takeSnapshot"})
        
        # Wait for snapshot response
        timeout = time.time() + 2  # 2 second timeout
        while time.time() < timeout:
            try:
                event = self.output_queue.get(timeout=0.1)
                if event.get('type') == 'snapshot':
                    return event['data']['text']
            except queue.Empty:
                continue
        return None
    
    def wait_for_output(self, timeout=2):
        """Wait for output events and return them"""
        outputs = []
        end_time = time.time() + timeout
        
        while time.time() < end_time:
            try:
                event = self.output_queue.get(timeout=0.1)
                if event.get('type') == 'output':
                    outputs.append(event['data']['seq'])
            except queue.Empty:
                continue
        
        return outputs
    
    def close(self):
        """Clean up the HT process"""
        self.process.terminate()
        self.process.wait()

def demo_basic_usage():
    """Demonstrate basic HT usage"""
    print("=== Basic HT Demo ===")
    
    ht = HTController()
    
    try:
        # Take initial snapshot
        print("Initial terminal state:")
        snapshot = ht.take_snapshot()
        if snapshot:
            print(snapshot)
            print("-" * 40)
        
        # Run a simple command
        print("Running 'echo Hello World'...")
        ht.send_keys(["echo Hello World"])
        ht.send_keys(["Enter"])
        time.sleep(0.5)
        
        # Take snapshot after command
        snapshot = ht.take_snapshot()
        if snapshot:
            print("After echo command:")
            print(snapshot)
            print("-" * 40)
        
        # Run ls command
        print("Running 'ls -la'...")
        ht.send_keys(["ls -la"])
        ht.send_keys(["Enter"])
        time.sleep(0.5)
        
        snapshot = ht.take_snapshot()
        if snapshot:
            print("After ls command:")
            print(snapshot)
            print("-" * 40)
            
    finally:
        ht.close()

def demo_npm_create_vite():
    """Demonstrate using HT with npm create-vite"""
    print("=== NPM Create Vite Demo ===")
    
    ht = HTController()
    
    try:
        # Navigate to a temp directory
        print("Setting up temp directory...")
        ht.send_keys(["cd /tmp && rm -rf vite-test && mkdir vite-test && cd vite-test"])
        ht.send_keys(["Enter"])
        time.sleep(1)
        
        # Check if npm is available
        print("Checking npm availability...")
        ht.send_keys(["which npm"])
        ht.send_keys(["Enter"])
        time.sleep(1)
        
        snapshot = ht.take_snapshot()
        if snapshot and "npm" not in snapshot:
            print("npm not found. Make sure Node.js is installed.")
            return
        
        # Start npm create-vite
        print("Starting npm create-vite...")
        ht.send_keys(["npm create vite@latest my-app"])
        ht.send_keys(["Enter"])
        time.sleep(3)  # Give npm time to download
        
        # Take snapshot to see prompts
        snapshot = ht.take_snapshot()
        if snapshot:
            print("npm create-vite prompts:")
            print(snapshot)
            print("-" * 40)
        
        # Answer prompts if they appear
        if snapshot and "framework" in snapshot.lower():
            print("Selecting Vanilla framework...")
            # Find and select Vanilla (usually the first option)
            ht.send_keys(["Enter"])  # Select default (Vanilla)
            time.sleep(1)
            
            snapshot = ht.take_snapshot()
            if snapshot:
                print("After framework selection:")
                print(snapshot)
                print("-" * 40)
            
            # Select variant if prompted
            if snapshot and "variant" in snapshot.lower():
                print("Selecting TypeScript variant...")
                ht.send_keys(["Down"])  # Move to TypeScript
                ht.send_keys(["Enter"])
                time.sleep(2)
        
        # Check final result
        print("Checking project creation...")
        ht.send_keys(["ls -la"])
        ht.send_keys(["Enter"])
        time.sleep(1)
        
        snapshot = ht.take_snapshot()
        if snapshot:
            print("Final directory listing:")
            print(snapshot)
            print("-" * 40)
            
        # Check inside the created project
        ht.send_keys(["cd my-app && ls -la"])
        ht.send_keys(["Enter"])
        time.sleep(1)
        
        snapshot = ht.take_snapshot()
        if snapshot:
            print("Inside created project:")
            print(snapshot)
            print("-" * 40)
    
    finally:
        ht.close()

if __name__ == "__main__":
    print("HT (Headless Terminal) Examples")
    print("================================")
    
    demo_basic_usage()
    print("\n" + "="*50 + "\n")
    demo_npm_create_vite()