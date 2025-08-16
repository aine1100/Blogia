@echo off
setlocal

echo ========================================
echo   Cloudflare Tunnel Setup for Backend
echo ========================================
echo.

echo [1/3] Testing cloudflared installation...
cloudflared --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ cloudflared not found in PATH
    echo.
    echo Please make sure cloudflared.exe is installed and in your PATH.
    echo You can:
    echo 1. Restart your command prompt
    echo 2. Or run: set PATH=%PATH%;C:\path\to\cloudflared
    echo 3. Or run cloudflared.exe directly from its folder
    pause
    exit /b 1
)

echo ✓ cloudflared is installed
cloudflared --version

echo.
echo [2/3] Getting your ECS backend IP...
call get-ecs-ip.bat

echo.
echo [3/3] Starting Cloudflare Tunnel...
echo.
echo ========================================
echo   IMPORTANT: Copy the HTTPS URL below!
echo ========================================
echo.
echo The tunnel will show a URL like:
echo https://abc123.trycloudflare.com
echo.
echo Copy that URL and update frontend/vercel-config.js
echo.
echo Press Ctrl+C to stop the tunnel when done.
echo.

REM Get ECS IP for the tunnel
for /f "tokens=*" %%i in ('aws ecs list-tasks --cluster blog-backend-cluster --service-name blog-backend-service --query "taskArns[0]" --output text --region us-east-1') do set TASK_ARN=%%i

if "%TASK_ARN%"=="None" (
    echo ✗ No running ECS tasks found
    echo Make sure your ECS service is running first
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('aws ecs describe-tasks --cluster blog-backend-cluster --tasks %TASK_ARN% --query "tasks[0].attachments[0].details[?name==`networkInterfaceId`].value" --output text --region us-east-1') do set NETWORK_INTERFACE_ID=%%i

for /f "tokens=*" %%i in ('aws ec2 describe-network-interfaces --network-interface-ids %NETWORK_INTERFACE_ID% --query "NetworkInterfaces[0].Association.PublicIp" --output text --region us-east-1') do set PUBLIC_IP=%%i

if "%PUBLIC_IP%"=="None" (
    echo ✗ Could not get ECS public IP
    pause
    exit /b 1
)

echo Starting tunnel for: http://%PUBLIC_IP%:8000
echo.

REM Start the tunnel
cloudflared tunnel --url http://%PUBLIC_IP%:8000