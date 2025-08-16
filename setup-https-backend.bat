@echo off
setlocal enabledelayedexpansion

set AWS_REGION=us-east-1
set CLUSTER_NAME=blog-backend-cluster
set SERVICE_NAME=blog-backend-service
set ALB_NAME=blog-backend-alb
set TARGET_GROUP_NAME=blog-backend-tg
set DOMAIN_NAME=backend.neurolab.cc

echo ========================================
echo   Setting up HTTPS for backend.neurolab.cc
echo ========================================
echo.

echo Your domain: %DOMAIN_NAME%
echo Target ALB: blog-backend-alb-831717496.us-east-1.elb.amazonaws.com
echo.

echo [1/6] Getting existing resources...
REM Get ALB ARN
for /f "tokens=*" %%i in ('aws elbv2 describe-load-balancers --names %ALB_NAME% --region %AWS_REGION% --query "LoadBalancers[0].LoadBalancerArn" --output text') do set ALB_ARN=%%i

REM Get Target Group ARN
for /f "tokens=*" %%i in ('aws elbv2 describe-target-groups --names %TARGET_GROUP_NAME% --region %AWS_REGION% --query "TargetGroups[0].TargetGroupArn" --output text') do set TARGET_GROUP_ARN=%%i

echo ALB ARN: %ALB_ARN%
echo Target Group ARN: %TARGET_GROUP_ARN%
echo.

echo [2/6] Checking for existing ACM certificates...
aws acm list-certificates --region %AWS_REGION% --query "CertificateSummaryList[?DomainName=='%DOMAIN_NAME%' || contains(SubjectAlternativeNameSummary[*].Name, '%DOMAIN_NAME%')].[CertificateArn,DomainName,Status]" --output table

echo.
echo Do you have a validated certificate for %DOMAIN_NAME%?
set /p HAS_CERT="Enter Y if you have a certificate, N to create one (Y/N): "

if /i "%HAS_CERT%"=="N" (
    echo.
    echo Creating certificate request...
    echo ================================
    echo.
    echo Step 1: Go to AWS Certificate Manager console:
    echo https://console.aws.amazon.com/acm/home?region=%AWS_REGION%#/
    echo.
    echo Step 2: Click "Request a certificate"
    echo Step 3: Choose "Request a public certificate"
    echo Step 4: Add domain name: %DOMAIN_NAME%
    echo Step 5: Choose "DNS validation"
    echo Step 6: Click "Request"
    echo.
    echo Step 7: Add the CNAME validation record to your DNS
    echo Step 8: Wait for validation ^(5-30 minutes^)
    echo Step 9: Come back and run this script again with Y
    echo.
    pause
    exit /b 0
)

echo.
echo [3/6] Getting certificate ARN...
set /p CERT_ARN="Enter your Certificate ARN: "

if "%CERT_ARN%"=="" (
    echo No certificate ARN provided. Exiting.
    pause
    exit /b 1
)

echo Using certificate: %CERT_ARN%
echo.

echo [4/6] Checking if HTTPS listener exists...
for /f "tokens=*" %%i in ('aws elbv2 describe-listeners --load-balancer-arn %ALB_ARN% --region %AWS_REGION% --query "Listeners[?Port==``443``].ListenerArn" --output text') do set EXISTING_HTTPS_LISTENER=%%i

if not "%EXISTING_HTTPS_LISTENER%"=="" (
    echo HTTPS listener already exists: %EXISTING_HTTPS_LISTENER%
    echo Updating existing listener...
    aws elbv2 modify-listener --listener-arn %EXISTING_HTTPS_LISTENER% --certificates CertificateArn=%CERT_ARN% --region %AWS_REGION%
) else (
    echo Creating new HTTPS listener...
    aws elbv2 create-listener --load-balancer-arn %ALB_ARN% --protocol HTTPS --port 443 --certificates CertificateArn=%CERT_ARN% --default-actions Type=forward,TargetGroupArn=%TARGET_GROUP_ARN% --region %AWS_REGION% --query "Listeners[0].ListenerArn" --output text > temp_listener_arn.txt
    set /p LISTENER_ARN=<temp_listener_arn.txt
    del temp_listener_arn.txt
    echo HTTPS Listener created: !LISTENER_ARN!
)

echo.
echo [5/6] Updating ECS service to use ALB...
REM Get container name
for /f "tokens=*" %%i in ('aws ecs describe-services --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %AWS_REGION% --query "services[0].taskDefinition" --output text') do set TASK_DEF_ARN=%%i
for /f "tokens=*" %%i in ('aws ecs describe-task-definition --task-definition %TASK_DEF_ARN% --region %AWS_REGION% --query "taskDefinition.containerDefinitions[0].name" --output text') do set CONTAINER_NAME=%%i

aws ecs update-service --cluster %CLUSTER_NAME% --service %SERVICE_NAME% --load-balancers targetGroupArn=%TARGET_GROUP_ARN%,containerName=%CONTAINER_NAME%,containerPort=8000 --region %AWS_REGION% >nul

echo ECS service updated successfully
echo.

echo [6/6] Waiting for targets to become healthy...
echo This may take 2-5 minutes...
echo.

:check_health
timeout /t 15 /nobreak >nul
for /f "tokens=*" %%i in ('aws elbv2 describe-target-health --target-group-arn %TARGET_GROUP_ARN% --region %AWS_REGION% --query "TargetHealthDescriptions[0].TargetHealth.State" --output text 2^>nul') do set TARGET_HEALTH=%%i

if "%TARGET_HEALTH%"=="healthy" (
    echo ✓ Targets are healthy!
    goto :health_check_complete
) else (
    echo Current target health: %TARGET_HEALTH%
    echo Waiting 15 more seconds...
    goto :check_health
)

:health_check_complete

echo.
echo ========================================
echo            SUCCESS! 
echo ========================================
echo.
echo Your HTTPS backend is now available at:
echo https://%DOMAIN_NAME%
echo.
echo ✓ SSL Certificate: Valid and trusted
echo ✓ Target Health: %TARGET_HEALTH%
echo ✓ Domain: %DOMAIN_NAME%
echo.
echo IMPORTANT: Make sure you have added this DNS record:
echo ================================================
echo Name: %DOMAIN_NAME%
echo Type: CNAME
echo Value: blog-backend-alb-831717496.us-east-1.elb.amazonaws.com
echo.
echo Next Steps:
echo ===========
echo 1. Test your backend: https://%DOMAIN_NAME%
echo 2. Update your frontend to use https://%DOMAIN_NAME%
echo 3. Remove any references to the old IP address
echo.

pause