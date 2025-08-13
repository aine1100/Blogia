#!/bin/bash

AWS_REGION="us-east-1"
CLUSTER_NAME="blog-backend-cluster"
SERVICE_NAME="blog-backend-service"

echo "Cleaning up ECS resources..."

# Stop the service
echo "Stopping ECS service..."
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --desired-count 0 --region $AWS_REGION

# Wait for tasks to stop
echo "Waiting for tasks to stop..."
sleep 30

# Delete the service
echo "Deleting ECS service..."
aws ecs delete-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force --region $AWS_REGION

# Delete the cluster
echo "Deleting ECS cluster..."
aws ecs delete-cluster --cluster $CLUSTER_NAME --region $AWS_REGION

# Delete security group (optional)
echo "Deleting security group..."
SECURITY_GROUP_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=blog-backend-sg" --query 'SecurityGroups[0].GroupId' --output text --region $AWS_REGION)
if [ "$SECURITY_GROUP_ID" != "None" ] && [ -n "$SECURITY_GROUP_ID" ]; then
    aws ec2 delete-security-group --group-id $SECURITY_GROUP_ID --region $AWS_REGION
fi

echo "Cleanup completed!"
echo "Note: ECR repository and CloudWatch logs are preserved."
echo "To delete ECR repository:"
echo "aws ecr delete-repository --repository-name blog-backend --force --region $AWS_REGION"