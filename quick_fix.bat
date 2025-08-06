@echo off
echo 🔧 Quick fix: Adding email-validator and rebuilding...

REM Stop backend container
echo 🛑 Stopping backend...
docker-compose stop backend

REM Remove backend image
echo 🗑️ Removing backend image...
docker rmi blog-backend 2>nul

REM Rebuild backend with new requirements
echo 🔨 Rebuilding backend with email-validator...
docker-compose build --no-cache backend

REM Start backend
echo 🚀 Starting backend...
docker-compose up -d backend

REM Wait and check
echo ⏳ Waiting for backend to start...
timeout /t 15 /nobreak >nul

echo 🔍 Checking backend status...
docker-compose ps backend

echo 📊 Backend logs:
docker-compose logs --tail=10 backend

echo ✅ Done! Backend should now be working.