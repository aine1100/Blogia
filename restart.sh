#!/bin/bash

echo "🔄 Restarting Blog Application..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images to force rebuild
echo "🗑️ Removing old images..."
docker-compose down --rmi all

# Rebuild and start
echo "🔨 Rebuilding and starting services..."
docker-compose build --no-cache
docker-compose up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 30

# Check status
echo "🔍 Checking service status..."
docker-compose ps

echo "✅ Restart complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"