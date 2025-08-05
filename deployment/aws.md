# AWS Deployment Guide

Deploy your blog on AWS using ECS (Elastic Container Service).

## Option 1: AWS ECS with Fargate (Recommended)

### Prerequisites
- AWS Account
- AWS CLI installed
- Docker images pushed to ECR

### Steps

1. **Push Images to ECR**
```bash
# Create ECR repositories
aws ecr create-repository --repository-name blog-backend
aws ecr create-repository --repository-name blog-frontend

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push images
docker tag blog-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest
docker tag blog-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/blog-frontend:latest

docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/blog-frontend:latest
```

2. **Create ECS Task Definition**
```json
{
  "family": "blog-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest",
      "portMappings": [{"containerPort": 8000}],
      "environment": [
        {"name": "SECRET_KEY", "value": "your-secret-key"}
      ]
    },
    {
      "name": "frontend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/blog-frontend:latest",
      "portMappings": [{"containerPort": 80}]
    }
  ]
}
```

3. **Create ECS Service**
4. **Set up Application Load Balancer**
5. **Configure Route 53 for custom domain**

## Estimated Cost
- ~$20-50/month depending on usage