@echo off
setlocal

set AWS_REGION=us-east-1
set CLUSTER_NAME=blog-backend-cluster
set SERVICE_NAME=blog-backend-service

echo Cleaning up ECS resources...

REM Stop the service
echo Stopping ECS service...
aws ecs update-service --cluster %CLUSTER_NAME% --service %SERVICE_NAME% --desired-count 0 --region %AWS_REGION%

REM Wait for tasks to stop
echo Waiting for tasks to stop...
timeout /t 30 /nobreak

REM Delete the service
echo Deleting ECS service...
aws ecs delete-service --cluster %CLUSTER_NAME% --service %SERVICE_NAME% --force --region %AWS_REGION%

REM Delete the cluster
echo Deleting ECS cluster...
aws ecs delete-cluster --cluster %CLUSTER_NAME% --region %AWS_REGION%

REM Delete security group (optional)
echo Deleting security group...
for /f "tokens=*" %%i in ('aws ec2 describe-security-groups --filters "Name=group-name,Values=blog-backend-sg" --query "SecurityGroups[0].GroupId" --output text --region %AWS_REGION%') do set SECURITY_GROUP_ID=%%i
if not "%SECURITY_GROUP_ID%"=="None" (
    aws ec2 delete-security-group --group-id %SECURITY_GROUP_ID% --region %AWS_REGION%
)

echo Cleanup completed!
echo Note: ECR repository and CloudWatch logs are preserved.
echo To delete ECR repository:
echo aws ecr delete-repository --repository-name blog-backend --force --region %AWS_REGION%

pause