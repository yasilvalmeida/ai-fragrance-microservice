# Deployment Guide

This guide covers deploying the AI Fragrance Microservice to production environments.

## Prerequisites

- Docker and Docker Compose installed
- SSL certificates for HTTPS
- OpenAI API key
- Domain name (optional)

## Production Deployment

### 1. Environment Setup

Create production environment files:

```bash
# Backend production environment
cp backend/.env.example backend/.env
```

Edit `backend/.env` with production values:

```env
OPENAI_API_KEY=your_production_openai_key
PORT=3001
NODE_ENV=production
LOG_LEVEL=warn
```

### 2. SSL Certificates

Place your SSL certificates in the `ssl/` directory:

```
ssl/
  ├── cert.pem
  └── key.pem
```

For development/testing, you can generate self-signed certificates:

```bash
mkdir ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes
```

### 3. Deploy with Docker Compose

```bash
# Production deployment
docker-compose -f production.yml up -d

# Monitor logs
docker-compose -f production.yml logs -f

# Check service status
docker-compose -f production.yml ps
```

### 4. Health Checks

Verify all services are running:

```bash
# Backend health
curl https://yourdomain.com/health

# Frontend accessibility
curl https://yourdomain.com/
```

## Infrastructure Options

### AWS Deployment

1. **ECS (Elastic Container Service)**

   - Use the production Docker images
   - Set up Application Load Balancer
   - Configure SSL termination at ALB level

2. **EKS (Elastic Kubernetes Service)**
   - Convert Docker Compose to Kubernetes manifests
   - Use ingress controllers for SSL and routing

### Google Cloud Platform

1. **Cloud Run**

   - Deploy containers individually
   - Use Cloud Load Balancer for routing

2. **GKE (Google Kubernetes Engine)**
   - Similar to EKS deployment

### Digital Ocean

1. **App Platform**

   - Direct deployment from repository
   - Automatic SSL certificates

2. **Droplets with Docker**
   - Use the production.yml configuration

## Environment Variables

### Backend Required Variables

- `OPENAI_API_KEY` - Your OpenAI API key
- `NODE_ENV` - Set to 'production'
- `PORT` - Backend port (default: 3001)
- `LOG_LEVEL` - Logging level (info, warn, error)

### Frontend Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NODE_ENV` - Set to 'production'

## Security Considerations

1. **Rate Limiting**

   - Configured in Nginx and NestJS
   - API: 10 requests/minute per IP
   - Frontend: 30 requests/minute per IP

2. **Security Headers**

   - X-Frame-Options: SAMEORIGIN
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection: enabled
   - Referrer-Policy: strict-origin-when-cross-origin

3. **SSL/TLS**
   - Force HTTPS redirects
   - TLS 1.2+ only
   - Strong cipher suites

## Monitoring and Logging

### Application Logs

```bash
# View all service logs
docker-compose -f production.yml logs

# Specific service logs
docker-compose -f production.yml logs backend
docker-compose -f production.yml logs frontend
```

### Health Monitoring

- Backend: `GET /health`
- Includes OpenAI connectivity status
- Memory usage information
- Service uptime

### Metrics Collection

Consider integrating:

- Prometheus for metrics
- Grafana for dashboards
- ELK stack for log aggregation

## Scaling

### Horizontal Scaling

```yaml
services:
  backend:
    deploy:
      replicas: 3
  frontend:
    deploy:
      replicas: 2
```

### Load Balancing

- Nginx handles load balancing
- Round-robin distribution
- Health check integration

## Backup and Recovery

### Database

- No persistent database required
- Cart data stored in browser localStorage

### Configuration

- Backup environment files
- Version control all configuration

## Troubleshooting

### Common Issues

1. **OpenAI API Errors**

   - Check API key validity
   - Monitor rate limits
   - Review error logs

2. **Container Startup Issues**

   - Check environment variables
   - Verify network connectivity
   - Review Docker logs

3. **SSL Certificate Issues**
   - Verify certificate paths
   - Check certificate expiration
   - Validate certificate chain

### Debug Commands

```bash
# Check container status
docker-compose -f production.yml ps

# Enter container for debugging
docker-compose -f production.yml exec backend sh

# View real-time logs
docker-compose -f production.yml logs -f --tail=100

# Restart specific service
docker-compose -f production.yml restart backend
```

## Performance Optimization

1. **Caching**

   - Static assets cached for 1 year
   - Nginx gzip compression enabled

2. **Image Optimization**

   - Multi-stage Docker builds
   - Minimal base images

3. **Network Optimization**
   - HTTP/2 enabled
   - Connection keep-alive
   - Compression enabled

## Maintenance

### Updates

```bash
# Pull latest images
docker-compose -f production.yml pull

# Recreate containers with new images
docker-compose -f production.yml up -d --force-recreate

# Remove old images
docker image prune -f
```

### Log Rotation

Configure log rotation to prevent disk space issues:

```bash
# Add to crontab
0 2 * * * docker system prune -f --filter "until=24h"
```
