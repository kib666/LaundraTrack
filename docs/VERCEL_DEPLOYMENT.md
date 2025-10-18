# 🚀 LaudraTrack - Complete Vercel Deployment Guide

## Overview

Deploy **LaudraTrack** to Vercel with both frontend and backend (API routes) in a single project. MongoDB is hosted on Atlas (cloud).

---

## ✅ Prerequisites

1. ✓ GitHub account (for code hosting)
2. ✓ Vercel account (free tier works)
3. ✓ MongoDB Atlas account (free tier works)
4. ✓ All dependencies installed (`npm install`)

---

## 🗃️ Step 1: Setup MongoDB Atlas

### 1. Create Cluster
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Login
3. Click "Create" → New Project
4. Click "Create a Deployment"
5. Choose "FREE" tier
6. Select AWS, closest region
7. Click "Create Deployment"

### 2. Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username & password
4. Give permission to "Read and write to any database"
5. Click "Create Database User"

**Save credentials!**
```
Username: admin
Password: your_secure_password
```

### 3. Get Connection String
1. Go to "Databases"
2. Click "Connect"
3. Choose "Drivers"
4. Copy connection string:
```
mongodb+srv://admin:your_secure_password@cluster.mongodb.net/?retryWrites=true&w=majority
```

Update to use database name:
```
mongodb+srv://admin:your_secure_password@cluster.mongodb.net/laudratrack?retryWrites=true&w=majority
```

### 4. Whitelist IPs
1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Add "0.0.0.0/0" (not recommended for production)
4. For production: Add Vercel IPs (shown in Vercel docs)

---

## 🔑 Step 2: Generate Secrets

Open terminal and generate secure keys:

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate NextAuth Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save these values - you'll need them for Vercel.

---

## 📝 Step 3: Update Environment Variables

### Local Development (.env.local)
```env
# Database
MONGODB_URI=mongodb+srv://admin:your_password@cluster.mongodb.net/laudratrack?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_generated_jwt_secret_here
JWT_EXPIRE=7d
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_nextauth_secret_here

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
```

### Production (.env.production)
```env
# Database
MONGODB_URI=mongodb+srv://admin:your_password@cluster.mongodb.net/laudratrack?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_generated_jwt_secret_here
JWT_EXPIRE=7d
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_generated_nextauth_secret_here

# Frontend
NEXT_PUBLIC_API_URL=https://your-app-name.vercel.app/api

# Environment
NODE_ENV=production
```

---

## 🔧 Step 4: Prepare for Deployment

### 1. Update vercel.json
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["sfo1"],
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "JWT_SECRET": "@jwt_secret",
    "JWT_EXPIRE": "7d",
    "NEXTAUTH_URL": "@nextauth_url",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NODE_ENV": "production"
  }
}
```

### 2. Update package.json scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### 3. Test Locally
```bash
npm run build
npm start
```

Visit http://localhost:3000 - should work perfectly

---

## 🔄 Step 5: Deploy to GitHub

### Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Full stack LaudraTrack with backend API"
git branch -M main
git remote add origin https://github.com/yourusername/laudratrack.git
git push -u origin main
```

---

## 🚀 Step 6: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Login with GitHub
3. Click "New Project"
4. Import GitHub repository
5. Select "laudratrack"
6. Click "Import"

### Configure Project

**Project Name:** `laudratrack`  
**Framework:** Next.js  
**Build Settings:** (should auto-detect)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm ci`

### Add Environment Variables

In the "Environment Variables" section, add:

| Key | Value | Environments |
|-----|-------|---|
| MONGODB_URI | `mongodb+srv://admin:password@...` | Production |
| JWT_SECRET | `your_generated_secret` | Production |
| JWT_EXPIRE | `7d` | Production |
| NEXTAUTH_URL | `https://yourapp.vercel.app` | Production |
| NEXTAUTH_SECRET | `your_generated_secret` | Production |
| NODE_ENV | `production` | Production |

**⚠️ Important:** Check "Sensitive" checkbox for secret values

### Deploy
Click "Deploy" button - Vercel will build and deploy automatically!

