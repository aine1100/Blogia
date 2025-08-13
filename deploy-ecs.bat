@echo off
setlocal enabledelayedexpansion

REM Configuration
set AWS_REGION=us-east-1
set CLUSTER_NAME=blog-backend-cluster
set SERVICE_NAME=blog-backend-service
set TASK_DEFINITION_NAME=blog-backend-task
set BACKEND_REPO_NAME=blog-backend

REM Get AWS account ID
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%i

if "%ACCOUNT_ID%"=="" (
    echo Error: Unable to get AWS account ID. Make sure AWS CLI is configured.
    exit /b 1
)

echo Using AWS Account ID: %ACCOUNT_ID%
echo Using Region: %AWS_REGION%

REM Create ECR repository if it doesn't exist
echo Creating ECR repository...
aws ecr create-repository --repository-name %BACKEND_REPO_NAME% --region %AWS_REGION% 2>nul || echo Backend repository already exists

REM Get ECR login token
echo Logging into ECR...
for /f "tokens=*" %%i in ('aws ecr get-login-password --region %AWS_REGION%') do docker login --username AWS --password-stdin %ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com < echo %%i

REM Build and push backend image
echo Building and pushing backend image...
docker build -f app/Dockerfile.production -t %BACKEND_REPO_NAME% ./app
docker tag %BACKEND_REPO_NAME%:latest %ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%BACKEND_REPO_NAME%:latest
docker push %ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%BACKEND_REPO_NAME%:latest

REM Create CloudWatch log group
echo Creating CloudWatch log group...
aws logs create-log-group --log-group-name "/ecs/blog-backend" --region %AWS_REGION% 2>nul || echo Log group already exists

REM Create ECS cluster
echo Creating ECS cluster...
aws ecs create-cluster --cluster-name %CLUSTER_NAME% --region %AWS_REGION% 2>nul || echo Cluster already exists

REM Create IAM roles if they don't exist
echo Creating IAM roles...
call create-ecs-roles.bat

REM Update task definition with actual values
echo Updating task definition...
powershell -Command "(Get-Content ecs-task-definition.json) -replace '{ACCOUNT_ID}', '%ACCOUNT_ID%' -replace '{REGION}', '%AWS_REGION%' | Set-Content ecs-task-definition-updated.json"

REM Register task definition
echo Registering task definition...
aws ecs register-task-definition --cli-input-json file://ecs-task-definition-updated.json --region %AWS_REGION%

REM Check if service exists
aws ecs describe-services --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %AWS_REGION% --query "services[0].serviceName" --output text >nul 2>&1
if %errorlevel% equ 0 (
    echo Updating existing service...
    aws ecs update-service --cluster %CLUSTER_NAME% --service %SERVICE_NAME% --task-definition %TASK_DEFINITION_NAME% --region %AWS_REGION%
) else (
    echo Creating new service...
    
    REM Get default VPC and subnets
    for /f "tokens=*" %%i in ('aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query "Vpcs[0].VpcId" --output text --region %AWS_REGION%') do set VPC_ID=%%i
    for /f "tokens=*" %%i in ('aws ec2 describe-subnets --filters "Name=vpc-id,Values=%VPC_ID%" --query "Subnets[*].SubnetId" --output text --region %AWS_REGION%') do set SUBNET_IDS=%%i
    set SUBNET_ARRAY=%SUBNET_IDS: =,%
    
    REM Create security group
    aws ec2 create-security-group --group-name blog-backend-sg --description "Security group for blog backend" --vpc-id %VPC_ID% --region %AWS_REGION% --query "GroupId" --output text >temp_sg.txt 2>nul
    if %errorlevel% neq 0 (
        aws ec2 describe-security-groups --filters "Name=group-name,Values=blog-backend-sg" --query "SecurityGroups[0].GroupId" --output text --region %AWS_REGION% >temp_sg.txt
    )
    set /p SECURITY_GROUP_ID=<temp_sg.txt
    del temp_sg.txt
    
    REM Add inbound rules
    aws ec2 authorize-security-group-ingress --group-id %SECURITY_GROUP_ID% --protocol tcp --port 8000 --cidr 0.0.0.0/0 --region %AWS_REGION% 2>nul || echo Port 8000 rule already exists
    
    aws ecs create-service --cluster %CLUSTER_NAME% --service-name %SERVICE_NAME% --task-definition %TASK_DEFINITION_NAME% --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[%SUBNET_ARRAY%],securityGroups=[%SECURITY_GROUP_ID%],assignPublicIp=ENABLED}" --region %AWS_REGION%
)

echo Deployment completed!
echo Your application will be available shortly.
echo To get the public IP, check the ECS console or use AWS CLI commands.

REM Clean up temporary file
del ecs-task-definition-updated.json 2>nul

pause