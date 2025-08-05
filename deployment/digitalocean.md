# DigitalOcean Droplet Deployment

Deploy on a DigitalOcean VPS for full control.

## Steps

### 1. Create Droplet
- Choose Ubuntu 22.04 LTS
- Select $6/month basic plan
- Add SSH key

### 2. Setup Server
```bash
# Connect to your droplet
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Git
apt install git -y
```

### 3. Deploy Application
```bash
# Clone your repository
git clone https://github.com/yourusername/blog.git
cd blog

# Create environment file
cp .env.example .env
# Edit .env with production values

# Deploy
./deploy.sh
```

### 4. Setup Domain (Optional)
```bash
# Install Nginx for reverse proxy
apt install nginx -y

# Configure Nginx
nano /etc/nginx/sites-available/blog
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. SSL Certificate (Optional)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d yourdomain.com
```

## Cost
- $6/month for basic droplet
- Additional costs for domain name