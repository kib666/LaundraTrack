# LaudraTrack Setup Guide

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd LaudraTrack

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Edit .env.local with your settings
# - Set MONGODB_URI to your MongoDB connection string
# - Update API URLs for your environment

# 5. Start development server
npm run dev
```

Access the application at: `http://localhost:3000`

---

## 📋 Environment Configuration

### Required Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/laudratrack

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-string-32-chars-minimum>
JWT_SECRET=<random-string-32-chars-minimum>
JWT_EXPIRE=7d

# Environment
NODE_ENV=development
```

### Generate Secrets

```bash
# Generate secure secrets
openssl rand -base64 32
```

---

## 🗄️ Database Setup

### MongoDB Atlas (Cloud - Recommended)

1. Create account at [mongodb.com](https://mongodb.com)
2. Create a new cluster
3. Create database user with strong password
4. Add your IP to IP whitelist
5. Get connection string and add to `.env.local`

### MongoDB Local

```bash
# Install MongoDB (if not already installed)
# Then start MongoDB service

# Test connection
mongo
```

---

## 🔑 Initial Setup

### 1. Create Admin User

```bash
npm run scripts/create-admin.js
```

Follow the prompts to create your first admin account.

### 2. Create Staff Users

```bash
npm run scripts/create-staff.js
```

---

## 🏗️ Project Structure

```
LaudraTrack/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and management
│   ├── api/               # API routes (backend)
│   ├── customer/          # Customer portal
│   ├── staff/             # Staff dashboard
│   └── layout.js          # Root layout
├── components/            # Reusable React components
│   ├── admin/            # Admin-specific components
│   ├── common/           # Shared components
│   ├── customer/         # Customer-specific components
│   └── staff/            # Staff-specific components
├── hooks/                # Custom React hooks
│   ├── useApi.js         # API data fetching
│   ├── useAuth.js        # Authentication state
│   └── useForm.js        # Form state management
├── lib/                  # Utilities and helpers
│   ├── api/              # API client and services
│   ├── auth/             # Authentication logic
│   ├── db/               # Database models
│   ├── formatters.js     # Data formatting utilities
│   ├── validators.js     # Input validation
│   └── constants.js      # App constants
├── scripts/              # Utility scripts
│   ├── create-admin.js
│   ├── create-staff.js
│   ├── reset-database.js
│   └── ...
├── public/               # Static assets
├── styles/               # CSS modules
├── docs/                 # Documentation
└── package.json          # Dependencies
```

---

## 👥 User Roles

### Admin

- Full system access
- Manage users (create, edit, delete)
- View all orders
- Generate reports
- Dashboard analytics

### Staff

- Manage assigned orders
- Update order status
- View order details
- Must be approved by admin

### Customer

- View own orders
- Create new orders
- Track deliveries
- Edit order details

---

## 🧪 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests (if configured)
npm test
```

---

## 🔄 Database Reset

To clear all data except admin users:

```bash
npm run scripts/reset-database.js
```

**Warning:** This will delete all orders and non-admin users.

---

## 🐛 Debugging

### View Session Info

The application stores session data in browser local storage. To check:

1. Open Browser DevTools (F12)
2. Go to Application → Cookies
3. Look for `next-auth.session-token`

### Check API Calls

1. Open Network tab in DevTools
2. Look for calls to `/api/*` endpoints
3. Check request/response headers and body

### MongoDB Connection

```bash
# Test connection in Node.js shell
node
> require('mongoose').connect('your-mongodb-uri')
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## ❓ Troubleshooting

### Port 3000 Already in Use

```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### MongoDB Connection Failed

- Verify MongoDB is running
- Check connection string in `.env.local`
- Verify IP whitelist (if using MongoDB Atlas)

### NextAuth Not Working

- Clear browser cookies
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches current domain

---

## 📞 Need Help?

1. Check the `/docs` folder for more documentation
2. Review API endpoint definitions in `/app/api`
3. Check component props in `/components`
