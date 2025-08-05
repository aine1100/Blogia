#!/bin/bash

# Blog Application Deployment Script (Root)

set -e

echo "🚀 Starting Blog Application Deployment..."

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

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "⚠️  Please update the .env file with your production values before running again."
        echo "📝 Edit the .env file and run this script again."
        exit 1
    else
        echo "❌ .env.example file not found. Creating a basic .env file..."
        cat > .env << EOF
# Backend Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production-$(date +%s)
DATABASE_URL=sqlite:///./data/blog.db
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000

# Production Configuration
ENVIRONMENT=production
EOF
        echo "✅ Created .env file with default values."
    fi
fi

# Create data directory
echo "📁 Creating data directory..."
mkdir -p app/data

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build --no-cache

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
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
else
    echo "❌ Some services are not healthy. Check logs:"
    docker-compose logs
    exit 1
fi