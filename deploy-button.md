# One-Click AWS Deployment

## Deploy to AWS App Runner

[![Deploy to AWS](https://img.shields.io/badge/Deploy%20to-AWS%20App%20Runner-orange?style=for-the-badge&logo=amazon-aws)](https://console.aws.amazon.com/apprunner/home#/create)

### Quick Deploy Steps:

1. **Click the button above** or go to [AWS App Runner Console](https://console.aws.amazon.com/apprunner/)

2. **Choose Source**: Container registry → Amazon ECR

3. **Image URI**: Use the URI from running `deploy-aws.bat` or `deploy-aws.sh`

4. **Service Settings**:
   - Service name: `blog-backend`
   - Port: `8000`

5. **Environment Variables**:
   ```
   SECRET_KEY=your-super-secret-production-key
   DATABASE_URL=sqlite:///./data/blog.db
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ENVIRONMENT=production
   ```

6. **Click "Create & Deploy"**

Your backend will be live at: `https://[random-id].[region].awsapprunner.com`

## Estimated Costs

- **App Runner**: ~$25-50/month (includes compute + data transfer)
- **ECR Storage**: ~$1-5/month (for Docker images)
- **Total**: ~$30-55/month

## Next Steps

1. Update your frontend's API URL to the App Runner URL
2. Set up a custom domain (optional)
3. Configure monitoring and alerts