# 🐳 LaudraTrack - Complete Docker Setup Guide

## Overview

LaudraTrack is now fully containerized with Docker, making it easy to deploy consistently across any environment. This document covers the complete Docker setup, architecture, and best practices.

---

## 📋 What's Included

### Docker Files Created/Updated

1. **Dockerfile** – Production-optimized multi-stage build
2. **docker-compose.yml** – Development & testing orchestration
3. **docker-compose.prod.yml** – Production overrides
4. **.dockerignore** – Build context optimization

### Updated Documentation

- **README.md** – Comprehensive Docker section with examples
- **START_HERE.md** – Docker highlighted as recommended option

---

## 🏗️ Architecture

### Services Orchestrated

```
┌─────────────────────────────────────────────────────────────┐
│                   Docker Compose Network                     │
│                    (laudratrack-network)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐   ┌─────────────────┐   ┌────────────┐ │
│  │  Next.js App    │   │   MongoDB       │   │   Mongo    │ │
│  │  (port 3000)    │   │  (port 27017)   │   │  Express   │ │
│  │                 │   │                 │   │ (port 8081)│ │
│  │  Container:     │   │  Container:     │   │ Container: │ │
│  │  laudratrack-   │   │  laudratrack-   │   │ laudratrack│ │
│  │  app            │   │  mongo          │   │ -mongo-    │ │
│  │                 │   │                 │   │ express    │ │
│  └────────┬────────┘   └────────┬────────┘   └──────┬─────┘ │
│           │                     │                    │       │
│           └─────────────────────┼────────────────────┘       │
│                                 │                            │
│                    Health Checks & Monitoring                │
└─────────────────────────────────────────────────────────────┘
```

### Service Details

| Service           | Image                    | Port  | Purpose             | Data Persistence        |
| ----------------- | ------------------------ | ----- | ------------------- | ----------------------- |
| **app**           | Node.js 18 Alpine        | 3000  | Next.js application | None (stateless)        |
| **mongo**         | MongoDB 7.0 Alpine       | 27017 | Database            | Yes (mongo-data volume) |
| **mongo-express** | Mongo Express 1.0 Alpine | 8081  | Database UI         | None (ephemeral)        |

---

## 🚀 Quick Start

### Prerequisites

```bash
# Verify installation
docker --version      # v20.10+
docker compose --version  # v2.0+
```

### 3-Step Startup

```bash
# 1. Clone repository
git clone https://github.com/yourusername/laudratrack.git
cd laudratrack

# 2. Copy environment file
cp .env.example .env.local

# 3. Start services
docker compose up -d
```

### Access Points

| Service        | URL                   | Credentials         |
| -------------- | --------------------- | ------------------- |
| Application    | http://localhost:3000 | N/A                 |
| Database UI    | http://localhost:8081 | admin / password    |
| MongoDB Direct | localhost:27017       | admin / password123 |

---

## 🔧 Dockerfile Breakdown

### Multi-Stage Build Strategy

```dockerfile
# Stage 1: Dependencies
- Installs all npm packages
- Shared layer for both dev and prod builds
- Better Docker layer caching

# Stage 2: Builder
- Extends Stage 1 dependencies
- Copies source code
- Builds Next.js application
- Generates .next folder

# Stage 3: Runtime (Production)
- Lightweight base image
- Only production dependencies
- Non-root user for security
- Health checks enabled
- Signal handling with dumb-init
```

### Key Features

✅ **Security Hardening**

- Non-root user (nextjs:nodejs)
- Minimal image (Alpine Linux)
- No source code in final image

✅ **Performance Optimization**

- Multi-stage build (reduced image size)
- Layer caching optimization
- Production-only dependencies

✅ **Health Management**

- HTTP health check on port 3000
- 30-second intervals
- Automatic container restart on failure

---

## 📦 Docker Compose Configuration

### Development Setup (docker-compose.yml)

```yaml
app:
  - Volumes enabled for hot-reload during development
  - Node runs in production mode for testing
  - Health checks enabled
  - Depends on MongoDB readiness

mongo:
  - Persistent data with mongo-data volume
  - Authentication enabled
  - Health check for readiness probe

mongo-express:
  - Optional database management UI
  - Access at http://localhost:8081
  - Health checks enabled
```

### Production Setup (docker-compose.prod.yml)

```yaml
app:
  - Pre-built image from registry
  - No development volumes
  - Resource limits (1 CPU, 1GB RAM)
  - JSON logging with rotation

mongo:
  - Increased resource limits
  - Larger log file rotation
  - Persistent data protection

mongo-express:
  - Optional (disable in production for security)
  - Can be enabled via profiles if needed
```

---

## 🛡️ Build Optimization

### .dockerignore File

The `.dockerignore` file excludes unnecessary files from the Docker build context:

```
✓ Reduces build context size
✓ Faster Docker image builds
✓ Excludes source control (.git)
✓ Excludes dev dependencies
✓ Excludes documentation
✓ Excludes IDE configurations
```

### Image Size Breakdown

- **Base Image**: ~170 MB (node:18-alpine)
- **Dependencies**: ~200 MB
- **Application**: ~50 MB
- **Total Final Image**: ~350-400 MB

---

## 🐳 Common Docker Commands

### Container Lifecycle

```bash
# Start services (background)
docker compose up -d

# Start services (foreground, see logs)
docker compose up

# Stop services (data persists)
docker compose down

# Stop and remove all data
docker compose down -v

# Rebuild images
docker compose up -d --build

# View running services
docker compose ps

# View service logs
docker compose logs -f
docker compose logs app -f
docker compose logs mongo -f
```

