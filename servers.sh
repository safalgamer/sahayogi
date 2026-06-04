#!/bin/bash
source ~/.nvm/nvm.sh
LOG_DIR=~/sahayogi/logs

start_backend() {
  cd ~/sahayogi/backend
  nohup node server.js > $LOG_DIR/backend/server.log 2>&1 &
  echo $! > $LOG_DIR/backend.pid
  echo "Backend PID: $(cat $LOG_DIR/backend.pid)"
}

start_frontend() {
  cd ~/sahayogi/frontend
  nohup node ~/sahayogi/node_modules/serve/build/main.js -s ~/sahayogi/frontend/build -l 3000 > $LOG_DIR/frontend/server.log 2>&1 &
  echo $! > $LOG_DIR/frontend.pid
  echo "Frontend PID: $(cat $LOG_DIR/frontend.pid)"
}

stop_all() {
  pkill -f 'node server.js' 2>/dev/null
  pkill -f 'serve -s build' 2>/dev/null
  echo "Stopped"
}

status() {
  local be=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health 2>/dev/null)
  local fe=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
  echo "Backend: ${be:-000} | Frontend: ${fe:-000}"
}

case "$1" in
  start) stop_all; sleep 1; start_backend; sleep 2; start_frontend; sleep 2; status ;;
  stop) stop_all ;;
  status) status ;;
  *) echo "Usage: $0 {start|stop|status}" ;;
esac
