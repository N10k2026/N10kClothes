#!/bin/bash
# N10K Dev Server Watchdog - keeps the server alive
# If the server dies, it restarts it automatically

LOG="/home/z/my-project/dev-watchdog.log"
cd /home/z/my-project

echo "[$(date)] Watchdog started" >> "$LOG"

while true; do
  # Check if next-server is running
  if ! pgrep -f "next-server" > /dev/null 2>&1; then
    echo "[$(date)] Server not found, starting..." >> "$LOG"
    pkill -9 -f "next dev" 2>/dev/null
    sleep 1
    
    # Start server with detached process
    node -e "
      const { spawn } = require('child_process');
      const fs = require('fs');
      const child = spawn('npx', ['next', 'dev', '-p', '3000', '--webpack'], {
        cwd: '/home/z/my-project',
        detached: true,
        stdio: ['ignore', fs.openSync('/tmp/n10k-out.log', 'w'), fs.openSync('/tmp/n10k-err.log', 'w')]
      });
      child.unref();
    " 2>/dev/null
    
    # Wait for server to be ready
    for i in $(seq 1 30); do
      sleep 1
      if curl -s -o /dev/null http://localhost:3000/ 2>/dev/null; then
        echo "[$(date)] Server started and responding!" >> "$LOG"
        break
      fi
    done
  fi
  
  # Check every 5 seconds
  sleep 5
done
