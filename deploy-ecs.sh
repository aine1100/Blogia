#!/bin/bash

# Configuration
AWS_REGION="us-east-1"
CLUSTER_NAME="blog-backend-cluster"
SERVICE_NAME="blog-backend-service"
TASK_DEFINITION_NAME="blog-backend-task"
BACKEND_REPO_NAME="blog-backend"

# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [ -z "$ACCOUNT_ID" ]; then
    echo "Error: Unable to get AWS account ID. Make sure AWS CLI is configured."
    exit 1
fi

echo "Using AWS Account ID: $ACCOUNT_ID"
echo "Using Region: $AWS_REGION"

# Create ECR repository if it doesn't exist
echo "Creating ECR repository..."
aws ecr create-repository --repository-name $BACKEND_REPO_NAME --region $AWS_REGION 2>/dev/null || echo "Backend repository already exists"

# Get ECR login token
echo "Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push backend image
echo "Building and pushing backend image..."
docker build -f app/Dockerfile.production -t $BACKEND_REPO_NAME ./app
docker tag $BACKEND_REPO_NAME:latest $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO_NAME:latest
docker push $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO_NAME:latest

# Create CloudWatch log group
echo "Creating CloudWatch log group..."
aws logs create-log-group --log-group-name "/ecs/blog-backend" --region $AWS_REGION 2>/dev/null || echo "Log group already exists"

# Create ECS cluster
echo "Creating ECS cluster..."
aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $AWS_REGION 2>/dev/null || echo "Cluster already exists"

# Create IAM roles if they don't exist
echo "Creating IAM roles..."
./create-ecs-roles.sh

# Update task definition with actual values
echo "Updating task definition..."
sed "s/{ACCOUNT_ID}/$ACCOUNT_ID/g; s/{REGION}/$AWS_REGION/g" ecs-task-definition.json > ecs-task-definition-updated.json

# Register task definition
echo "Registering task definition..."
aws ecs register-task-definition --cli-input-json file://ecs-task-definition-updated.json --region $AWS_REGION

# Create or update service
echo "Creating/updating ECS service..."
if aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION --query 'services[0].serviceName' --output text 2>/dev/null | grep -q $SERVICE_NAME; then
    echo "Updating existing service..."
    aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --task-definition $TASK_DEFINITION_NAME --region $AWS_REGION
else
    echo "Creating new service..."
    # Get default VPC and subnets
    VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query 'Vpcs[0].VpcId' --output text --region $AWS_REGION)
    SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text --region $AWS_REGION)
    SUBNET_ARRAY=$(echo $SUBNET_IDS | tr ' ' ',')
    
    # Create security group
    SECURITY_GROUP_ID=$(aws ec2 create-security-group --group-name blog-backend-sg --description "Security group for blog backend" --vpc-id $VPC_ID --region $AWS_REGION --query 'GroupId' --output text 2>/dev/null || aws ec2 describe-security-groups --filters "Name=group-name,Values=blog-backend-sg" --query 'SecurityGroups[0].GroupId' --output text --region $AWS_REGION)
    
    # Add inbound rules
    aws ec2 authorize-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 8000 --cidr 0.0.0.0/0 --region $AWS_REGION 2>/dev/null || echo "Port 8000 rule already exists"
    
    aws ecs create-service \
        --cluster $CLUSTER_NAME \
        --service-name $SERVICE_NAME \
        --task-definition $TASK_DEFINITION_NAME \
        --desired-count 1 \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_ARRAY],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=ENABLED}" \
        --region $AWS_REGION
fi

echo "Deployment completed!"
echo "Your application will be available shortly."
echo "To get the public IP, run:"
echo "aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks \$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_NAME --query 'taskArns[0]' --output text --region $AWS_REGION) --query 'tasks[0].attachments[0].details[?name==\`networkInterfaceId\`].value' --output text --region $AWS_REGION | xargs -I {} aws ec2 describe-network-interfaces --network-interface-ids {} --query 'NetworkInterfaces[0].Association.PublicIp' --output text --region $AWS_REGION"

# Clean up temporary file
rm -f ecs-task-definition-updated.json