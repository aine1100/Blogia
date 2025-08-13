#!/bin/bash

AWS_REGION="us-east-1"
CLUSTER_NAME="blog-backend-cluster"
SERVICE_NAME="blog-backend-service"

echo "========================================"
echo "   ECS Backend Service Status Check"
echo "========================================"
echo

# Check if cluster exists
echo "[1/5] Checking ECS cluster..."
CLUSTER_STATUS=$(aws ecs describe-clusters --clusters $CLUSTER_NAME --region $AWS_REGION --query 'clusters[0].status' --output text 2>/dev/null)

if [ "$CLUSTER_STATUS" = "ACTIVE" ]; then
    echo "✓ Cluster '$CLUSTER_NAME' is ACTIVE"
else
    echo "✗ Cluster '$CLUSTER_NAME' not found or inactive"
    echo "  Run ./deploy-ecs.sh to create the cluster"
    exit 1
fi

echo

# Check service status
echo "[2/5] Checking ECS service..."
SERVICE_STATUS=$(aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION --query 'services[0].status' --output text 2>/dev/null)

if [ "$SERVICE_STATUS" = "ACTIVE" ]; then
    echo "✓ Service '$SERVICE_NAME' is ACTIVE"
    
    # Get desired vs running count
    DESIRED_COUNT=$(aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION --query 'services[0].desiredCount' --output text)
    RUNNING_COUNT=$(aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION --query 'services[0].runningCount' --output text)
    
    echo "  Desired tasks: $DESIRED_COUNT"
    echo "  Running tasks: $RUNNING_COUNT"
else
    echo "✗ Service '$SERVICE_NAME' not found or inactive"
    echo "  Run ./deploy-ecs.sh to create the service"
    exit 1
fi

echo

# Check task status
echo "[3/5] Checking running tasks..."
TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_NAME --region $AWS_REGION --query 'taskArns[0]' --output text)

if [ "$TASK_ARN" = "None" ] || [ -z "$TASK_ARN" ]; then
    echo "✗ No running tasks found"
    echo "  Service may be starting up or failed to start"
    exit 1
else
    echo "✓ Found running task"
    
    # Get task status
    TASK_STATUS=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN --region $AWS_REGION --query 'tasks[0].lastStatus' --output text)
    echo "  Task status: $TASK_STATUS"
fi

echo

# Get public IP
echo "[4/5] Getting public IP address..."
NETWORK_INTERFACE_ID=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text --region $AWS_REGION)

if [ -z "$NETWORK_INTERFACE_ID" ]; then
    echo "✗ Could not find network interface"
else
    PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $NETWORK_INTERFACE_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text --region $AWS_REGION)
    
    if [ "$PUBLIC_IP" = "None" ] || [ -z "$PUBLIC_IP" ]; then
        echo "✗ No public IP assigned"
    else
        echo "✓ Public IP: $PUBLIC_IP"
    fi
fi

echo

# Test API connectivity
echo "[5/5] Testing API connectivity..."
if [ -n "$PUBLIC_IP" ] && [ "$PUBLIC_IP" != "None" ]; then
    echo "Testing health endpoint..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$PUBLIC_IP:8000/health)
    echo "HTTP Status: $HTTP_STATUS"
    echo
    echo "========================================"
    echo "   Your Backend API URLs:"
    echo "========================================"
    echo "   API Base URL: http://$PUBLIC_IP:8000"
    echo "   API Documentation: http://$PUBLIC_IP:8000/docs"
    echo "   Health Check: http://$PUBLIC_IP:8000/health"
    echo "   Interactive API: http://$PUBLIC_IP:8000/redoc"
    echo "========================================"
else
    echo "✗ Cannot test API - no public IP available"
fi

echo

# Show recent logs
echo "Recent logs (last 10 lines):"
echo "----------------------------------------"
LOG_STREAM=$(aws logs describe-log-streams --log-group-name "/ecs/blog-backend" --order-by LastEventTime --descending --max-items 1 --region $AWS_REGION --query 'logStreams[0].logStreamName' --output text 2>/dev/null)

if [ -n "$LOG_STREAM" ] && [ "$LOG_STREAM" != "None" ]; then
    aws logs get-log-events --log-group-name "/ecs/blog-backend" --log-stream-name "$LOG_STREAM" --region $AWS_REGION --query 'events[-10:].message' --output text
else
    echo "No recent logs found"
fi

echo
echo "Status check completed!"