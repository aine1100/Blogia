#!/bin/bash

AWS_REGION="us-east-1"
CLUSTER_NAME="blog-backend-cluster"
SERVICE_NAME="blog-backend-service"

echo "Getting public IP for ECS service..."

# Get the task ARN
TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_NAME --query 'taskArns[0]' --output text --region $AWS_REGION)

if [ "$TASK_ARN" = "None" ] || [ -z "$TASK_ARN" ]; then
    echo "No running tasks found for service $SERVICE_NAME"
    exit 1
fi

echo "Task ARN: $TASK_ARN"

# Get the network interface ID
NETWORK_INTERFACE_ID=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text --region $AWS_REGION)

if [ -z "$NETWORK_INTERFACE_ID" ]; then
    echo "Could not find network interface ID"
    exit 1
fi

echo "Network Interface ID: $NETWORK_INTERFACE_ID"

# Get the public IP
PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $NETWORK_INTERFACE_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text --region $AWS_REGION)

if [ "$PUBLIC_IP" = "None" ] || [ -z "$PUBLIC_IP" ]; then
    echo "No public IP assigned to the task"
    exit 1
fi

echo "Public IP: $PUBLIC_IP"
echo "Backend API URL: http://$PUBLIC_IP:8000"
echo "API Documentation: http://$PUBLIC_IP:8000/docs"
echo "Health Check: http://$PUBLIC_IP:8000/health"