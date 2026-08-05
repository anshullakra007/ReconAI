#!/bin/bash
cd /Users/anshullakra/Documents/coding/ion_jd/backend

export PATH="/opt/homebrew/bin:$PATH"

# Run backend using system python that has fastapi
python3 -m uvicorn main:app --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!

echo "Waiting 15 seconds for backend to start and generate DB..."
sleep 15

# Run client using venv_bench that has aiohttp
./venv_bench/bin/python benchmark_suite.py

kill $BACKEND_PID
