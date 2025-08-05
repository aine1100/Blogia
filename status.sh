#!/bin/bash

echo "🔍 Blog Application Status Check"
echo "================================"

echo ""
echo "📊 Docker Compose Services:"
docker-compose ps

echo ""
echo "🐳 Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(NAMES|blog-)"

echo ""
echo "🌐 Port Status:"
echo "Checking port 80 (Frontend)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 | grep -q "200\|404"; then
    echo "✅ Port 80 is accessible"
else
    echo "❌ Port 80 is not accessible"
fi

echo "Checking port 8000 (Backend)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health | grep -q "200"; then
    echo "✅ Port 8000 is accessible"
else
    echo "❌ Port 8000 is not accessible"
fi

echo ""
echo "📋 Service URLs:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"

echo ""
echo "📊 Container Logs (last 10 lines):"
echo "Frontend logs:"
docker-compose logs --tail=10 frontend

echo ""
echo "Backend logs:"
docker-compose logs --tail=10 backend