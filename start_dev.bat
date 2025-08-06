@echo off
echo Starting Blog Application in Development Mode...

REM Change to project root directory
cd /d "%~dp0"

REM Activate virtual environment if it exists
if exist "app\.venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call app\.venv\Scripts\activate.bat
)

REM Install dependencies if needed
echo Installing/updating dependencies...
pip install -r app\requirements.txt

REM Run the application
echo Starting FastAPI server...
python run_local.py

pause