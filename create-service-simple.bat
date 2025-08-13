@echo off
echo 🚀 Creating AWS App Runner Service
echo =================================

REM Create the JSON configuration file directly
echo Creating service configuration...

echo {> apprunner-service.json
echo   "ServiceName": "blog-backend",>> apprunner-service.json
echo   "SourceConfiguration": {>> apprunner-service.json
echo     "ImageRepository": {>> apprunner-service.json
echo       "ImageIdentifier": "644802182209.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest",>> apprunner-service.json
echo       "ImageConfiguration": {>> apprunner-service.json
echo         "Port": "8000",>> apprunner-service.json
echo         "RuntimeEnvironmentVariables": {>> apprunner-service.json
echo           "SECRET_KEY": "your-super-secret-production-key-12345",>> apprunner-service.json
echo           "DATABASE_URL": "sqlite:///./data/blog.db",>> apprunner-service.json
echo           "ALGORITHM": "HS256",>> apprunner-service.json
echo           "ACCESS_TOKEN_EXPIRE_MINUTES": "30",>> apprunner-service.json
echo           "ENVIRONMENT": "production">> apprunner-service.json
echo         }>> apprunner-service.json
echo       },>> apprunner-service.json
echo       "ImageRepositoryType": "ECR">> apprunner-service.json
echo     },>> apprunner-service.json
echo     "AutoDeploymentsEnabled": false>> apprunner-service.json
echo   },>> apprunner-service.json
echo   "InstanceConfiguration": {>> apprunner-service.json
echo     "Cpu": "0.25 vCPU",>> apprunner-service.json
echo     "Memory": "0.5 GB">> apprunner-service.json
echo   },>> apprunner-service.json
echo   "HealthCheckConfiguration": {>> apprunner-service.json
echo     "Protocol": "HTTP",>> apprunner-service.json
echo     "Path": "/health",>> apprunner-service.json
echo     "Interval": 10,>> apprunner-service.json
echo     "Timeout": 5,>> apprunner-service.json
echo     "HealthyThreshold": 1,>> apprunner-service.json
echo     "UnhealthyThreshold": 5>> apprunner-service.json
echo   }>> apprunner-service.json
echo }>> apprunner-service.json

echo ✅ Configuration file created!
echo 📄 Contents of apprunner-service.json:
type apprunner-service.json
echo.

echo 🚀 Creating App Runner service...
aws apprunner create-service --cli-input-json file://apprunner-service.json --region us-east-1

if errorlevel 1 (
    echo ❌ Service creation failed. Try creating manually:
    echo 1. Go to: https://console.aws.amazon.com/apprunner/
    echo 2. Click "Create service"
    echo 3. Use ECR image: 644802182209.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest
    echo 4. Set port to 8000
    echo 5. Add environment variables from the JSON above
) else (
    echo ✅ Service created successfully!
    echo ⏳ Service is deploying... This takes 5-10 minutes.
    echo 📱 Check status at: https://console.aws.amazon.com/apprunner/
)

echo.
echo Press any key to exit...
pause >nul