@echo off
setlocal

set AWS_REGION=us-east-1
set CLUSTER_NAME=blog-backend-cluster
set SERVICE_NAME=blog-backend-service

echo ========================================
echo   Fixing ECS CloudWatch Logs Issue
echo ========================================
echo.

echo [1/3] Creating missing CloudWatch log group...
aws logs create-log-group --log-group-name "/ecs/blog-backend" --region %AWS_REGION%
if %errorlevel% equ 0 (
    echo ✓ Log group created successfully
) else (
    echo ✓ Log group already exists or created
)

echo.
echo [2/3] Setting log retention (optional - saves costs)...
aws logs put-retention-policy --log-group-name "/ecs/blog-backend" --retention-in-days 7 --region %AWS_REGION%
echo ✓ Log retention set to 7 days

echo.
echo [3/3] Forcing service restart to pick up changes...
aws ecs update-service --cluster %CLUSTER_NAME% --service %SERVICE_NAME% --force-new-deployment --region %AWS_REGION%
echo ✓ Service restart initiated

echo.
echo ========================================
echo   Fix Applied Successfully!
echo ========================================
echo.
echo The service is now restarting with proper logging.
echo This may take 2-3 minutes to complete.
echo.
echo Run check-ecs-status.bat in a few minutes to verify.
echo.

pause