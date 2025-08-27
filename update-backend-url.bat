@echo off
echo ========================================
echo   Backend URL Updated Successfully!
echo ========================================
echo.

echo ✅ Updated frontend/.env.production
echo ✅ Updated frontend/.env.example  
echo ✅ Updated frontend/src/services/api.js
echo ✅ Updated frontend/vercel-config.js
echo.

echo New backend URL: https://blogia-tizd.onrender.com
echo.

echo ========================================
echo   What This Fixes:
echo ========================================
echo ✅ No more mixed content errors (HTTPS → HTTPS)
echo ✅ No need for Cloudflare tunnels
echo ✅ No need for Vercel API proxy routes
echo ✅ Direct connection to your Render backend
echo.

echo ========================================
echo   Next Steps:
echo ========================================
echo 1. Push your code to GitHub
echo 2. Vercel will auto-deploy with new backend URL
echo 3. Your app will work perfectly!
echo.

echo You can now remove these files (no longer needed):
echo - frontend/api/[...path].js
echo - frontend/api/auth/login.js
echo - All Cloudflare tunnel scripts
echo.

echo Your frontend will now connect directly to:
echo https://blogia-tizd.onrender.com
echo.

pause