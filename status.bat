@echo off
echo 🔍 Blog Application Status Check
echo ================================

echo.
echo 📊 Docker Compose Services:
docker-compose ps

echo.
echo 🐳 Docker Containers:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo 🌐 Port Status:
echo Checking port 80 (Frontend)...
curl -s -o nul -w "%%{http_code}" http://localhost:80 > temp_status.txt 2>nul
set /p status=<temp_status.txt
if "%status%"=="200" (
    echo ✅ Port 80 is accessible
) else if "%status%"=="404" (
    echo ✅ Port 80 is accessible (404 is normal for root)
) else (
    echo ❌ Port 80 is not accessible
)
del temp_status.txt 2>nul

echo Checking port 8000 (Backend)...
curl -s -o nul -w "%%{http_code}" http://localhost:8000/health > temp_status.txt 2>nul
set /p status=<temp_status.txt
if "%status%"=="200" (
    echo ✅ Port 8000 is accessible
) else (
    echo ❌ Port 8000 is not accessible
)
del temp_status.txt 2>nul

echo.
echo 📋 Service URLs:
echo    Frontend: http://localhost
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs

echo.
echo 📊 System Port Usage:
netstat -an | findstr :80
netstat -an | findstr :8000