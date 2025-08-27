@echo off
echo ========================================
echo   Railway Deployment Fix
echo ========================================
echo.

echo [1/3] Updating Railway configuration for better compatibility...

REM Update railway.toml to use nixpacks instead of dockerfile
echo [build] > railway.toml
echo builder = "nixpacks" >> railway.toml
echo. >> railway.toml
echo [deploy] >> railway.toml
echo startCommand = "cd app && uvicorn main:app --host 0.0.0.0 --port $PORT" >> railway.toml
echo healthcheckPath = "/health" >> railway.toml
echo healthcheckTimeout = 100 >> railway.toml
echo restartPolicyType = "on_failure" >> railway.toml
echo. >> railway.toml
echo [env] >> railway.toml
echo ENVIRONMENT = "production" >> railway.toml
echo PYTHONPATH = "/app" >> railway.toml

echo ✓ Updated railway.toml to use Nixpacks

echo.
echo [2/3] Creating Railway-compatible nixpacks.toml...

echo [phases.setup] > nixpacks.toml
echo nixPkgs = ["python311", "pip"] >> nixpacks.toml
echo. >> nixpacks.toml
echo [phases.install] >> nixpacks.toml
echo cmds = ["pip install -r app/requirements.txt"] >> nixpacks.toml
echo. >> nixpacks.toml
echo [phases.build] >> nixpacks.toml
echo cmds = ["echo 'Build completed'"] >> nixpacks.toml
echo. >> nixpacks.toml
echo [start] >> nixpacks.toml
echo cmd = "cd app && uvicorn main:app --host 0.0.0.0 --port $PORT" >> nixpacks.toml

echo ✓ Created nixpacks.toml

echo.
echo [3/3] Creating Railway deployment guide...

echo ========================================
echo   Railway Deployment Instructions
echo ========================================
echo.
echo 1. Go to railway.app and sign up with GitHub
echo 2. Create new project from GitHub repo
echo 3. For BACKEND service:
echo    - Root directory: app
echo    - Will auto-detect Python
echo    - Add environment variables:
echo      * ENVIRONMENT=production
echo      * SECRET_KEY=your-secret-key
echo      * DATABASE_URL=sqlite:///./data/blog.db
echo.
echo 4. For FRONTEND service (add to same project):
echo    - Root directory: frontend  
echo    - Will auto-detect Node.js
echo    - Add environment variable:
echo      * VITE_API_BASE_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
echo.
echo 5. Deploy both services
echo.
echo ✅ Railway provides automatic HTTPS URLs!
echo ✅ No Docker build issues with Nixpacks!
echo ✅ No need for Cloudflare tunnels!
echo.

echo Configuration updated for Railway deployment.
echo Push your code to GitHub and deploy on Railway!

pause