# Render Deployment Guide

Render offers excellent Docker support with a generous free tier.

## Steps to Deploy

### 1. Prepare Repository
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 3. Deploy Backend (Web Service)
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `app`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Docker (if using Dockerfile)

4. Set Environment Variables:
   ```
   SECRET_KEY=your-production-secret-key
   DATABASE_URL=sqlite:///./data/blog.db
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

### 4. Deploy Frontend (Static Site)
1. Click "New" → "Static Site"
2. Connect same repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`

4. Set Environment Variable:
   ```
   VITE_API_BASE_URL=https://your-backend-name.onrender.com
   ```

## Render Configuration

**render.yaml** (in project root):
```yaml
services:
  - type: web
    name: blog-backend
    env: docker
    dockerfilePath: ./app/Dockerfile
    envVars:
      - key: SECRET_KEY
        generateValue: true
      - key: DATABASE_URL
        value: sqlite:///./data/blog.db

  - type: web
    name: blog-frontend
    env: static
    buildCommand: cd frontend && npm ci && npm run build
    staticPublishPath: frontend/dist
    envVars:
      - key: VITE_API_BASE_URL
        value: https://blog-backend.onrender.com
```

## Cost
- Frontend: Free (static site)
- Backend: Free tier available, then $7/month