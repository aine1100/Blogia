# Railway Deployment Guide

## 🚀 **Railway Deployment (Recommended)**

Railway is perfect for your blog app because:

- ✅ **Automatic HTTPS** - No need for tunnels or load balancers
- ✅ **Free tier** - Great for development and small apps
- ✅ **Easy deployment** - Just connect GitHub and deploy
- ✅ **Environment variables** - Automatic backend URL injection

## 📁 **Current Configuration:**

### **Backend Service** (`railway.backend.toml`)

- Uses Nixpacks (automatic Python detection)
- Installs from `app/requirements.txt`
- Runs FastAPI on Railway's assigned port
- Health check at `/health`

### **Frontend Service** (`railway.frontend.toml`)

- Uses Nixpacks (automatic Node.js detection)
- Builds React app with Vite
- Automatically gets backend URL via `${{BACKEND_URL}}`

## 🔧 **Deployment Steps:**

### **1. Create Railway Account**

- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### **2. Deploy Backend**

1. **New Project** → **Deploy from GitHub repo**
2. **Select your repository**
3. **Choose backend service**
4. **Set root directory**: `app`
5. **Railway will auto-detect** Python and deploy

### **3. Deploy Frontend**

1. **Add service** to same project
2. **Deploy from GitHub repo** (same repo)
3. **Set root directory**: `frontend`
4. **Add environment variable**:
   - `VITE_API_BASE_URL`: `${{backend.RAILWAY_PUBLIC_DOMAIN}}`

### **4. Configure Environment Variables**

**Backend service:**

```env
ENVIRONMENT=production
DATABASE_URL=sqlite:///./data/blog.db
SECRET_KEY=your-production-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend service:**

```env
VITE_API_BASE_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
```

## 🎯 **Expected URLs:**

After deployment, you'll get:

- **Backend**: `https://your-backend.railway.app`
- **Frontend**: `https://your-frontend.railway.app`
- **API Docs**: `https://your-backend.railway.app/docs`

## 🔧 **Fix Current Docker Issue:**

The Docker build is failing because Railway is trying to use the root Dockerfile with wrong context. I've updated `railway.toml` to use Nixpacks instead, which is more reliable.

### **Alternative: Fix Dockerfile**

If you prefer Docker, update the root `Dockerfile`:

```dockerfile
# Railway-compatible Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY app/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ .

# Create directory for database
RUN mkdir -p /app/data

# Expose port (Railway sets PORT env var)
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

# Run the application
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 💡 **Recommended Approach:**

1. **Use Nixpacks** (I've updated `railway.toml`)
2. **Deploy backend first** with root directory `app`
3. **Deploy frontend** with root directory `frontend`
4. **Set environment variables** as shown above

## 🎉 **Benefits of Railway:**

- **No Docker issues** - Nixpacks handles everything
- **Automatic HTTPS** - No need for Cloudflare tunnels
- **Easy scaling** - Just click to scale up
- **Free tier** - Perfect for development
- **Automatic deployments** - Push to GitHub = auto deploy

## 🚀 **Quick Start:**

1. Push your code to GitHub
2. Connect Railway to your GitHub repo
3. Deploy backend (root: `app`)
4. Deploy frontend (root: `frontend`)
5. Set environment variables
6. Done! 🎉

Your app will be live with HTTPS URLs automatically!
