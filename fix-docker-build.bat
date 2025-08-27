@echo off
setlocal

echo ========================================
echo   Fixing Docker Build Issues
echo ========================================
echo.

echo [1/3] Checking Docker build context...

REM Test build with app/Dockerfile.production
echo Testing build with app/Dockerfile.production...
docker build -f app/Dockerfile.production -t test-backend ./app
if %errorlevel% equ 0 (
    echo ✓ app/Dockerfile.production works
    docker rmi test-backend
    goto :build_success
)

echo ✗ app/Dockerfile.production failed, trying root Dockerfile...

REM Test build with root Dockerfile
docker build -f Dockerfile -t test-backend .
if %errorlevel% equ 0 (
    echo ✓ Root Dockerfile works
    docker rmi test-backend
    goto :build_success
)

echo ✗ Both Dockerfiles failed

echo.
echo [2/3] Checking file structure...
echo Checking if requirements.txt exists in app folder:
if exist "app\requirements.txt" (
    echo ✓ app/requirements.txt found
) else (
    echo ✗ app/requirements.txt missing
)

echo Checking if requirements.txt exists in root:
if exist "requirements.txt" (
    echo ✓ requirements.txt found in root
) else (
    echo ✗ requirements.txt missing in root
)

echo.
echo [3/3] Creating fixed Dockerfile...

REM Create a working Dockerfile in root
echo # Fixed Dockerfile for deployment > Dockerfile.fixed
echo FROM python:3.11-slim >> Dockerfile.fixed
echo. >> Dockerfile.fixed
echo WORKDIR /app >> Dockerfile.fixed
echo. >> Dockerfile.fixed
echo # Install system dependencies >> Dockerfile.fixed
echo RUN apt-get update ^&^& apt-get install -y \ >> Dockerfile.fixed
echo     build-essential \ >> Dockerfile.fixed
echo     curl \ >> Dockerfile.fixed
echo     ^&^& rm -rf /var/lib/apt/lists/* >> Dockerfile.fixed
echo. >> Dockerfile.fixed
echo # Copy requirements and install dependencies >> Dockerfile.fixed
echo COPY app/requirements.txt . >> Dockerfile.fixed
echo RUN pip install --no-cache-dir --upgrade pip \ >> Dockerfile.fixed
echo     ^&^& pip install --no-cache-dir -r requirements.txt >> Dockerfile.fixed
echo. >> Dockerfile.fixed
echo # Copy application code >> Dockerfile.fixed
echo COPY app/ . >> Dockerfile.fixed
echo. >> Dockerfile.fixed
echo # Create directory for database >> Dockerfile.fixed
echo RUN mkdir -p /app/data >> Dockerfile.fixed
echo. >> Dockerfile.fixed
echo # Expose port >> Dockerfile.fixed
echo EXPOSE 8000 >> Dockerfile.fixed
echo. >> Dockerfile.fixed
echo # Health check >> Dockerfile.fixed
echo HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \ >> Dockerfile.fixed
echo     CMD curl -f http://localhost:8000/health ^|^| exit 1 >> Dockerfile.fixed
echo. >> Dockerfile.fixed
echo # Run the application >> Dockerfile.fixed
echo CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] >> Dockerfile.fixed

echo ✓ Created Dockerfile.fixed

echo.
echo Testing fixed Dockerfile...
docker build -f Dockerfile.fixed -t test-backend-fixed .
if %errorlevel% equ 0 (
    echo ✓ Fixed Dockerfile works!
    docker rmi test-backend-fixed
    
    echo.
    echo Replacing original Dockerfile...
    copy Dockerfile.fixed Dockerfile
    del Dockerfile.fixed
    
    echo ✓ Dockerfile updated successfully
    goto :build_success
) else (
    echo ✗ Fixed Dockerfile still fails
    del Dockerfile.fixed
    goto :build_failed
)

:build_success
echo.
echo ========================================
echo   Docker Build Fixed! ✓
echo ========================================
echo.
echo You can now run your deployment:
echo deploy-ecs.bat
echo.
goto :end

:build_failed
echo.
echo ========================================
echo   Manual Fix Required
echo ========================================
echo.
echo Please check:
echo 1. app/requirements.txt exists
echo 2. Docker is running
echo 3. No file permission issues
echo.

:end
pause