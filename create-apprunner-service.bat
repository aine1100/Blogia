@echo off
echo 🚀 Creating AWS App Runner Service via CLI
echo ==========================================

REM Configuration
set SERVICE_NAME=blog-backend
set ECR_IMAGE_URI=644802182209.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest
set AWS_REGION=us-east-1

echo 📋 Service Configuration:
echo    Service Name: %SERVICE_NAME%
echo    Image URI: %ECR_IMAGE_URI%
echo    Region: %AWS_REGION%
echo.

echo 🔐 Step 1: Create IAM role for App Runner (if not exists)
aws iam get-role --role-name AppRunnerECRAccessRole >nul 2>&1
if errorlevel 1 (
    echo Creating IAM role for App Runner...
    aws iam create-role --role-name AppRunnerECRAccessRole --assume-role-policy-document "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"build.apprunner.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}"
    aws iam attach-role-policy --role-name AppRunnerECRAccessRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess
    echo Waiting for role to be ready...
    timeout /t 10 /nobreak >nul
)

echo 🏗️ Step 2: Create App Runner service configuration
echo Creating service configuration file...

(
echo {
echo   "ServiceName": "%SERVICE_NAME%",
echo   "SourceConfiguration": {
echo     "ImageRepository": {
echo       "ImageIdentifier": "%ECR_IMAGE_URI%",
echo       "ImageConfiguration": {
echo         "Port": "8000",
echo         "RuntimeEnvironmentVariables": {
echo           "SECRET_KEY": "your-super-secret-production-key-change-this-now",
echo           "DATABASE_URL": "sqlite:///./data/blog.db",
echo           "ALGORITHM": "HS256",
echo           "ACCESS_TOKEN_EXPIRE_MINUTES": "30",
echo           "ENVIRONMENT": "production"
echo         }
echo       },
echo       "ImageRepositoryType": "ECR"
echo     },
echo     "AutoDeploymentsEnabled": false
echo   },
echo   "InstanceConfiguration": {
echo     "Cpu": "0.25 vCPU",
echo     "Memory": "0.5 GB"
echo   },
echo   "HealthCheckConfiguration": {
echo     "Protocol": "HTTP",
echo     "Path": "/health",
echo     "Interval": 10,
echo     "Timeout": 5,
echo     "HealthyThreshold": 1,
echo     "UnhealthyThreshold": 5
echo   }
echo }
) > apprunner-config.json

echo 🚀 Step 3: Create App Runner service
echo Creating the service... (this may take a few minutes)
aws apprunner create-service --cli-input-json file://apprunner-config.json --region %AWS_REGION% > service-output.json

if errorlevel 1 (
    echo ❌ Failed to create service. Check the error above.
    echo 💡 You may need to create the service manually in the AWS Console.
    pause
    exit /b 1
)

echo ✅ Service creation initiated!

REM Extract service ARN and URL from output
for /f "tokens=*" %%i in ('type service-output.json ^| findstr "ServiceArn"') do set SERVICE_ARN_LINE=%%i
for /f "tokens=*" %%i in ('type service-output.json ^| findstr "ServiceUrl"') do set SERVICE_URL_LINE=%%i

echo 📋 Service Details:
type service-output.json
echo.

echo ⏳ Step 4: Wait for service to be ready
echo This may take 5-10 minutes. Checking status...

:CHECK_STATUS
timeout /t 30 /nobreak >nul
aws apprunner describe-service --service-arn "%SERVICE_ARN%" --region %AWS_REGION% --query "Service.Status" --output text > status.txt 2>nul
set /p SERVICE_STATUS=<status.txt

echo Current status: %SERVICE_STATUS%

if "%SERVICE_STATUS%"=="RUNNING" (
    goto SERVICE_READY
) else if "%SERVICE_STATUS%"=="CREATE_FAILED" (
    echo ❌ Service creation failed!
    aws apprunner describe-service --service-arn "%SERVICE_ARN%" --region %AWS_REGION%
    goto END
) else (
    echo Still deploying... checking again in 30 seconds
    goto CHECK_STATUS
)

:SERVICE_READY
echo ✅ Service is now RUNNING!

REM Get the service URL
aws apprunner describe-service --service-arn "%SERVICE_ARN%" --region %AWS_REGION% --query "Service.ServiceUrl" --output text > service-url.txt
set /p SERVICE_URL=<service-url.txt

echo 🎉 Deployment Complete!
echo ========================
echo 🌐 Your backend is now live at: %SERVICE_URL%
echo 📊 Health check: %SERVICE_URL%/health
echo 📖 API docs: %SERVICE_URL%/docs
echo.
echo 🔧 Next Steps:
echo 1. Test your API: curl %SERVICE_URL%/health
echo 2. Update your frontend to use: %SERVICE_URL%
echo 3. Test the full application
echo.
echo 📱 AWS Console Links:
echo - App Runner: https://console.aws.amazon.com/apprunner/
echo - CloudWatch Logs: https://console.aws.amazon.com/cloudwatch/
echo.

REM Clean up temporary files
del apprunner-config.json 2>nul
del service-output.json 2>nul
del status.txt 2>nul
del service-url.txt 2>nul

:END
echo Press any key to exit...
pause >nul