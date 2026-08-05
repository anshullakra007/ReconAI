#!/bin/bash
cd "/Users/anshullakra/Documents/coding/recon ai /backend"
export PATH="/opt/homebrew/bin:$PATH"

python3 -m venv venv_full
./venv_full/bin/pip install -r requirements.txt aiohttp numpy termcolor

echo "Starting backend..."
./venv_full/bin/python -m uvicorn main:app --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!

echo "Waiting 15 seconds for database generation..."
sleep 15

echo "Running Benchmark:"
./venv_full/bin/python benchmark_suite.py

kill $BACKEND_PID

