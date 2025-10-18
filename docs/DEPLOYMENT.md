# 📦 LaudraTrack Deployment Guide

This guide covers deploying the LaudraTrack frontend to production using various platforms.

---

## 🚀 Quick Start

### 1. Local Development
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### 2. Production Build
```bash
npm run build
npm start
# Visit http://localhost:3000
```

---

## ☁️ Deployment Options

### Option 1: Vercel (RECOMMENDED)

**Why Vercel?**
- ✅ Built specifically for Next.js
- ✅ Zero-config deployment
- ✅ Automatic scaling
- ✅ Free tier available
- ✅ Edge functions support

**Steps:**

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Repository**
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - Go to Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=your-backend-url
     NEXTAUTH_URL=your-vercel-url
     NEXTAUTH_SECRET=generate-strong-secret
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### Option 2: Netlify

**Steps:**

1. Create [Netlify](https://netlify.com) account
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Add environment variables
6. Deploy

---

### Option 3: Railway

**Steps:**

1. Create [Railway](https://railway.app) account
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set environment variables
5. Deploy

---

### Option 4: Docker + Cloud (AWS, GCP, Azure, DigitalOcean)

**Build Docker Image:**
```bash
docker build -t laudratrack-frontend:latest .
```

**Run Locally:**
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  laudratrack-frontend:latest
```

**Push to Docker Hub:**
```bash
# Login to Docker Hub
docker login

# Tag image
docker tag laudratrack-frontend:latest yourusername/laudratrack-frontend:latest

# Push
docker push yourusername/laudratrack-frontend:latest
```

**Deploy with Docker Compose:**
```bash
docker-compose up -d
```

---

## 🔐 Environment Variables for Production

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-secret-key-here
```

### Security Tips
- ✅ Use strong NEXTAUTH_SECRET (use `openssl rand -base64 32`)
- ✅ Never commit `.env` files
- ✅ Rotate secrets regularly
- ✅ Use HTTPS only
- ✅ Enable CORS properly on backend

---

## 📊 Monitoring & Analytics

### Vercel Analytics
- Built-in Web Vitals tracking
- Performance metrics dashboard
- Error tracking

### Setup Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
```

Create `next.config.js`:
```javascript
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  { /* ... */ },
  {
    org: "your-org",
    project: "laudratrack",
    authToken: process.env.SENTRY_AUTH_TOKEN,
  }
);
```

---

## ✅ Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Code tested locally
- [ ] ESLint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Backend API is running
- [ ] Database is configured
- [ ] HTTPS enabled
- [ ] Domain configured
- [ ] Monitoring setup (Sentry)
- [ ] Backup strategy ready

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### API Connection Issues
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is running
- Check CORS configuration
- Test API endpoints manually

### NextAuth Issues
- Verify `NEXTAUTH_URL` matches deployment URL
- Generate new `NEXTAUTH_SECRET`
- Check session provider is wrapped in layout
- Verify callbacks are configured

---

## 📞 Deployment Support

| Platform | Time | Cost | Support |
|----------|------|------|---------|
| Vercel | <2 min | Free (with limits) | ⭐⭐⭐⭐⭐ |
| Netlify | <2 min | Free (with limits) | ⭐⭐⭐⭐ |
| Railway | <5 min | Starting $5/mo | ⭐⭐⭐⭐ |
| Docker | 10-30 min | Varies | ⭐⭐⭐ |

---

## 🎯 Next Steps

1. **Deploy Frontend** to Vercel
2. **Build Backend API** (Node.js + Express)
3. **Deploy Backend** to Railway/Render
4. **Connect Frontend ↔ Backend**
5. **Setup CI/CD Pipeline** (GitHub Actions)
6. **Monitor Performance** (Sentry)
7. **Scale as Needed**

---

**Questions?** Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)