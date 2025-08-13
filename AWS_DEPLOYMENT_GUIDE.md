# AWS ECS Deployment Guide

This guide covers deploying the blog backend API to AWS using ECS Fargate with the free tier.

## Prerequisites

1. AWS CLI installed and configured
2. Docker installed
3. AWS account with appropriate permissions

## Free Tier Benefits

AWS ECS Fargate free tier includes:
- 20 GB-hours per month for the first 12 months
- Perfect for small applications and testing
- No upfront costs

## Method 1: ECS Fargate (Recommended - Free Tier)

### Step 1: Configure AWS CLI

```bash
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, default region (us-east-1), and output format.

### Step 2: Run Deployment Script

For Linux/Mac:
```bash
chmod +x deploy-ecs.sh
./deploy-ecs.sh
```

For Windows:
```cmd
deploy-ecs.bat
```

### Step 3: Monitor Deployment

The script will:
1. Create ECR repository for backend
2. Build and push backend Docker image to ECR
3. Create ECS cluster and task definition
4. Set up IAM roles and security groups
5. Deploy the backend service using Fargate

### Step 4: Get Your Backend API URL

After deployment, get the public IP:

For Linux/Mac:
```bash
chmod +x get-ecs-ip.sh
./get-ecs-ip.sh
```

For Windows:
```cmd
get-ecs-ip.bat
```

This will show you:
- Backend API URL: `http://PUBLIC_IP:8000`
- API Documentation: `http://PUBLIC_IP:8000/docs`
- Health Check: `http://PUBLIC_IP:8000/health`

## Configuration

### Task Definition

The ECS task uses:
- **CPU**: 256 units (0.25 vCPU)
- **Memory**: 512 MB
- **Network**: awsvpc mode with public IP
- **Launch Type**: Fargate
- **Container**: Single backend container

### Security Groups

Automatically created security group allows:
- Port 8000 for backend API
- Inbound traffic from anywhere (0.0.0.0/0)

## Scaling and Management

### Manual Scaling
```bash
aws ecs update-service --cluster blog-backend-cluster --service blog-backend-service --desired-count 2
```

### View Service Status
```bash
aws ecs describe-services --cluster blog-backend-cluster --services blog-backend-service
```

### View Logs
```bash
aws logs describe-log-streams --log-group-name "/ecs/blog-backend"
```

## Cost Optimization

### Free Tier Usage
- Monitor usage in AWS Cost Explorer
- 20 GB-hours = ~27 days of continuous running (0.25 vCPU)
- Stop service when not needed:
```bash
aws ecs update-service --cluster blog-backend-cluster --service blog-backend-service --desired-count 0
```

### Restart Service
```bash
aws ecs update-service --cluster blog-backend-cluster --service blog-backend-service --desired-count 1
```

### Environment Variables

**Backend:**
- `DATABASE_URL`: SQLite database path
- `SECRET_KEY`: JWT secret key
- `ALGORITHM`: JWT algorithm
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

**Frontend:**
- `VITE_API_URL`: Backend API URL

## Database Considerations

### Current Setup (SQLite)
- Good for development and small applications
- Data persists in container storage
- **Limitation**: Data is lost if container restarts

### Production Recommendations

1. **AWS RDS (PostgreSQL/MySQL)**
   ```env
   DATABASE_URL=postgresql://username:password@rds-endpoint:5432/blogdb
   ```

2. **AWS DynamoDB** (requires code changes)
3. **AWS EFS** for persistent SQLite storage

## Security Best Practices

1. **Use AWS Secrets Manager** for sensitive data
2. **Enable HTTPS** (App Runner provides this automatically)
3. **Configure CORS** properly for your frontend domain
4. **Use IAM roles** instead of hardcoded credentials
5. **Enable CloudWatch logging**

## Monitoring and Logging

1. **CloudWatch Logs** - Automatic with App Runner
2. **CloudWatch Metrics** - Monitor CPU, memory, requests
3. **AWS X-Ray** - For distributed tracing
4. **Health checks** - Already configured in Dockerfile

## Security

- Tasks run in isolated containers
- Security groups control network access
- IAM roles provide minimal required permissions
- Consider adding Application Load Balancer for production use

## Production Considerations

For production deployment:
1. Use Application Load Balancer
2. Set up auto-scaling policies
3. Use RDS instead of SQLite
4. Implement proper logging and monitoring
5. Set up CI/CD pipeline
6. Use HTTPS with SSL certificates

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure your AWS user has permissions for ECS, ECR, EC2, and IAM.

2. **Task Fails to Start**: Check CloudWatch logs:
```bash
aws logs get-log-events --log-group-name "/ecs/blog-backend" --log-stream-name "backend/backend/TASK_ID"
```

3. **No Public IP**: Ensure `assignPublicIp=ENABLED` in network configuration.

### Useful Commands

```bash
# List running tasks
aws ecs list-tasks --cluster blog-backend-cluster

# Describe task details
aws ecs describe-tasks --cluster blog-backend-cluster --tasks TASK_ARN

# View all log streams
aws logs describe-log-streams --log-group-name "/ecs/blog-backend"

# Stop all tasks (to save costs)
aws ecs update-service --cluster blog-backend-cluster --service blog-backend-service --desired-count 0

# Delete service (cleanup)
aws ecs delete-service --cluster blog-backend-cluster --service blog-backend-service --force

# Delete cluster
aws ecs delete-cluster --cluster blog-backend-cluster
```

## Method 2: AWS App Runner (Paid Service)

If you prefer App Runner (easier but costs money), use the original deployment scripts:

For Windows:
```cmd
deploy-aws.bat
```

For Linux/Mac:
```bash
chmod +x deploy-aws.sh
./deploy-aws.sh
```

## Next Steps After Deployment

1. **Update Frontend**: Change `VITE_API_URL` in your frontend to point to `http://YOUR_ECS_IP:8000`
2. **Test API**: Visit `http://YOUR_ECS_IP:8000/docs` to test the API
3. **Set up Custom Domain**: Use Route 53 for custom domain  
4. **Configure SSL**: Add Application Load Balancer with SSL certificate
5. **Set up CI/CD**: Use GitHub Actions for automatic deployments
6. **Monitor**: Set up CloudWatch alarms for errors and performance

## Frontend Deployment Options

Since this only deploys the backend, you can deploy your frontend separately using:
- **Vercel** (free tier)
- **Netlify** (free tier)
- **AWS S3 + CloudFront** (very cheap)
- **GitHub Pages** (free for public repos)