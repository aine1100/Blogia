@echo off
echo ========================================
echo   Quick Tunnel Starter
echo ========================================
echo.

REM Check if vercel-config.js exists and get the URL
if exist "frontend\vercel-config.js" (
    echo ✓ Found existing configuration
    for /f "tokens=*" %%i in ('findstr "BACKEND_URL:" frontend\vercel-config.js') do (
        set CONFIG_LINE=%%i
    )
    echo Current config: !CONFIG_LINE!
    echo.
)

echo Starting automatic HTTPS setup...
echo This will:
echo 1. Get your ECS backend IP
echo 2. Start Cloudflare tunnel
echo 3. Update your frontend config
echo 4. Make your backend HTTPS ready!
echo.

call auto-setup-https.bat