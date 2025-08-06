#!/bin/bash

echo "🔧 Quick fix: Adding email-validator and rebuilding..."

# Stop backend container
echo "🛑 Stopping backend..."
docker-compose stop backend

# Remove backend image
echo "🗑️ Removing backend image..."
docker rmi blog-backend 2>/dev/null || true

# Rebuild backend with new requirements
echo "🔨 Rebuilding backend with email-validator..."
docker-compose build --no-cache backend

# Start backend
echo "🚀 Starting backend..."
docker-compose up -d backend

# Wait and check
echo "⏳ Waiting for backend to start..."
sleep 15

echo "🔍 Checking backend status..."
docker-compose ps backend

echo "📊 Backend logs:"
docker-compose logs --tail=10 backend

echo "✅ Done! Backend should now be working."