---

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# When prompted:
# ? Set up and deploy "~/laudratrack"? [Y/n] → Y
# ? Which scope do you want to deploy to? → Select your account
# ? Found vercel.json. Want to use it? [Y/n] → Y
# ? Want to modify the settings before deploying? [Y/n] → Y
```

---

## 🔐 Step 7: Configure Secrets on Vercel

After deployment:

1. Go to Project Settings → Environment Variables
2. Add all secrets one by one:
   - MONGODB_URI
   - JWT_SECRET
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL (with your Vercel domain)
   - etc.

3. Click "Save"
4. Trigger redeploy:
   - Go to "Deployments"
   - Click "..." on latest deployment
   - Select "Redeploy"

---

## ✅ Step 8: Test Deployment

### Frontend
Visit: `https://your-app-name.vercel.app`

Should see landing page ✓

### API Endpoints
Test with curl or Postman:

```bash
# Register
curl -X POST https://your-app-name.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1234567890"
  }'

# Login
curl -X POST https://your-app-name.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

Should return success responses ✓

---

## 🔄 Step 9: Setup Continuous Deployment

Vercel automatically deploys on push to main:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically builds and deploys!
```

Monitor deployments in Vercel Dashboard → Deployments tab

---

## 📊 Step 10: Monitor & Debug

### View Logs
- Vercel Dashboard → Function Logs
- Shows real-time API request logs
- Helps debug issues

### Common Errors

**Error: MongoDB connection failed**
- Check MONGODB_URI
- Verify IP whitelist
- Test locally first

**Error: JWT verification failed**
- Verify JWT_SECRET matches
- Check token expiration
- Try re-login

**Error: CORS issues**
- Already configured in vercel.json
- Check API_URL is correct

**Error: Build failed**
- Check all imports are correct
- Verify all dependencies installed
- Check for TypeScript errors

---

## 🎯 Production Checklist

Before deploying:
- [ ] All dependencies installed
- [ ] No console errors locally
- [ ] Environment variables configured
- [ ] MongoDB Atlas set up and accessible
- [ ] GitHub repository up to date
- [ ] vercel.json properly configured
- [ ] Test all API endpoints locally
- [ ] Generate secure JWT secret
- [ ] Generate secure NextAuth secret

After deployment:
- [ ] Test frontend loads
- [ ] Test user registration
- [ ] Test user login
- [ ] Test staff registration
- [ ] Test admin approval flow
- [ ] Test order creation
- [ ] Test appointment booking
- [ ] Check Vercel logs for errors

---

## 🔐 Security Best Practices

1. **Secrets**: Never commit `.env.local` or secrets to GitHub
   ```bash
   # Add to .gitignore
   .env.local
   .env.production.local
   ```

2. **JWT Secret**: Use strong, random 32-character string
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Database**: Use strong MongoDB password
4. **HTTPS**: Vercel automatically provides SSL
5. **CORS**: Already configured for your domain
6. **Rate Limiting**: Consider adding for production
7. **API Keys**: Store securely in environment variables

---

## 📱 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., laudratrack.com)
4. Follow DNS configuration steps
5. Wait for SSL certificate (usually 24-48 hours)

---

## 💰 Cost Estimate

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | Free | 100GB bandwidth/month |
| MongoDB Atlas | Free | 512MB storage |
| GitHub | Free | Unlimited repos |
| **Total** | **$0/month** | Perfect for testing |

---

## 🚀 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test all features
3. ✅ Share live URL with team
4. ✅ Gather feedback
5. ✅ Add more features
6. ✅ Scale database as needed

---

## 📚 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [JWT.io](https://jwt.io)

---

## ❓ Troubleshooting

### Deployment Failed
```
Check:
1. npm run build succeeds locally
2. All dependencies in package.json
3. No TypeScript errors
4. Vercel build logs for details
```

### API Not Working
```
Check:
1. MONGODB_URI is correct
2. Environment variables set in Vercel
3. API endpoint URL is correct
4. Request headers include Authorization
```

### Database Issues
```
Check:
1. MongoDB Atlas cluster running
2. Network access whitelist correct
3. Database user credentials
4. Connection string format
```

---

## 📞 Support

Having issues?
1. Check Vercel logs: Dashboard → Deployments → Function Logs
2. Check browser console: F12 → Console tab
3. Review API documentation: See BACKEND_API.md
4. Test locally first: npm run dev

---

## 🎉 Congratulations!

Your **LaudraTrack** application is now live on Vercel with:
- ✅ Full-stack application
- ✅ Automated deployments
- ✅ Cloud database
- ✅ Secure authentication
- ✅ User management system
- ✅ Order tracking
- ✅ Staff approval workflow

**Share your app URL with friends and start using it!**

---

**Happy Deploying! 🚀**