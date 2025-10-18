# 🧺 LaudraTrack - Laundry Management System

> Professional laundry tracking and management platform for businesses and customers. A course project for Parallel and Distributed Computing (M1G Team).

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running Locally](#-running-locally)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [API Integration](#-api-integration)
- [Contributing](#-contributing)

---

## ✨ Features

### 👤 Customer Portal

- 📦 Track order status in real-time
- 📅 Book pickup and delivery appointments
- 🔐 Secure user authentication
- 💰 View pricing and order history
- 📱 Mobile-responsive interface

### 👨‍💼 Admin Portal

- 📊 Dashboard with revenue analytics
- 👥 Staff and user management
- 📋 Complete order management
- 📅 Calendar view for appointments
- 📈 Business analytics and reports

### 🚚 Staff Portal

- ✅ View assigned tasks
- 📍 Update delivery status
- 📝 Track daily operations
- ⏱️ Manage workload efficiency

---

## 🛠️ Tech Stack

| Layer              | Technology                       |
| ------------------ | -------------------------------- |
| **Frontend**       | Next.js 14, React 18, TypeScript |
| **Styling**        | Tailwind CSS, Lucide Icons       |
| **Authentication** | NextAuth.js                      |
| **API Client**     | Axios                            |
| **Backend**        | Node.js, Express (to be built)   |
| **Database**       | MongoDB (to be integrated)       |
| **Deployment**     | Vercel (frontend)                |

---

## 📋 Prerequisites

Make sure you have installed:

- **Node.js** (v18.17.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control
- A modern web browser

**Check versions:**

```bash
node --version
npm --version
git --version
```

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/laudratrack.git
cd laudratrack
```

### 2️⃣ Install Dependencies

```bash
npm install
```

Or with yarn:

```bash
yarn install
```

### 3️⃣ Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and update values:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

---

## 🎯 Running Locally

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### Build for Production

```bash
npm run build
npm start
```

### Linting & Formatting

```bash
# Check code quality
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

---

## 🔧 Environment Setup

### `.env.local` - Local Development

```env
# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-in-production
```

### `.env.example` - Template for Production

Copy this file and update with actual production values before deployment.

---

## 📁 Project Structure

```
laudratrack/
├── app/                          # Next.js App Directory
│   ├── page.js                   # Landing page
│   ├── layout.js                 # Root layout
│   ├── globals.css               # Global styles
│   │
│   ├── admin/                    # Admin Portal
│   │   ├── page.js               # Admin dashboard
│   │   ├── layout.js             # Admin layout
│   │   ├── orders/               # Order management
│   │   ├── users/                # User management
│   │   ├── calendar/             # Calendar view
│   │   └── reports/              # Analytics
│   │
│   ├── customer/                 # Customer Portal
│   │   └── page.js               # Customer dashboard
│   │
│   ├── staff/                    # Staff Portal
│   │   └── page.js               # Staff dashboard
│   │
│   └── api/                      # API Routes (connect to backend)
│       └── [route].js            # API endpoints
│
├── components/                   # Reusable Components
│   ├── admin/                    # Admin components
│   │   ├── Sidebar.js
│   │   ├── OrdersTable.js
│   │   ├── OrderForm.js
│   │   ├── EditOrderForm.js
│   │   ├── OrderCalendarView.js
│   │   └── UserForm.js
│   │
│   ├── customer/                 # Customer components
│   │   ├── OrderLookupForm.js
│   │   └── StatusProgressTracker.js
│   │
│   ├── staff/                    # Staff components
│   │   └── Sidebar.js
│   │
│   └── common/                   # Shared components
│       ├── SessionProvider.js    # NextAuth provider
│       ├── Modal.js
│       └── StatusBadge.js
│
├── lib/
│   └── data.js                   # Mock data for development
│
├── public/                       # Static assets
├── package.json                  # Dependencies
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── .eslintrc.json                # ESLint config
├── .env.local                    # Local environment (dev)
├── .env.example                  # Environment template
└── README.md                     # This file
```

---

## 🚀 Deployment

> **Environment Profiles**
>
> - `.env.local` → tuned for LAN testing at `http://192.168.100.112:3000`
> - `.env.production` → tuned for Vercel at `https://laundra-track.vercel.app`
>
> Copy whichever profile you need and restart the dev server after changes.

### Vercel (Recommended for Frontend)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Select this repository
   - Click "Deploy"

3. **Configure Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add production values (match `.env.production`):
     ```
     NEXT_PUBLIC_API_URL=https://laundra-track.vercel.app/api
     NEXTAUTH_URL=https://laundra-track.vercel.app
     NEXTAUTH_SECRET=strong-secret-key
     ```

### Other Hosting Options

- **Netlify** - Similar to Vercel, supports Next.js
- **Railway** - Full-stack deployment
- **Render** - Easy deployment platform

---

## 🔌 API Integration

The frontend is ready to connect to a backend API. Update API endpoints in:

1. **Environment Variables** (`.env.local`)

   ```env
   NEXT_PUBLIC_API_URL=http://your-backend-url
   ```

2. **API Calls** (Example in components)
   ```javascript
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`);
   const data = await response.json();
   ```

### Expected Backend Endpoints

```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
GET    /api/orders                 # Fetch all orders
POST   /api/orders                 # Create new order
GET    /api/orders/:id             # Get order details
PATCH  /api/orders/:id             # Update order
DELETE /api/orders/:id             # Delete order
GET    /api/users                  # Fetch users (admin)
POST   /api/users                  # Create user (admin)
GET    /api/appointments           # Fetch appointments
POST   /api/appointments           # Create appointment
```

---

## 📞 Support

- **Issues?** Create an issue on GitHub
- **Questions?** Contact the M1G team
- **Email:** mamdavid@tip.edu.ph
- **Phone:** +639696438031
- **Location:** Manila, Philippines

---

## 📄 License

This project is private and part of the TIP coursework.

---

## 👥 Contributors

- **M1G Team** - Laundry Management System
- **Course:** Parallel and Distributed Computing

---

## 🎯 Next Steps

- [ ] Build backend API (Node.js + Express)
- [ ] Setup MongoDB database
- [ ] Implement authentication flow
- [ ] Connect frontend to backend
- [ ] Setup CI/CD pipeline
- [ ] Deploy to production
- [ ] Setup monitoring (Sentry)
- [ ] Optimize performance

---

**Last Updated:** 2024  
**Status:** 🚀 Ready for Development
