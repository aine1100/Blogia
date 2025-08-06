@echo off
echo 🔄 Fixing imports and restarting containers...

REM Stop containers
echo 🛑 Stopping containers...
docker-compose down

REM Remove backend image to force rebuild
echo 🗑️ Removing backend image...
docker rmi blog-backend 2>nul

REM Rebuild backend only
echo 🔨 Rebuilding backend...
docker-compose build backend

REM Start containers
echo 🚀 Starting containers...
docker-compose up -d

REM Wait for containers to start
echo ⏳ Waiting for containers to start...
timeout /t 20 /nobreak >nul

REM Check status
echo 🔍 Checking status...
docker-compose ps

echo ✅ Done! Check the logs with: docker-compose logs backend