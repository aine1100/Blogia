# Railway Deployment Guide

Railway is perfect for your Docker-based blog application.

## Steps to Deploy

### 1. Prepare Your Repository
```bash
# Make sure your code is in a Git repository
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 3. Deploy Backend
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your blog repository
3. Railway will detect your Dockerfiles
4. Choose the `app` folder for backend deployment
5. Set environment variables:
   ```
   SECRET_KEY=your-production-secret-key
   DATABASE_URL=sqlite:///./data/blog.db
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

### 4. Deploy Frontend
1. Create another service in the same project
2. Choose the `frontend` folder
3. Set environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app
   ```

### 5. Configure Domains
- Railway provides free subdomains
- You can add custom domains later

## Railway Configuration Files

Create these files for better Railway integration:

**railway.toml** (in project root):
```toml
[build]
builder = "dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
```

## Estimated Cost
- Free tier: Good for testing
- Production: ~$5-10/month for both services