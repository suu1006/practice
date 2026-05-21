#!/bin/sh

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

cleanup() {
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup INT TERM EXIT

echo "Starting backend: http://localhost:8080/api"
(
  cd "$ROOT_DIR/backend"
  ./gradlew bootRun --console=plain
) &
BACKEND_PID=$!

echo "Starting frontend: http://localhost:$FRONTEND_PORT"
(
  cd "$ROOT_DIR/frontend"
  npm run dev -- -p "$FRONTEND_PORT"
) &
FRONTEND_PID=$!

while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$FRONTEND_PID" 2>/dev/null; do
  sleep 1
done

wait "$BACKEND_PID" 2>/dev/null || true
wait "$FRONTEND_PID" 2>/dev/null || true
