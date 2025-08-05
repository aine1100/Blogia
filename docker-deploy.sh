#!/bin/bash

# Docker Registry Deployment Script

# Set your registry details
REGISTRY="your-registry.com"  # e.g., ghcr.io, docker.io
PROJECT_NAME="blog-app"
VERSION="latest"

echo "🚀 Building and pushing Docker images..."

# Build images
echo "🔨 Building backend image..."
docker build -t $REGISTRY/$PROJECT_NAME/backend:$VERSION ./app

echo "🔨 Building frontend image..."
docker build -t $REGISTRY/$PROJECT_NAME/frontend:$VERSION ./frontend

# Push images
echo "📤 Pushing backend image..."
docker push $REGISTRY/$PROJECT_NAME/backend:$VERSION

echo "📤 Pushing frontend image..."
docker push $REGISTRY/$PROJECT_NAME/frontend:$VERSION

echo "✅ Images pushed successfully!"
echo ""
echo "📋 Deployment URLs:"
echo "   Backend Image: $REGISTRY/$PROJECT_NAME/backend:$VERSION"
echo "   Frontend Image: $REGISTRY/$PROJECT_NAME/frontend:$VERSION"