#!/bin/bash

echo "🚀 Preparing for Railway Deployment"

# Create railway.toml for backend
cat > railway.toml << EOF
[build]
builder = "dockerfile"
dockerfilePath = "app/Dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
EOF

# Create separate railway.toml for frontend
mkdir -p frontend-deploy
cat > frontend-deploy/railway.toml << EOF
[build]
builder = "dockerfile"
dockerfilePath = "frontend/Dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
EOF

echo "✅ Railway configuration files created!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Go to railway.app and sign up"
echo "3. Create new project from GitHub repo"
echo "4. Deploy backend using app/ folder"
echo "5. Deploy frontend using frontend/ folder"
echo "6. Set environment variables as shown in deployment/railway.md"