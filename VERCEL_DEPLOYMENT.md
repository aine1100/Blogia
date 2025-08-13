# Vercel Frontend Deployment Guide

## Issues and Solutions

### 🚨 Current Issues:
1. **Environment Variables**: Vercel needs proper env var setup
2. **CORS**: Backend needs to allow Vercel domain
3. **Mixed Content**: HTTP backend + HTTPS frontend = blocked requests

## 🔧 Quick Fix Steps:

### Step 1: Deploy to Vercel
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. In Vercel dashboard, go to your project settings
4. Add Environment Variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `http://YOUR_ECS_IP:8000` (get from `get-ecs-ip.bat`)

### Step 2: Update Backend CORS (Required!)
Your backend needs to allow requests from Vercel. Add your Vercel URL to CORS origins.

### Step 3: Test Deployment
After setting the environment variable, redeploy on Vercel.

## 🎯 Better Solution: Use HTTPS Backend

### Option A: Add Load Balancer (Recommended)
1. Create Application Load Balancer in AWS
2. Add SSL certificate
3. Point to your ECS service
4. Update `VITE_API_BASE_URL` to HTTPS URL

### Option B: Use Vercel API Routes (Proxy)
Create API routes in Vercel that proxy to your backend:

```javascript
// pages/api/[...path].js
export default async function handler(req, res) {
  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  
  const response = await fetch(`http://YOUR_ECS_IP:8000/${apiPath}`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...req.headers,
    },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
  });
  
  const data = await response.json();
  res.status(response.status).json(data);
}
```

## 🚀 Deployment Steps:

### 1. Set Environment Variable in Vercel
```bash
# Get your ECS IP first
./get-ecs-ip.bat
```

Then in Vercel dashboard:
- Project Settings → Environment Variables
- Add: `VITE_API_BASE_URL` = `http://YOUR_ECS_IP:8000`

### 2. Update Backend CORS
Add your Vercel domain to allowed origins in your FastAPI app.

### 3. Deploy
Push to GitHub and Vercel will auto-deploy.

## 🔍 Common Issues:

### Issue: "Failed to fetch" errors
**Cause**: CORS or mixed content blocking
**Fix**: Update backend CORS settings

### Issue: Environment variables not working
**Cause**: Vercel env vars not set or wrong name
**Fix**: Use exact name `VITE_API_BASE_URL` in Vercel dashboard

### Issue: 404 on refresh
**Cause**: SPA routing not configured
**Fix**: Already handled in `vercel.json` rewrites

## 🎯 Production Recommendations:

1. **Use HTTPS backend** (ALB + SSL certificate)
2. **Set up custom domain** for both frontend and backend
3. **Configure proper CORS** with specific domains
4. **Add error monitoring** (Sentry, LogRocket)
5. **Set up CI/CD** with GitHub Actions

## 📝 Environment Variables Needed:

In Vercel dashboard, add:
- `VITE_API_BASE_URL`: Your backend URL (HTTP or HTTPS)

## 🔧 Backend CORS Update Needed:

Your FastAPI app needs to allow your Vercel domain:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://your-app.vercel.app",  # Add your Vercel URL
        "https://*.vercel.app",         # Allow all Vercel preview URLs
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```