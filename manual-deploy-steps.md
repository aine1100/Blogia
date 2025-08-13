# Manual AWS App Runner Deployment Steps

Since the automated script had issues, here are the exact manual steps:

## Step 1: Create the Service Configuration File

Create a file called `service-config.json`:

```json
{
  "ServiceName": "blog-backend",
  "SourceConfiguration": {
    "ImageRepository": {
      "ImageIdentifier": "644802182209.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest",
      "ImageConfiguration": {
        "Port": "8000",
        "RuntimeEnvironmentVariables": {
          "SECRET_KEY": "your-super-secret-production-key-12345",
          "DATABASE_URL": "sqlite:///./data/blog.db",
          "ALGORITHM": "HS256",
          "ACCESS_TOKEN_EXPIRE_MINUTES": "30",
          "ENVIRONMENT": "production"
        }
      },
      "ImageRepositoryType": "ECR"
    },
    "AutoDeploymentsEnabled": false
  },
  "InstanceConfiguration": {
    "Cpu": "0.25 vCPU",
    "Memory": "0.5 GB"
  },
  "HealthCheckConfiguration": {
    "Protocol": "HTTP",
    "Path": "/health",
    "Interval": 10,
    "Timeout": 5,
    "HealthyThreshold": 1,
    "UnhealthyThreshold": 5
  }
}
```

## Step 2: Create the Service

```bash
aws apprunner create-service --cli-input-json file://service-config.json --region us-east-1
```

## Step 3: Check Service Status

```bash
# Get your service ARN from the previous command output, then:
aws apprunner describe-service --service-arn "arn:aws:apprunner:us-east-1:644802182209:service/blog-backend/SERVICE_ID" --region us-east-1
```

## Alternative: Use AWS Console (Easier)

1. Go to: https://console.aws.amazon.com/apprunner/
2. Click "Create service"
3. Choose "Container registry" → "Amazon ECR"
4. Enter image URI: `644802182209.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest`
5. Service settings:
   - Service name: `blog-backend`
   - Port: `8000`
6. Environment variables:
   ```
   SECRET_KEY = your-super-secret-production-key-12345
   DATABASE_URL = sqlite:///./data/blog.db
   ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 30
   ENVIRONMENT = production
   ```
7. Click "Create & deploy"

## Expected Result

Your backend will be available at: `https://[random-id].us-east-1.awsapprunner.com`

Test it with: `curl https://your-url.amazonaws.com/health`