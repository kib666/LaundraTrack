# 🔧 Complete Setup Guide

Comprehensive setup instructions for LaudraTrack frontend.

---

## 📦 What's Included

✅ All necessary configuration files  
✅ Development environment ready  
✅ Production-ready build setup  
✅ Docker containerization  
✅ GitHub Actions CI/CD  
✅ Deployment configurations  

---

## 🎯 Installation Steps

### 1. **Install Node.js**

Download from: https://nodejs.org/ (v18 or higher)

**Verify installation:**
```bash
node --version
npm --version
```

### 2. **Navigate to Project**

```bash
cd c:\Users\63926\Documents\VS CODE\LaudraTrack
```

### 3. **Install Dependencies**

```bash
npm install
```

**What gets installed:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- NextAuth
- Lucide React
- Axios
- ESLint & Prettier
- Dev tools

**Installation time:** 2-5 minutes

### 4. **Verify Installation**

```bash
npm run build
```

If successful, you should see:
```
✓ Compiled client and server successfully
```

---

## 🚀 Running the Application

### Development Mode (Recommended for Development)

```bash
npm run dev
```

**Features:**
- 🔄 Hot reload on file changes
- 🐛 Debug information in console
- 📊 Detailed error messages
- 🔍 Source maps for debugging

**Access at:** http://localhost:3000

### Production Mode

```bash
npm run build
npm start
```

**Features:**
- ⚡ Optimized performance
- 📉 Smaller bundle size
- 🔒 Production errors hidden
- 🚀 Ready for deployment

---

## 📁 Project Structure Explained

```
laudratrack/
├── app/                      # Next.js App Router
│   ├── page.js              # Landing page (/)
│   ├── layout.js            # Root layout wrapper
│   ├── globals.css          # Global styles
│   ├── admin/               # Admin dashboard (/admin)
│   ├── customer/            # Customer portal (/customer)
│   └── staff/               # Staff portal (/staff)
│
├── components/              # Reusable React components
│   ├── admin/               # Admin-specific components
│   ├── customer/            # Customer-specific components
│   ├── staff/               # Staff-specific components
│   └── common/              # Shared components
│
├── lib/
│   └── data.js              # Mock data for testing
│
├── public/                  # Static files (images, icons)
│
├── Configuration Files:
├── package.json             # Dependencies
├── next.config.js           # Next.js settings
├── tailwind.config.js       # Tailwind CSS settings
├── tsconfig.json            # TypeScript settings
├── .eslintrc.json           # ESLint rules
├── .prettierrc.json         # Code formatting
├── postcss.config.js        # CSS processing
│
├── Environment Files:
├── .env.local               # Development variables
├── .env.example             # Template for production
│
├── Docker Files:
├── Dockerfile               # Docker image build
├── docker-compose.yml       # Multi-container setup
├── .dockerignore            # Files to exclude
│
├── CI/CD Files:
├── .github/workflows/       # GitHub Actions
├── vercel.json             # Vercel deployment config
│
├── Documentation:
├── README.md               # Main documentation
├── QUICKSTART.md           # Quick start guide (2 min)
├── SETUP.md                # This file
├── DEPLOYMENT.md           # Deployment guide
└── .gitignore              # Git ignore rules
```

---

## 🔌 Environment Variables

**Development (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-in-production-12345
```

**Production (set in Vercel/hosting):**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secure-random-secret
```

---

## 🛠️ Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types |

---

## 🐳 Docker Setup

### Build Docker Image

```bash
docker build -t laudratrack-frontend:latest .
```

### Run with Docker

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  laudratrack-frontend:latest
```

### Run with Docker Compose

```bash
docker-compose up -d
```

**Services started:**
- Frontend (http://localhost:3000)
- Backend placeholder
- MongoDB (http://localhost:27017)
- Mongo Express UI (http://localhost:8081)

**Stop services:**
```bash
docker-compose down
```

---

## 🔐 Security Setup

### Generate Secure NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and update:
- `.env.local` (development)
- Vercel environment variables (production)

### Enable HTTPS

For production deployment, ensure:
- ✅ HTTPS enabled on domain
- ✅ Certificate valid and up-to-date
- ✅ Redirect HTTP → HTTPS

---

## 📊 VS Code Extensions (Recommended)

Install these for better development experience:

1. **ESLint** - Code quality
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - CSS suggestions
4. **TypeScript Vue Plugin** - Type hints
5. **Thunder Client** - API testing
6. **Thunder Client** - REST API testing

Files are configured in `.vscode/extensions.json`

---

## 🚀 Deployment Checklist

Before deploying, verify:

- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] All environment variables set
- [ ] Backend API URL configured
- [ ] NEXTAUTH_SECRET is strong
- [ ] HTTPS enabled
- [ ] Domain configured
- [ ] Monitoring setup (Sentry)
- [ ] Backups planned

---

## 🚨 Troubleshooting

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
rm -rf .next
npm run build
```

### NextAuth not working
- Check `.env.local` has correct values
- Verify `NEXTAUTH_SECRET` is set
- Ensure `NEXTAUTH_URL` matches deployment URL

### API connection fails
- Check backend is running
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS is enabled on backend
- Test endpoint with Postman/curl

---

## 📚 Learning Resources

### Official Docs
- [Next.js 14 Docs](https://nextjs.org/docs)
- [React 18 Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [NextAuth Docs](https://next-auth.js.org)

### Video Tutorials
- Next.js by Vercel (YouTube)
- React Tutorial (Scrimba)
- Tailwind CSS Tutorial (YouTube)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [React Subreddit](https://reddit.com/r/reactjs)
- Stack Overflow

---

## 🎯 Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Visit http://localhost:3000
4. ⏭️ Build backend API
5. Connect frontend ↔ backend
6. Deploy to Vercel

---

## 💬 Support

**Issues?** Create a GitHub issue with:
- Error message
- Steps to reproduce
- Your environment (Node version, OS, etc.)

**Questions?** Check the README.md or DEPLOYMENT.md

---

**Happy Coding! 🚀**

Last Updated: 2024  
Status: ✅ Ready to Run