@echo off
setlocal enabledelayedexpansion

set AWS_REGION=us-east-1
set CLUSTER_NAME=blog-backend-cluster
set SERVICE_NAME=blog-backend-service

echo ========================================
echo   ECS Backend Service Status Check
echo ========================================
echo.

REM Check if cluster exists
echo [1/5] Checking ECS cluster...
aws ecs describe-clusters --clusters %CLUSTER_NAME% --region %AWS_REGION% --query "clusters[0].status" --output text >temp_cluster.txt 2>nul
set /p CLUSTER_STATUS=<temp_cluster.txt
del temp_cluster.txt 2>nul

if "%CLUSTER_STATUS%"=="ACTIVE" (
    echo ✓ Cluster '%CLUSTER_NAME%' is ACTIVE
) else (
    echo ✗ Cluster '%CLUSTER_NAME%' not found or inactive
    echo   Run deploy-ecs.bat to create the cluster
    goto :end
)

echo.

REM Check service status
echo [2/5] Checking ECS service...
aws ecs describe-services --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %AWS_REGION% --query "services[0].status" --output text >temp_service.txt 2>nul
set /p SERVICE_STATUS=<temp_service.txt
del temp_service.txt 2>nul

if "%SERVICE_STATUS%"=="ACTIVE" (
    echo ✓ Service '%SERVICE_NAME%' is ACTIVE
    
    REM Get desired vs running count
    for /f "tokens=*" %%i in ('aws ecs describe-services --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %AWS_REGION% --query "services[0].desiredCount" --output text') do set DESIRED_COUNT=%%i
    for /f "tokens=*" %%i in ('aws ecs describe-services --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %AWS_REGION% --query "services[0].runningCount" --output text') do set RUNNING_COUNT=%%i
    
    echo   Desired tasks: %DESIRED_COUNT%
    echo   Running tasks: %RUNNING_COUNT%
) else (
    echo ✗ Service '%SERVICE_NAME%' not found or inactive
    echo   Run deploy-ecs.bat to create the service
    goto :end
)

echo.

REM Check task status
echo [3/5] Checking running tasks...
for /f "tokens=*" %%i in ('aws ecs list-tasks --cluster %CLUSTER_NAME% --service-name %SERVICE_NAME% --region %AWS_REGION% --query "taskArns[0]" --output text') do set TASK_ARN=%%i

if "%TASK_ARN%"=="None" (
    echo ✗ No running tasks found
    echo   Service may be starting up or failed to start
    goto :end
) else (
    echo ✓ Found running task
    
    REM Get task status
    for /f "tokens=*" %%i in ('aws ecs describe-tasks --cluster %CLUSTER_NAME% --tasks %TASK_ARN% --region %AWS_REGION% --query "tasks[0].lastStatus" --output text') do set TASK_STATUS=%%i
    echo   Task status: %TASK_STATUS%
)

echo.

REM Get public IP
echo [4/5] Getting public IP address...
for /f "tokens=*" %%i in ('aws ecs describe-tasks --cluster %CLUSTER_NAME% --tasks %TASK_ARN% --query "tasks[0].attachments[0].details[?name==`networkInterfaceId`].value" --output text --region %AWS_REGION%') do set NETWORK_INTERFACE_ID=%%i

if "%NETWORK_INTERFACE_ID%"=="" (
    echo ✗ Could not find network interface
) else (
    for /f "tokens=*" %%i in ('aws ec2 describe-network-interfaces --network-interface-ids %NETWORK_INTERFACE_ID% --query "NetworkInterfaces[0].Association.PublicIp" --output text --region %AWS_REGION%') do set PUBLIC_IP=%%i
    
    if "%PUBLIC_IP%"=="None" (
        echo ✗ No public IP assigned
    ) else (
        echo ✓ Public IP: %PUBLIC_IP%
    )
)

echo.

REM Test API connectivity
echo [5/5] Testing API connectivity...
if not "%PUBLIC_IP%"=="" if not "%PUBLIC_IP%"=="None" (
    echo Testing health endpoint...
    curl -s -o nul -w "HTTP Status: %%{http_code}" http://%PUBLIC_IP%:8000/health
    echo.
    echo.
    echo ========================================
    echo   Your Backend API URLs:
    echo ========================================
    echo   API Base URL: http://%PUBLIC_IP%:8000
    echo   API Documentation: http://%PUBLIC_IP%:8000/docs
    echo   Health Check: http://%PUBLIC_IP%:8000/health
    echo   Interactive API: http://%PUBLIC_IP%:8000/redoc
    echo ========================================
) else (
    echo ✗ Cannot test API - no public IP available
)

echo.

REM Show recent logs
echo Recent logs (last 10 lines):
echo ----------------------------------------
aws logs describe-log-streams --log-group-name "/ecs/blog-backend" --order-by LastEventTime --descending --max-items 1 --region %AWS_REGION% --query "logStreams[0].logStreamName" --output text >temp_stream.txt 2>nul
set /p LOG_STREAM=<temp_stream.txt
del temp_stream.txt 2>nul

if not "%LOG_STREAM%"=="" if not "%LOG_STREAM%"=="None" (
    aws logs get-log-events --log-group-name "/ecs/blog-backend" --log-stream-name "%LOG_STREAM%" --region %AWS_REGION% --query "events[-10:].message" --output text
) else (
    echo No recent logs found
)

:end
echo.
echo Status check completed!
pause