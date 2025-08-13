@echo off
echo 🚀 Deploying Backend to AWS
echo ==========================

REM Configuration
set AWS_REGION=us-east-1
set ECR_REPOSITORY=blog-backend
set IMAGE_TAG=latest

echo 📋 Deployment Configuration:
echo    Region: %AWS_REGION%
echo    Repository: %ECR_REPOSITORY%
echo    Tag: %IMAGE_TAG%
echo.

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if errorlevel 1 (
    echo ❌ AWS CLI is not installed. Please install it first:
    echo    https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

echo 🔐 Step 1: Configure AWS credentials (if not already done)
echo Run: aws configure
echo Press Enter to continue or Ctrl+C to exit...
pause >nul

echo 🏗️ Step 2: Create ECR repository (if it doesn't exist)
aws ecr describe-repositories --repository-names %ECR_REPOSITORY% --region %AWS_REGION% >nul 2>&1
if errorlevel 1 (
    aws ecr create-repository --repository-name %ECR_REPOSITORY% --region %AWS_REGION%
)

echo 🔑 Step 3: Get ECR login token
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%i
for /f "tokens=*" %%i in ('aws ecr get-login-password --region %AWS_REGION%') do set ECR_TOKEN=%%i
echo %ECR_TOKEN% | docker login --username AWS --password-stdin %ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com

echo 🔨 Step 4: Build Docker image
docker build -f app/Dockerfile.production -t %ECR_REPOSITORY%:%IMAGE_TAG% ./app

echo 🏷️ Step 5: Tag image for ECR
set ECR_URI=%ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%ECR_REPOSITORY%:%IMAGE_TAG%
docker tag %ECR_REPOSITORY%:%IMAGE_TAG% %ECR_URI%

echo 📤 Step 6: Push image to ECR
docker push %ECR_URI%

echo ✅ Image pushed successfully!
echo 📋 ECR Image URI: %ECR_URI%
echo.
echo 🎯 Next Steps:
echo 1. Go to AWS App Runner console: https://console.aws.amazon.com/apprunner/
echo 2. Create a new service
echo 3. Choose 'Container registry' as source
echo 4. Use this image URI: %ECR_URI%
echo 5. Configure environment variables in App Runner
echo.
echo 🌐 Your backend will be available at: https://[app-runner-url].amazonaws.com

pause