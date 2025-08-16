@echo off
setlocal

echo ========================================
echo   Manual Cloudflare Tunnel
echo ========================================
echo.

set CLOUDFLARED_PATH=C:\Users\user\Downloads\cloudflared-windows-amd64.exe

echo [1/2] Getting your ECS IP...
for /f "tokens=*" %%i in ('aws ecs list-tasks --cluster blog-backend-cluster --service-name blog-backend-service --query "taskArns[0]" --output text --region us-east-1') do set TASK_ARN=%%i

if "%TASK_ARN%"=="None" (
    echo ✗ No running ECS tasks found
    echo Make sure your ECS service is running first
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('aws ecs describe-tasks --cluster blog-backend-cluster --tasks %TASK_ARN% --query "tasks[0].attachments[0].details[?name==`networkInterfaceId`].value" --output text --region us-east-1') do set NETWORK_INTERFACE_ID=%%i

for /f "tokens=*" %%i in ('aws ec2 describe-network-interfaces --network-interface-ids %NETWORK_INTERFACE_ID% --query "NetworkInterfaces[0].Association.PublicIp" --output text --region us-east-1') do set ECS_IP=%%i

echo ✓ ECS IP: %ECS_IP%

echo.
echo [2/2] Starting tunnel...
echo.
echo ========================================
echo   COPY THE HTTPS URL THAT APPEARS BELOW
echo ========================================
echo.
echo Starting tunnel for: http://%ECS_IP%:8000
echo.

"%CLOUDFLARED_PATH%" tunnel --url http://%ECS_IP%:8000