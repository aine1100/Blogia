@echo off
setlocal

set AWS_REGION=us-east-1
set CLUSTER_NAME=blog-backend-cluster
set SERVICE_NAME=blog-backend-service

echo ========================================
echo   Restarting ECS Service
echo ========================================
echo.

echo Forcing new deployment...
aws ecs update-service --cluster %CLUSTER_NAME% --service %SERVICE_NAME% --force-new-deployment --region %AWS_REGION%

echo.
echo Waiting for service to stabilize...
echo This may take 2-3 minutes...
echo.

aws ecs wait services-stable --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %AWS_REGION%

echo.
echo Service restart completed!
echo Run check-ecs-status.bat to verify the status.

pause