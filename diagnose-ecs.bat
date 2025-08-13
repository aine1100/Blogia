@echo off
setlocal enabledelayedexpansion

set AWS_REGION=us-east-1
set CLUSTER_NAME=blog-backend-cluster
set SERVICE_NAME=blog-backend-service

echo ========================================
echo   ECS Troubleshooting Diagnostics
echo ========================================
echo.

echo [1] Checking service events...
echo ----------------------------------------
aws ecs describe-services --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %AWS_REGION% --query "services[0].events[:5].[createdAt,message]" --output table

echo.
echo [2] Checking stopped tasks (recent failures)...
echo ----------------------------------------
for /f "tokens=*" %%i in ('aws ecs list-tasks --cluster %CLUSTER_NAME% --desired-status STOPPED --max-items 3 --region %AWS_REGION% --query "taskArns" --output text') do (
    if not "%%i"=="None" (
        echo Task: %%i
        aws ecs describe-tasks --cluster %CLUSTER_NAME% --tasks %%i --region %AWS_REGION% --query "tasks[0].[lastStatus,stoppedReason,containers[0].exitCode]" --output table
        echo.
    )
)

echo [3] Checking task definition...
echo ----------------------------------------
for /f "tokens=*" %%i in ('aws ecs describe-services --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %AWS_REGION% --query "services[0].taskDefinition" --output text') do set TASK_DEF=%%i
echo Current task definition: %TASK_DEF%

echo.
echo [4] Checking CloudWatch logs...
echo ----------------------------------------
aws logs describe-log-streams --log-group-name "/ecs/blog-backend" --order-by LastEventTime --descending --max-items 3 --region %AWS_REGION% --query "logStreams[*].[logStreamName,lastEventTime]" --output table

echo.
echo [5] Getting recent error logs...
echo ----------------------------------------
for /f "tokens=*" %%i in ('aws logs describe-log-streams --log-group-name "/ecs/blog-backend" --order-by LastEventTime --descending --max-items 1 --region %AWS_REGION% --query "logStreams[0].logStreamName" --output text') do set LOG_STREAM=%%i

if not "%LOG_STREAM%"=="" if not "%LOG_STREAM%"=="None" (
    echo Latest log stream: %LOG_STREAM%
    echo Recent log entries:
    aws logs get-log-events --log-group-name "/ecs/blog-backend" --log-stream-name "%LOG_STREAM%" --region %AWS_REGION% --query "events[-20:].message" --output text
) else (
    echo No log streams found - tasks may not be starting at all
)

echo.
echo [6] Checking security group...
echo ----------------------------------------
for /f "tokens=*" %%i in ('aws ec2 describe-security-groups --filters "Name=group-name,Values=blog-backend-sg" --query "SecurityGroups[0].GroupId" --output text --region %AWS_REGION%') do set SG_ID=%%i
if not "%SG_ID%"=="None" (
    echo Security Group ID: %SG_ID%
    aws ec2 describe-security-groups --group-ids %SG_ID% --region %AWS_REGION% --query "SecurityGroups[0].IpPermissions" --output table
) else (
    echo Security group 'blog-backend-sg' not found
)

echo.
echo [7] Checking ECR repository...
echo ----------------------------------------
aws ecr describe-repositories --repository-names blog-backend --region %AWS_REGION% --query "repositories[0].[repositoryName,repositoryUri]" --output table 2>nul
if %errorlevel% neq 0 (
    echo ECR repository 'blog-backend' not found
)

echo.
echo [8] Suggested fixes:
echo ----------------------------------------
echo 1. Check if Docker image exists and is accessible
echo 2. Verify task definition has correct image URI
echo 3. Check if tasks have enough CPU/memory
echo 4. Review CloudWatch logs for application errors
echo 5. Ensure security groups allow outbound internet access
echo.
echo To restart the service:
echo aws ecs update-service --cluster %CLUSTER_NAME% --service %SERVICE_NAME% --force-new-deployment --region %AWS_REGION%
echo.

pause