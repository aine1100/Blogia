#!/bin/bash

echo "Starting Blog Application in Development Mode..."

# Change to project root directory
cd "$(dirname "$0")"

# Activate virtual environment if it exists
if [ -f "app/.venv/bin/activate" ]; then
    echo "Activating virtual environment..."
    source app/.venv/bin/activate
fi

# Install dependencies if needed
echo "Installing/updating dependencies..."
pip install -r app/requirements.txt

# Run the application
echo "Starting FastAPI server..."
python run_local.py