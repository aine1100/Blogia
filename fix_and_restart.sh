#!/bin/bash

echo "🔄 Fixing imports and restarting containers..."

# Stop containers
echo "🛑 Stopping containers..."
docker-compose down

# Remove backend image to force rebuild
echo "🗑️ Removing backend image..."
docker rmi blog-backend 2>/dev/null || true

# Rebuild backend only
echo "🔨 Rebuilding backend..."
docker-compose build backend

# Start containers
echo "🚀 Starting containers..."
docker-compose up -d

# Wait for containers to start
echo "⏳ Waiting for containers to start..."
sleep 20

# Check status
echo "🔍 Checking status..."
docker-compose ps

echo "✅ Done! Check the logs with: docker-compose logs backend"