# 🚀 START HERE - LaudraTrack Quick Start Guide

Welcome to **LaudraTrack** - A professional laundry management system built with Next.js 14, React, and MongoDB.

This guide will get you started quickly. For comprehensive information, see the documentation files below.

---

## 🎯 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env.local
# Update .env.local with your values
```

### 3. Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 📚 Documentation

### Essential Guides

1. **[COMPREHENSIVE_GUIDE.md](./docs/COMPREHENSIVE_GUIDE.md)** - Complete reference guide
   - Setup instructions
   - Project structure
   - Running commands
   - API endpoints
   - Environment configuration
   - Deployment guide

2. **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System design & technical details
   - High-level architecture
   - Data flow diagrams
   - Component architecture
   - API design
   - Database schema
   - Security architecture

3. **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** - Development standards & conventions
   - Code style guidelines
   - Naming conventions
   - Component structure
   - Testing requirements
   - Git workflow
   - PR process

---

## 📁 Project Structure

```
LaudraTrack/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # Backend API routes
│   ├── admin/                # Admin portal pages
│   ├── customer/             # Customer portal
│   ├── staff/                # Staff portal
│   ├── page.js               # Landing page
│   └── layout.js             # Root layout
│
├── components/               # React components
│   ├── admin/                # Admin components
│   ├── customer/             # Customer components
│   ├── staff/                # Staff components
│   └── common/               # Shared components
│
├── hooks/                    # Custom React hooks
│   ├── useApi.js
│   ├── useAuth.js
│   ├── useForm.js
│   └── index.js              # Export hub
│
├── lib/                      # Unified utilities
│   ├── index.js              # Central export hub ⭐
│   ├── constants.js
│   ├── formatters.js
│   ├── validators.js
│   ├── data.js
│   ├── api/                  # API services
│   ├── auth/                 # Auth utilities
│   └── db/                   # Database utilities
│
├── styles/                   # Stylesheets
├── public/                   # Static assets
├── scripts/                  # Utility scripts
├── docs/                     # Documentation (3 guides)
└── [config files]
```

---

## 💡 Using Centralized Imports

### Import from @/lib (Recommended)

```javascript
import { formatDate, ROLES, apiClient, useAuth } from '@/lib';
```

### Import from @/hooks

```javascript
import { useApi, useAuth, useForm } from '@/hooks';
```

### Specific File Imports

```javascript
import { formatDate } from '@/lib/formatters';
import authService from '@/lib/api/authService';
```

---

## 🚀 Common Commands

```bash
# Development
npm run dev              # Start dev server

# Build & Test
npm run build            # Build for production
npm run lint             # Check code quality
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript check

# Utilities
node scripts/create-admin.js    # Create admin user
node scripts/create-staff.js    # Create staff user
```

---

## 📊 What's Included

✅ **Complete Next.js 14 Setup** - App Router, React 18  
✅ **Three Portals** - Admin, Customer, Staff  
✅ **MongoDB Integration** - With Mongoose models  
✅ **JWT Authentication** - Secure role-based access  
✅ **Tailwind CSS** - Modern, responsive design  
✅ **API Routes** - Full backend in Next.js  
✅ **Custom Hooks** - Reusable logic (useApi, useAuth, useForm)  
✅ **Development Scripts** - Admin creation, testing utilities

---

## 🔧 Environment Configuration

### Development (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
```

See **COMPREHENSIVE_GUIDE.md** for production configuration.

---

## 📖 Read Next

Based on what you need to do:

| Goal                       | Read This                                   |
| -------------------------- | ------------------------------------------- |
| **Understand the system**  | COMPREHENSIVE_GUIDE.md                      |
| **Learn the architecture** | ARCHITECTURE.md                             |
| **Start development**      | CONTRIBUTING.md                             |
| **Deploy to production**   | COMPREHENSIVE_GUIDE.md → Deployment section |

---

## 🆘 Quick Troubleshooting

| Problem                   | Solution                                |
| ------------------------- | --------------------------------------- |
| Build fails               | `npm run lint:fix` then `npm run build` |
| Styling not working       | Clear cache: `rm -rf .next`             |
| Auth not working          | Check `NEXTAUTH_SECRET` in `.env.local` |
| Database connection error | Verify `MONGODB_URI` is correct         |
| API not found             | Ensure endpoints are in `/app/api/`     |

---

## ✅ Verification Checklist

- [ ] Read this START_HERE.md
- [ ] Check COMPREHENSIVE_GUIDE.md for full setup
- [ ] Run `npm install`
- [ ] Setup `.env.local`
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000
- [ ] Review ARCHITECTURE.md to understand system design
- [ ] Read CONTRIBUTING.md before making changes

---

## 🎯 Next Steps

1. **Install dependencies**: `npm install`
2. **Setup environment**: Copy `.env.example` to `.env.local`
3. **Start development**: `npm run dev`
4. **Read COMPREHENSIVE_GUIDE.md** for detailed setup
5. **Create admin user**: `node scripts/create-admin.js`
6. **Login and explore** the admin/customer/staff portals

---

**Need Help?**

- Read the 3 documentation files in `/docs/`
- Check the project structure guide
- Review code examples in components
- Check console errors for hints

---

**Last Updated**: 2024  
**Status**: ✅ Clean, Optimized & Ready for Development  
**Next.js**: 14+  
**React**: 18+
