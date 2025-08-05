#!/bin/bash

# Blog Application Development Script (Root)

set -e

echo "🚀 Starting Blog Application in Development Mode..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create data directory
echo "📁 Creating data directory..."
mkdir -p app/data

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting development services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 20

# Check service health
echo "🔍 Checking service health..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Development services are running!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost"
    echo "   Backend API: http://localhost:8000"
    echo "   API Documentation: http://localhost:8000/docs"
    echo ""
    echo "📊 To view logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 To stop services:"
    echo "   docker-compose down"
    echo ""
    echo "🔄 To restart services:"
    echo "   docker-compose restart"
else
    echo "❌ Some services failed to start. Check logs:"
    docker-compose logs
    exit 1
fi