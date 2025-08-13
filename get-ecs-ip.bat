@echo off
setlocal

set AWS_REGION=us-east-1
set CLUSTER_NAME=blog-backend-cluster
set SERVICE_NAME=blog-backend-service

echo Getting public IP for ECS service...

REM Get the task ARN
for /f "tokens=*" %%i in ('aws ecs list-tasks --cluster %CLUSTER_NAME% --service-name %SERVICE_NAME% --query "taskArns[0]" --output text --region %AWS_REGION%') do set TASK_ARN=%%i

if "%TASK_ARN%"=="None" (
    echo No running tasks found for service %SERVICE_NAME%
    exit /b 1
)

echo Task ARN: %TASK_ARN%

REM Get the network interface ID
for /f "tokens=*" %%i in ('aws ecs describe-tasks --cluster %CLUSTER_NAME% --tasks %TASK_ARN% --query "tasks[0].attachments[0].details[?name==`networkInterfaceId`].value" --output text --region %AWS_REGION%') do set NETWORK_INTERFACE_ID=%%i

if "%NETWORK_INTERFACE_ID%"=="" (
    echo Could not find network interface ID
    exit /b 1
)

echo Network Interface ID: %NETWORK_INTERFACE_ID%

REM Get the public IP
for /f "tokens=*" %%i in ('aws ec2 describe-network-interfaces --network-interface-ids %NETWORK_INTERFACE_ID% --query "NetworkInterfaces[0].Association.PublicIp" --output text --region %AWS_REGION%') do set PUBLIC_IP=%%i

if "%PUBLIC_IP%"=="None" (
    echo No public IP assigned to the task
    exit /b 1
)

echo Public IP: %PUBLIC_IP%
echo Backend API URL: http://%PUBLIC_IP%:8000
echo API Documentation: http://%PUBLIC_IP%:8000/docs
echo Health Check: http://%PUBLIC_IP%:8000/health

pause