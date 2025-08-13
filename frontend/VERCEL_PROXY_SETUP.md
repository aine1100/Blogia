# Vercel Proxy Setup - Mixed Content Fix

## 🎯 Problem Solved

This setup fixes the "Mixed Content" error where HTTPS Vercel tries to access HTTP backend.

## 📁 Files Added:

- `api/[...path].js` - Main API proxy route
- `api/auth/login.js` - Special login handler
- `vercel-config.js` - Backend URL configuration
- Updated `src/services/api.js` - Auto-detects Vercel and uses proxy

## 🚀 How It Works:

1. **Local Development**: Direct HTTP calls to backend
2. **Vercel Production**: Routes through `/api/*` proxy
3. **Proxy Routes**: Forward requests to your HTTP backend server-side

## 🔧 Setup Steps:

### 1. Update Backend URL

Edit `vercel-config.js` with your ECS IP:

```javascript
export const BACKEND_CONFIG = {
  BACKEND_URL: "http://YOUR_ECS_IP:8000", // Update this!
};
```

### 2. Get Your ECS IP

```cmd
.\get-ecs-ip.bat
```

### 3. Deploy to Vercel

Push to GitHub - Vercel will auto-deploy.

## ✅ What This Fixes:

- ✅ Mixed Content errors (HTTPS → HTTP)
- ✅ CORS issues
- ✅ All API endpoints work
- ✅ Authentication works
- ✅ File uploads work

## 🔍 How to Test:

1. Deploy to Vercel
2. Open browser dev tools
3. Check Network tab - should see `/api/*` requests
4. No more "Mixed Content" errors!

## 📝 Notes:

- Local development still uses direct backend calls
- Vercel automatically detects and uses proxy
- All existing frontend code works unchanged
- Backend doesn't need any changes

## 🎯 Result:

Your Vercel app will now work perfectly with your HTTP ECS backend!
