# Blog Application Deployment Guide

This guide will help you deploy the Blog application using Docker and Docker Compose.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system
- Git (to clone the repository)

## Quick Start

### 1. Clone the Repository

```bash
gh repo clone aine1100/Blogia
cd Blogia
```

### 2. Run the Deployment Script

```bash
# Make the script executable (Linux/Mac)
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Manual Deployment

If you prefer to run the commands manually:

### 1. Create Environment File

```bash
cp .env.example .env
# Edit .env with your production values
```

### 2. Create Data Directory

```bash
mkdir -p app/data
```

### 3. Build and Start Services

```bash
# For production
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# For development
docker-compose build
docker-compose up -d
```

## Environment Variables

Edit the `.env` file with your configuration:

```env
# Backend Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
DATABASE_URL=sqlite:///./data/blog.db
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000

# Production Configuration
ENVIRONMENT=production
```

## Docker Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services

```bash
docker-compose down
```

### Restart Services

```bash
docker-compose restart
```

### Rebuild Services

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Check Service Status

```bash
docker-compose ps
```

## Troubleshooting

### Frontend Build Issues

If the frontend build fails:

1. Check that `package.json` exists in the `frontend/` directory
2. Ensure all dependencies are properly listed
3. Verify the build script is configured correctly

### Backend Issues

If the backend fails to start:

1. Check the database file permissions
2. Verify the SECRET_KEY is set in the .env file
3. Check the logs for specific error messages

### Port Conflicts

If ports 80 or 8000 are already in use:

1. Stop other services using these ports
2. Or modify the port mappings in `docker-compose.yml`

### Database Issues

If you need to reset the database:

```bash
docker-compose down
rm -rf app/data/blog.db
docker-compose up -d
```

## Production Considerations

1. **Security**: Change the default SECRET_KEY
2. **Database**: Consider using PostgreSQL for production
3. **SSL**: Set up HTTPS with a reverse proxy like Nginx
4. **Monitoring**: Add logging and monitoring solutions
5. **Backups**: Implement database backup strategies

## File Structure

```
blogia/
├── app/                    # Backend (FastAPI)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── ...
├── frontend/              # Frontend (React)
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── docker-compose.yml     # Development
├── docker-compose.prod.yml # Production
├── .env.example          # Environment template
└── deploy.sh             # Deployment script
```
