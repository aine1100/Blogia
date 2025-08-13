@echo off
setlocal

set AWS_REGION=us-east-1
set CLUSTER_NAME=blog-backend-cluster
set SERVICE_NAME=blog-backend-service

echo ========================================
echo   Waiting for ECS Service to Stabilize
echo ========================================
echo.

echo Waiting for service to become stable...
echo This typically takes 2-3 minutes.
echo.

aws ecs wait services-stable --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %AWS_REGION%

if %errorlevel% equ 0 (
    echo ✓ Service is now stable!
    echo.
    echo Running status check...
    call check-ecs-status.bat
) else (
    echo ✗ Service did not stabilize within timeout
    echo Run diagnose-ecs.bat for more details
)

pause