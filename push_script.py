#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir('/workspaces/angular-event-refresh')

# Stage all changes
print("Staging changes...")
result = subprocess.run(['git', 'add', '-A'], capture_output=True, text=True)
print(f"Stage result: {result.returncode}")
if result.stderr:
    print(f"Stderr: {result.stderr}")

# Check status
print("\nGit status:")
result = subprocess.run(['git', 'status', '--short'], capture_output=True, text=True)
print(result.stdout)

# Commit
print("\nCommitting...")
result = subprocess.run(['git', 'commit', '-m', 'Session management and dashboard improvements'], 
                       capture_output=True, text=True)
print(f"Commit result: {result.returncode}")
print(f"Stdout: {result.stdout}")
if result.stderr:
    print(f"Stderr: {result.stderr}")

# Get recent commits
print("\nRecent commits:")
result = subprocess.run(['git', 'log', '--oneline', '-3'], capture_output=True, text=True)
print(result.stdout)

# Push
print("\nPushing to ManusAI...")
result = subprocess.run(['git', 'push', 'origin', 'ManusAI', '-v'], capture_output=True, text=True)
print(f"Push result: {result.returncode}")
print(f"Stdout: {result.stdout}")
if result.stderr:
    print(f"Stderr: {result.stderr}")

print("\nDone!")
