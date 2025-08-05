@echo off
echo 🔄 Restarting Blog Application...

REM Stop existing containers
echo 🛑 Stopping existing containers...
docker-compose down

REM Remove old images to force rebuild
echo 🗑️ Removing old images...
docker-compose down --rmi all

REM Rebuild and start
echo 🔨 Rebuilding and starting services...
docker-compose build --no-cache
docker-compose up -d

REM Wait for services
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Check status
echo 🔍 Checking service status...
docker-compose ps

echo ✅ Restart complete!
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs