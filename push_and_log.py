#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir('/workspaces/angular-event-refresh')

with open('GIT_PUSH_LOG.md', 'w') as log:
    log.write("# Git Push Log\n\n")
    
    # Stage all changes
    log.write("## Staging Changes\n")
    result = subprocess.run(['git', 'add', '-A'], capture_output=True, text=True)
    log.write(f"Return code: {result.returncode}\n")
    if result.stderr:
        log.write(f"Stderr: {result.stderr}\n")
    log.write("\n")
    
    # Check status
    log.write("## Git Status\n")
    result = subprocess.run(['git', 'status', '--short'], capture_output=True, text=True)
    log.write(result.stdout)
    log.write("\n")
    
    # Commit
    log.write("## Committing\n")
    result = subprocess.run(['git', 'commit', '-m', 'Session management and dashboard improvements'], 
                           capture_output=True, text=True)
    log.write(f"Return code: {result.returncode}\n")
    log.write(f"Stdout: {result.stdout}\n")
    if result.stderr:
        log.write(f"Stderr: {result.stderr}\n")
    log.write("\n")
    
    # Get recent commits
    log.write("## Recent Commits\n")
    result = subprocess.run(['git', 'log', '--oneline', '-5'], capture_output=True, text=True)
    log.write(result.stdout)
    log.write("\n")
    
    # Get branch info
    log.write("## Branch Info\n")
    result = subprocess.run(['git', 'branch', '-v'], capture_output=True, text=True)
    log.write(result.stdout)
    log.write("\n")
    
    # Push
    log.write("## Pushing to ManusAI\n")
    result = subprocess.run(['git', 'push', 'origin', 'ManusAI', '-v'], capture_output=True, text=True, timeout=30)
    log.write(f"Return code: {result.returncode}\n")
    log.write(f"Stdout:\n{result.stdout}\n")
    if result.stderr:
        log.write(f"Stderr:\n{result.stderr}\n")
    log.write("\n")
    
    log.write("## Done\n")

print("Log written to GIT_PUSH_LOG.md")
