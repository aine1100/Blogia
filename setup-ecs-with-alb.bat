@echo off
setlocal

set AWS_REGION=us-east-1
set CLUSTER_NAME=blog-backend-cluster
set SERVICE_NAME=blog-backend-service

echo ========================================
echo   Updating ECS Service to use ALB
echo ========================================
echo.

echo [1/3] Getting ALB target group ARN...
for /f "tokens=*" %%i in ('aws elbv2 describe-target-groups --names blog-backend-tg --region %AWS_REGION% --query "TargetGroups[0].TargetGroupArn" --output text') do set TARGET_GROUP_ARN=%%i

if "%TARGET_GROUP_ARN%"=="None" (
    echo Error: Target group 'blog-backend-tg' not found
    echo Run setup-https-backend.bat first
    pause
    exit /b 1
)

echo Target Group ARN: %TARGET_GROUP_ARN%

echo.
echo [2/3] Updating ECS service to use load balancer...
aws ecs update-service --cluster %CLUSTER_NAME% --service %SERVICE_NAME% --load-balancers targetGroupArn=%TARGET_GROUP_ARN%,containerName=backend,containerPort=8000 --region %AWS_REGION%

echo.
echo [3/3] Waiting for service to stabilize...
aws ecs wait services-stable --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %AWS_REGION%

echo.
echo Service updated successfully!
echo Your backend is now accessible through the Application Load Balancer.

REM Get ALB DNS name
for /f "tokens=*" %%i in ('aws elbv2 describe-load-balancers --names blog-backend-alb --region %AWS_REGION% --query "LoadBalancers[0].DNSName" --output text') do set ALB_DNS=%%i

echo.
echo ========================================
echo   Your Backend URLs:
echo ========================================
echo HTTP (redirects to HTTPS): http://%ALB_DNS%
echo HTTPS (after SSL setup): https://%ALB_DNS%
echo.
echo Update your frontend vercel-config.js with:
echo BACKEND_URL: 'https://%ALB_DNS%'
echo.

pause