### Container Management

```bash
# Execute command in container
docker compose exec app npm run lint
docker compose exec app npm run type-check

# Interactive shell
docker compose exec app sh
docker compose exec mongo mongosh

# Copy files
docker compose cp app:/app/next.config.js ./

# Inspect container
docker inspect laudratrack-app
```

### Database Operations

```bash
# Access MongoDB shell
docker compose exec mongo mongosh -u admin -p password123

# Backup database
docker compose exec mongo mongodump --uri="mongodb://admin:password123@localhost:27017/laudratrack?authSource=admin" --out=/backup

# Restore database
docker compose exec mongo mongorestore --uri="mongodb://admin:password123@localhost:27017" /backup

# Database statistics
docker compose exec mongo mongosh -u admin -p password123 --eval "db.stats()"
```

---

## 📈 Monitoring & Health

### Health Checks

Each service includes health checks:

```bash
# View service health
docker compose ps

# Check app health
docker inspect laudratrack-app | grep -A 20 "Health"

# Check MongoDB health
docker compose exec mongo mongosh -u admin -p password123 --eval "db.runCommand('ping')"
```

### Logs Management

```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View last 100 lines
docker compose logs --tail 100

# View logs from specific time
docker compose logs --since 2024-01-15

# Export logs
docker compose logs > logs.txt
```

---

## 🔐 Security Best Practices

### Development vs Production

**Development (.env.local)**

- Default credentials in environment files
- Development volumes mounted
- Mongo Express enabled for debugging

**Production**

- Strong random secrets generated
- No development volumes
- Mongo Express disabled (or behind auth)
- Resource limits enforced
- Logging with rotation

### Generating Secure Secrets

```bash
# Generate 32-byte base64 strings
openssl rand -base64 32

# Example output:
# NEXTAUTH_SECRET=rG7k9mP2xL4nW8vZ3jF6qB1tY9aD5cE7fH0iJ...
# JWT_SECRET=sM3pQ8wE2rT7yU4iO9pL6aS0dF3gH1jK2xC9vN...
```

### .env.production Template

```bash
# Create production environment
cat > .env.production << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-app.com/api
NEXTAUTH_URL=https://your-app.com
NEXTAUTH_SECRET=<generate with openssl>
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<generate with openssl>
JWT_EXPIRE=7d
EOF
```

---

## 🚀 Deployment Scenarios

### Scenario 1: Local Development

```bash
# All defaults, full debugging enabled
docker compose up -d

# With logs visible
docker compose up

# Development changes trigger rebuild
docker compose up -d --build
```

### Scenario 2: Testing on Different Machines

```bash
# Exact same environment guaranteed
docker compose up -d

# All machines produce identical results
# No "works on my machine" issues
```

### Scenario 3: Production Deployment

```bash
# Build image
docker build -t laudratrack:v1.0.0 --target runtime .

# Push to registry
docker tag laudratrack:v1.0.0 myregistry/laudratrack:v1.0.0
docker push myregistry/laudratrack:v1.0.0

# Deploy with production overrides
docker compose -f docker-compose.yml \
               -f docker-compose.prod.yml \
               up -d

# Scale if needed
docker compose up -d --scale app=3
```

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000
# or on Windows
netstat -ano | findstr :3000

# Kill process
kill -9 <PID>
# or use a different port
docker compose -e "PORT=3001" up -d
```

### Container Exits Immediately

```bash
# Check logs
docker compose logs app

# Inspect container
docker inspect laudratrack-app

# Try interactive mode
docker compose run --rm app sh
```

### Database Connection Failures

```bash
# Verify MongoDB is running
docker compose ps mongo

# Check MongoDB health
docker compose exec mongo mongosh -u admin -p password123 --eval "db.runCommand('ping')"

# Verify network connectivity
docker compose exec app ping mongo

# Check connection string in .env.local
cat .env.local | grep MONGODB_URI
```

### Image Build Failures

```bash
# Clear build cache
docker builder prune

# Build with verbose output
docker compose build --no-cache

# Check Docker daemon
docker info
```

---

## 📊 Performance Tuning

### Resource Limits

```yaml
# docker-compose.prod.yml example
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Scaling

```bash
# Run 3 app instances (requires load balancer)
docker compose up -d --scale app=3

# Scale just MongoDB replicas (advanced)
docker compose up -d --scale mongo=1
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build & Push
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build image
        run: docker build -t laudratrack:${{ github.sha }} .
      - name: Push to registry
        run: docker push laudratrack:${{ github.sha }}
```

---

## 📚 Additional Resources

- **Docker Docs:** https://docs.docker.com
- **Docker Compose Reference:** https://docs.docker.com/compose/compose-file/
- **Best Practices:** https://docs.docker.com/develop/development-best-practices/
- **Next.js Docker:** https://nextjs.org/docs/deployment/docker

---

## ✅ Verification Checklist

- ✅ Docker and Docker Compose installed
- ✅ Port 3000, 27017, 8081 are available
- ✅ 2GB+ free disk space
- ✅ `.env.local` file created from `.env.example`
- ✅ All services show "healthy" in `docker compose ps`
- ✅ Application accessible at http://localhost:3000
- ✅ Database UI accessible at http://localhost:8081

---

## 📞 Need Help?

- Check logs: `docker compose logs -f`
- View services: `docker compose ps`
- Rebuild: `docker compose up -d --build`
- Reset: `docker compose down -v && docker compose up -d`

---

**Last Updated:** 2024  
**Docker Version:** 20.10+  
**Docker Compose Version:** 2.0+  
**Status:** Production-Ready ✅
