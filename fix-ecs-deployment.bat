@echo off
setlocal

set AWS_REGION=us-east-1
set CLUSTER_NAME=blog-backend-cluster
set SERVICE_NAME=blog-backend-service

echo Fixing ECS deployment issues...

REM Create the missing log group
echo Creating CloudWatch log group...
aws logs create-log-group --log-group-name "/ecs/blog-backend" --region %AWS_REGION% 2>nul || echo Log group already exists

REM Also create the log group that the error mentions
aws logs create-log-group --log-group-name "/ecs/blog-app" --region %AWS_REGION% 2>nul || echo Log group already exists

REM Stop the current service to restart it
echo Stopping current service...
aws ecs update-service --cluster %CLUSTER_NAME% --service %SERVICE_NAME% --desired-count 0 --region %AWS_REGION%

REM Wait for tasks to stop
echo Waiting for tasks to stop...
timeout /t 30 /nobreak

REM Restart the service
echo Restarting service...
aws ecs update-service --cluster %CLUSTER_NAME% --service %SERVICE_NAME% --desired-count 1 --region %AWS_REGION%

echo Service restarted. Waiting for task to start...
timeout /t 60 /nobreak

REM Check status
echo Checking service status...
aws ecs describe-services --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %AWS_REGION% --query "services[0].{ServiceName:serviceName,Status:status,RunningCount:runningCount,PendingCount:pendingCount,DesiredCount:desiredCount}" --output table

pause