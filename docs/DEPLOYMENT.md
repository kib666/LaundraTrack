# LaudraTrack Deployment Guide

## 📦 Deployment Platforms

### Vercel (Recommended for Next.js)

#### Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- MongoDB Atlas cluster (for production)
- GitHub repository linked

#### Deployment Steps

1. **Connect GitHub Repository**

   ```bash
   # Push code to GitHub
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your LaudraTrack repository
   - Click "Import Project"

3. **Configure Environment Variables**
   Set these in Vercel Project Settings → Environment Variables:

   ```
   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/laudratrack
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=<generate-strong-secret>
   JWT_SECRET=<generate-strong-secret>
   JWT_EXPIRE=7d
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build and deployment to complete
   - Vercel will provide your domain URL

#### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records according to Vercel's instructions

---

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Note:** Ensure `.env.local` has production values set.

---

## 🔧 Environment Setup for Production

### 1. Generate Secrets

```bash
# Generate NEXTAUTH_SECRET (24+ character random string)
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

### 2. Database Configuration

- Use MongoDB Atlas for production (not local MongoDB)
- Create separate production database
- Enable IP whitelist for security

### 3. API URL Configuration

- Update `NEXT_PUBLIC_API_URL` to your production domain
- Ensure HTTPS is enabled

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables set in deployment platform
- [ ] Database connection tested in production environment
- [ ] Authentication (NextAuth) configured with production secrets
- [ ] HTTPS enabled and SSL certificate valid
- [ ] API rate limiting configured
- [ ] Error logging/monitoring setup (optional but recommended)
- [ ] Backups configured for database
- [ ] CORS properly configured for production domain

---

## 🚀 Post-Deployment Verification

```bash
# Test health endpoint
curl https://your-domain/api/auth/login -X GET

# Check database connection
# Login to admin panel and verify data loads

# Test critical flows
# 1. Customer login
# 2. Order creation
# 3. Admin dashboard access
# 4. Staff approvals
```

---

## 🔍 Troubleshooting

### Common Issues

**1. Database Connection Failed**

- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure MONGODB_URI is set in environment variables

**2. NextAuth Errors**

- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear cookies and retry login

**3. API Not Responding**

- Check Vercel build logs for errors
- Verify environment variables are set
- Check API route handlers for issues

**4. Slow Performance**

- Optimize MongoDB indexes
- Enable caching on Vercel
- Review and optimize data fetching logic

---

## 📊 Monitoring & Maintenance

### Recommended Tools

- **Monitoring:** Vercel Analytics, Sentry for error tracking
- **Logging:** Winston or Pino for structured logs
- **Database:** MongoDB Atlas monitoring dashboard

### Regular Tasks

- Review error logs weekly
- Monitor database size and optimize queries
- Update dependencies monthly
- Backup MongoDB database regularly

---

## 🔐 Security Checklist

- [ ] All secrets in environment variables (never in code)
- [ ] HTTPS enabled
- [ ] Database credentials not exposed
- [ ] JWT secrets are strong and unique
- [ ] CORS configured for trusted domains only
- [ ] Rate limiting on API routes
- [ ] Input validation on all forms

---

## 📞 Support

For deployment issues:

1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Review MongoDB connection settings
4. Check browser console for frontend errors
