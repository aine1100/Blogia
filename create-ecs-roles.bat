@echo off
setlocal

set AWS_REGION=us-east-1

echo Creating ECS Task Execution Role...

REM Create trust policy for ECS tasks
echo { > ecs-task-trust-policy.json
echo   "Version": "2012-10-17", >> ecs-task-trust-policy.json
echo   "Statement": [ >> ecs-task-trust-policy.json
echo     { >> ecs-task-trust-policy.json
echo       "Effect": "Allow", >> ecs-task-trust-policy.json
echo       "Principal": { >> ecs-task-trust-policy.json
echo         "Service": "ecs-tasks.amazonaws.com" >> ecs-task-trust-policy.json
echo       }, >> ecs-task-trust-policy.json
echo       "Action": "sts:AssumeRole" >> ecs-task-trust-policy.json
echo     } >> ecs-task-trust-policy.json
echo   ] >> ecs-task-trust-policy.json
echo } >> ecs-task-trust-policy.json

REM Create the execution role
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://ecs-task-trust-policy.json 2>nul || echo ecsTaskExecutionRole already exists

REM Attach the AWS managed policy for ECS task execution
aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>nul || echo Policy already attached to ecsTaskExecutionRole

REM Create ECS Task Role
echo Creating ECS Task Role...

aws iam create-role --role-name ecsTaskRole --assume-role-policy-document file://ecs-task-trust-policy.json 2>nul || echo ecsTaskRole already exists

REM Create custom policy for task role
echo { > ecs-task-policy.json
echo   "Version": "2012-10-17", >> ecs-task-policy.json
echo   "Statement": [ >> ecs-task-policy.json
echo     { >> ecs-task-policy.json
echo       "Effect": "Allow", >> ecs-task-policy.json
echo       "Action": [ >> ecs-task-policy.json
echo         "logs:CreateLogStream", >> ecs-task-policy.json
echo         "logs:PutLogEvents" >> ecs-task-policy.json
echo       ], >> ecs-task-policy.json
echo       "Resource": "*" >> ecs-task-policy.json
echo     } >> ecs-task-policy.json
echo   ] >> ecs-task-policy.json
echo } >> ecs-task-policy.json

aws iam create-policy --policy-name ecsTaskPolicy --policy-document file://ecs-task-policy.json 2>nul || echo ecsTaskPolicy already exists

REM Get account ID for policy ARN
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%i

aws iam attach-role-policy --role-name ecsTaskRole --policy-arn arn:aws:iam::%ACCOUNT_ID%:policy/ecsTaskPolicy 2>nul || echo Policy already attached to ecsTaskRole

REM Clean up temporary files
del ecs-task-trust-policy.json 2>nul
del ecs-task-policy.json 2>nul

echo IAM roles created successfully!