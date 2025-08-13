#!/bin/bash

echo "🚀 Creating AWS App Runner Service via CLI"
echo "=========================================="

# Configuration
SERVICE_NAME="blog-backend"
ECR_IMAGE_URI="644802182209.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest"
AWS_REGION="us-east-1"

echo "📋 Service Configuration:"
echo "   Service Name: $SERVICE_NAME"
echo "   Image URI: $ECR_IMAGE_URI"
echo "   Region: $AWS_REGION"
echo ""

echo "🔐 Step 1: Create IAM role for App Runner (if not exists)"
if ! aws iam get-role --role-name AppRunnerECRAccessRole &>/dev/null; then
    echo "Creating IAM role for App Runner..."
    aws iam create-role --role-name AppRunnerECRAccessRole --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "build.apprunner.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }'
    
    aws iam attach-role-policy --role-name AppRunnerECRAccessRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess
    echo "Waiting for role to be ready..."
    sleep 10
fi

echo "🏗️ Step 2: Create App Runner service configuration"
cat > apprunner-config.json << EOF
{
  "ServiceName": "$SERVICE_NAME",
  "SourceConfiguration": {
    "ImageRepository": {
      "ImageIdentifier": "$ECR_IMAGE_URI",
      "ImageConfiguration": {
        "Port": "8000",
        "RuntimeEnvironmentVariables": {
          "SECRET_KEY": "your-super-secret-production-key-change-this-now",
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
EOF

echo "🚀 Step 3: Create App Runner service"
echo "Creating the service... (this may take a few minutes)"

if aws apprunner create-service --cli-input-json file://apprunner-config.json --region $AWS_REGION > service-output.json; then
    echo "✅ Service creation initiated!"
    
    # Extract service ARN
    SERVICE_ARN=$(cat service-output.json | grep -o '"ServiceArn":"[^"]*' | cut -d'"' -f4)
    echo "📋 Service ARN: $SERVICE_ARN"
    
    echo "⏳ Step 4: Wait for service to be ready"
    echo "This may take 5-10 minutes. Checking status..."
    
    while true; do
        sleep 30
        SERVICE_STATUS=$(aws apprunner describe-service --service-arn "$SERVICE_ARN" --region $AWS_REGION --query "Service.Status" --output text 2>/dev/null)
        
        echo "Current status: $SERVICE_STATUS"
        
        if [ "$SERVICE_STATUS" = "RUNNING" ]; then
            break
        elif [ "$SERVICE_STATUS" = "CREATE_FAILED" ]; then
            echo "❌ Service creation failed!"
            aws apprunner describe-service --service-arn "$SERVICE_ARN" --region $AWS_REGION
            exit 1
        else
            echo "Still deploying... checking again in 30 seconds"
        fi
    done
    
    echo "✅ Service is now RUNNING!"
    
    # Get the service URL
    SERVICE_URL=$(aws apprunner describe-service --service-arn "$SERVICE_ARN" --region $AWS_REGION --query "Service.ServiceUrl" --output text)
    
    echo ""
    echo "🎉 Deployment Complete!"
    echo "========================"
    echo "🌐 Your backend is now live at: $SERVICE_URL"
    echo "📊 Health check: $SERVICE_URL/health"
    echo "📖 API docs: $SERVICE_URL/docs"
    echo ""
    echo "🔧 Next Steps:"
    echo "1. Test your API: curl $SERVICE_URL/health"
    echo "2. Update your frontend to use: $SERVICE_URL"
    echo "3. Test the full application"
    echo ""
    echo "📱 AWS Console Links:"
    echo "- App Runner: https://console.aws.amazon.com/apprunner/"
    echo "- CloudWatch Logs: https://console.aws.amazon.com/cloudwatch/"
    echo ""
    
else
    echo "❌ Failed to create service. Check the error above."
    echo "💡 You may need to create the service manually in the AWS Console."
    exit 1
fi

# Clean up temporary files
rm -f apprunner-config.json service-output.json

echo "🎯 Your backend deployment is complete!"