#!/bin/bash

AWS_REGION="us-east-1"

# Create ECS Task Execution Role
echo "Creating ECS Task Execution Role..."

# Trust policy for ECS tasks
cat > ecs-task-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create the execution role
aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document file://ecs-task-trust-policy.json \
    2>/dev/null || echo "ecsTaskExecutionRole already exists"

# Attach the AWS managed policy for ECS task execution
aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy \
    2>/dev/null || echo "Policy already attached to ecsTaskExecutionRole"

# Create ECS Task Role (for application permissions)
echo "Creating ECS Task Role..."

aws iam create-role \
    --role-name ecsTaskRole \
    --assume-role-policy-document file://ecs-task-trust-policy.json \
    2>/dev/null || echo "ecsTaskRole already exists"

# Create custom policy for task role if needed
cat > ecs-task-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
EOF

aws iam create-policy \
    --policy-name ecsTaskPolicy \
    --policy-document file://ecs-task-policy.json \
    2>/dev/null || echo "ecsTaskPolicy already exists"

# Get account ID for policy ARN
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

aws iam attach-role-policy \
    --role-name ecsTaskRole \
    --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/ecsTaskPolicy \
    2>/dev/null || echo "Policy already attached to ecsTaskRole"

# Clean up temporary files
rm -f ecs-task-trust-policy.json ecs-task-policy.json

echo "IAM roles created successfully!"