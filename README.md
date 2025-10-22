# 🧺 LaudraTrack - Professional Laundry Management System

> A comprehensive laundry tracking and management platform designed for businesses and customers. Features real-time order tracking, staff management, analytics, and seamless appointment booking. Built with Next.js 14, React 18, MongoDB, and modern DevOps practices.
>
> **Course Project:** Technopreneurship (LaundraTrack Team)

## 📋 Table of Contents

- [Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start with Docker](#-quick-start-with-docker)
- [📋 Prerequisites](#-prerequisites)
- [🔧 Installation & Setup](#-installation--setup)
- [🎯 Running the Application](#-running-the-application)
- [📁 Project Structure](#-project-structure)
- [🌍 Environment Variables](#-environment-variables)
- [🐳 Docker Guide](#-docker-guide)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)
- [📄 License](#-license)

---

## 📌 Overview

LaudraTrack is a full-stack laundry management system that streamlines operations for businesses and enhances the customer experience. The platform provides three distinct portals with role-based access control:

- **Admin Portal:** Complete business management with analytics and staff oversight
- **Customer Portal:** Intuitive order tracking and appointment booking
- **Staff Portal:** Task management and real-time delivery tracking

The system is containerized with Docker for easy deployment across any environment and includes built-in MongoDB integration with Mongo Express for database management.

---

## ✨ Features

### 👤 Customer Portal

- 📦 **Real-time Order Tracking** – Live status updates on laundry orders
- 📅 **Appointment Booking** – Schedule pickup and delivery times
- 🔐 **Secure Authentication** – NextAuth.js powered login system
- 💰 **Order History** – View past orders and pricing information
- 📱 **Responsive Design** – Works seamlessly on mobile and desktop

### 👨‍💼 Admin Portal

- 📊 **Revenue Analytics** – Dashboard with key business metrics
- 👥 **User Management** – Create, edit, and manage user accounts
- 📋 **Order Management** – Full CRUD operations on all orders
- 📅 **Calendar View** – Visual appointment scheduling and management
- 📈 **Business Reports** – Detailed insights and performance metrics
- ✅ **Staff Approvals** – Review and approve staff registrations

### 🚚 Staff Portal

- ✅ **Task Management** – View assigned orders and deliveries
- 📍 **Status Updates** – Update order status in real-time
- 📝 **Daily Operations** – Track daily workflows and completed tasks
- ⏱️ **Workload Efficiency** – Monitor task completion rates

---

## 🛠️ Tech Stack

| Category           | Technology                                       |
| ------------------ | ------------------------------------------------ |
| **Frontend**       | Next.js 14+, React 18, TypeScript                |
| **Styling**        | Tailwind CSS 3.4, Lucide Icons                   |
| **Authentication** | NextAuth.js 4.24, JWT                            |
| **API Client**     | Axios, React Hooks                               |
| **Backend API**    | Next.js Route Handlers (built-in)                |
| **Database**       | MongoDB 7.0, Mongoose ODM                        |
| **Database UI**    | Mongo Express 1.0 (development)                  |
| **Runtime**        | Node.js 18 Alpine (optimized for containers)     |
| **DevOps**         | Docker, Docker Compose                           |
| **Deployment**     | Vercel, Docker, Self-hosted (via Docker Compose) |

---

## 🚀 Quick Start with Docker

The fastest way to get LaudraTrack running on your machine!

### Prerequisites for Docker

- **Docker** – [Download & Install](https://docs.docker.com/get-docker/)
- **Docker Compose** – Usually included with Docker Desktop
- **Git** – For cloning the repository
- ~2GB free disk space for MongoDB and Node.js images

### 1️⃣ Verify Docker Installation

```bash
docker --version
docker compose --version
```

### 2️⃣ Clone & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/laudratrack.git
cd laudratrack

# Copy environment template
cp .env.example .env.local
```

### 3️⃣ Build and Start Services

```bash
# Build Docker image and start all services
docker compose up -d

# First time? This may take 2-3 minutes while downloading images and building the app
```

### 4️⃣ Access the Application

Once services are running, access:

| Service         | URL                   | Access                         |
| --------------- | --------------------- | ------------------------------ |
| **Application** | http://localhost:3000 | Main LaudraTrack application   |
| **Database UI** | http://localhost:8081 | Mongo Express (admin/password) |

### 5️⃣ View Logs

```bash
# See all service logs
docker compose logs -f

# See specific service logs
docker compose logs -f app
docker compose logs -f mongo
```

### 6️⃣ Stop Services

```bash
# Stop all services (data persists)
docker compose down

# Stop and remove all data
docker compose down -v
```

### Default Credentials

**Mongo Express (Database UI):**

- URL: http://localhost:8081
- Username: `admin`
- Password: `password`

**MongoDB (Direct Connection):**

- Host: `localhost:27017`
- Username: `admin`
- Password: `password123`
- Database: `laudratrack`

---

## 📋 Prerequisites (Local Development)

For non-Docker development, ensure you have:

- **Node.js** (v18.17.0 or higher) – [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB** (v7.0+) – [Download](https://www.mongodb.com/try/download/community) or use Docker
- **Git** for version control
- A modern web browser

**Verify installation:**

```bash
node --version      # Should be v18+
npm --version       # Should be 9+
git --version       # Any recent version
```

---

## 🔧 Installation & Setup

### Option 1: Docker (Recommended)

See [Quick Start with Docker](#-quick-start-with-docker) section above.

### Option 2: Local Development Setup

#### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/laudratrack.git
cd laudratrack
```

#### Step 2: Install Dependencies

```bash
npm install
```

Or with yarn:

```bash
yarn install
```

#### Step 3: Setup Environment Variables

```bash
# Copy example file
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database (update with your MongoDB connection)
MONGODB_URI=mongodb://admin:password123@localhost:27017/laudratrack?authSource=admin

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production

# JWT
JWT_SECRET=your-jwt-secret-change-in-production
JWT_EXPIRE=7d

# Environment
NODE_ENV=development
```

#### Step 4: Start MongoDB

**Using Docker (recommended):**

```bash
docker run -d \
  --name laudratrack-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:7.0-alpine
```

**Or install locally:** [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

#### Step 5: Run Development Server

```bash
npm run dev
```

Application will be available at **http://localhost:3000**

---

## 🎯 Running the Application

### Development Mode

```bash
npm run dev
```

The app will watch for file changes and auto-reload.

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Code Quality Commands

```bash
# Check linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Type checking
npm run type-check
```

---

## 🌍 Environment Variables

### Required Variables

| Variable              | Description                                    | Example                                      |
| --------------------- | ---------------------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Frontend API endpoint                          | `http://localhost:3000/api`                  |
| `MONGODB_URI`         | MongoDB connection string                      | `mongodb://user:pass@host:27017/laudratrack` |
| `NEXTAUTH_URL`        | NextAuth authentication URL                    | `http://localhost:3000`                      |
| `NEXTAUTH_SECRET`     | Secret key for NextAuth (change in production) | Generate with: `openssl rand -base64 32`     |
| `JWT_SECRET`          | JWT signing secret                             | Generate with: `openssl rand -base64 32`     |
| `JWT_EXPIRE`          | JWT token expiration                           | `7d`                                         |

### Optional Variables

| Variable               | Description                                   |
| ---------------------- | --------------------------------------------- |
| `NODE_ENV`             | Environment mode (development/production)     |
| `GITHUB_ID`            | GitHub OAuth client ID (if using GitHub auth) |
| `GITHUB_SECRET`        | GitHub OAuth secret                           |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                        |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret                           |

### Generating Secure Secrets

```bash
# On macOS/Linux/Windows (Git Bash)
openssl rand -base64 32
```

Or use online tools:

- https://generate-secret.vercel.app/32
- https://1password.com/password-generator/

---

## 🐳 Docker Guide

### Docker Architecture

The `docker-compose.yml` orchestrates three services:

1. **app** – Next.js application (port 3000)
2. **mongo** – MongoDB database (port 27017)
3. **mongo-express** – Database management UI (port 8081)

### Build Docker Image

```bash
# Build image from Dockerfile
docker build -t laudratrack:latest .

# Build with specific target
docker build -t laudratrack:dev --target builder .
docker build -t laudratrack:prod --target runtime .
```

### Using Docker Compose

```bash
# Start all services in detached mode
docker compose up -d

# Start with specific service
docker compose up app

# Rebuild image and start
docker compose up -d --build

# View services status
docker compose ps

# Check service health
docker compose ps --format "{{.Service}}\t{{.Status}}"
```

### Container Management

```bash
# Execute command in running container
docker compose exec app npm run lint

# View application logs
docker compose logs app --follow

# Access MongoDB shell
docker compose exec mongo mongosh -u admin -p password123

# Backup MongoDB data
docker compose exec mongo mongodump --uri="mongodb://admin:password123@localhost:27017/laudratrack?authSource=admin" --out=/backup
```

### Database Management

Access Mongo Express at **http://localhost:8081**:

- Create and manage databases
- View, edit, and delete documents
- Run aggregation pipelines
- Import/export data

### Production Deployment with Docker

```bash
# Create .env.production with production values
NEXTAUTH_SECRET=<secure-random-string>
JWT_SECRET=<secure-random-string>
MONGODB_URI=<production-database-uri>
NEXTAUTH_URL=<production-url>

# Build production image
docker build -t laudratrack:v1.0.0 --target runtime .

# Push to registry (e.g., Docker Hub)
docker tag laudratrack:v1.0.0 yourusername/laudratrack:v1.0.0
docker push yourusername/laudratrack:v1.0.0

# Deploy using docker-compose.prod.yml
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Troubleshooting Docker

```bash
# Clear all Docker data (careful!)
docker system prune -a

# Check Docker image size
docker images laudratrack

# Inspect running container
docker inspect laudratrack-app

# Check container resource usage
docker stats laudratrack-app
```

---

## 📁 Project Structure

```
LaudraTrack/
│
├── 📂 app/                            # Next.js App Router (Server & Client)
│   ├── page.js                        # Landing page
│   ├── layout.js                      # Root layout with providers
│   ├── globals.css                    # Global styles
│   │
│   ├── 📂 admin/                      # Admin Portal
│   │   ├── page.js                    # Dashboard overview
│   │   ├── layout.js                  # Admin layout with sidebar
│   │   ├── 📂 users/                  # User management
│   │   ├── 📂 orders/                 # Order management
│   │   ├── 📂 calendar/               # Appointment calendar
│   │   └── 📂 reports/                # Analytics & reports
│   │
│   ├── 📂 customer/                   # Customer Portal
│   │   └── page.js                    # Customer dashboard
│   │
│   ├── 📂 staff/                      # Staff Portal
│   │   └── page.js                    # Staff operations
│   │
│   └── 📂 api/                        # API Routes (Route Handlers)
│       ├── 📂 auth/                   # Authentication endpoints
│       ├── 📂 admin/                  # Admin endpoints
│       ├── 📂 orders/                 # Order endpoints
│       ├── 📂 staff/                  # Staff endpoints
│       └── 📂 appointments/           # Appointment endpoints
│
├── 📂 components/                     # Reusable React Components
│   ├── 📂 admin/                      # Admin-specific components
│   │   ├── Sidebar.js
│   │   ├── OrdersTable.js
│   │   ├── OrderForm.js
│   │   ├── EditOrderForm.js
│   │   ├── OrderCalendarView.js
│   │   └── UserForm.js
│   │
│   ├── 📂 customer/                   # Customer-specific components
│   │   ├── OrderLookupForm.js
│   │   ├── EditOrderModal.js
│   │   └── StatusProgressTracker.js
│   │
│   ├── 📂 staff/                      # Staff-specific components
│   │   ├── OrderCardMenu.js
│   │   └── Sidebar.js
│   │
│   └── 📂 common/                     # Shared components
│       ├── SessionProvider.js
│       ├── Modal.js
│       ├── StatusBadge.js
│       ├── PortalAuthModal.js
│       ├── UserProfileDropdown.js
│       ├── ManilaLiveClock.js
│       └── OrderTimestampDisplay.js
│
├── 📂 hooks/                          # Custom React Hooks
│   ├── useAuth.js                     # Authentication state
│   ├── useApi.js                      # API data fetching
│   ├── useForm.js                     # Form state management
│   └── index.js                       # Central export
│
├── 📂 lib/                            # Utilities & Services
│   ├── 📂 api/                        # API Services
│   │   ├── apiClient.js               # Axios instance
│   │   ├── authService.js             # Auth API
│   │   └── orderService.js            # Order API
│   │
│   ├── 📂 auth/                       # Authentication
│   │   ├── authOptions.js             # NextAuth config
│   │   ├── jwt.js                     # JWT helpers
│   │   └── middleware.js              # Auth middleware
│   │
│   ├── 📂 db/                         # Database
│   │   ├── models.js                  # Mongoose schemas
│   │   └── mongodb.js                 # Connection setup
│   │
│   ├── formatters.js                  # Data formatting
│   ├── validators.js                  # Input validation
│   ├── constants.js                   # App constants
│   ├── data.js                        # Mock/seed data
│   └── index.js                       # Central export
│
├── 📂 scripts/                        # Utility Scripts
│   ├── create-admin.js                # Create admin user
│   ├── create-staff.js                # Create staff user
│   ├── create-superadmin.js           # Create superadmin
│   ├── reset-database.js              # Clear database
│   ├── verify-admin.js                # Verify admin access
│   ├── add-multiple-admins.js         # Bulk admin creation
│   ├── test-login.js                  # Test login flow
│   └── dev.js                         # Dev server wrapper
│
├── 📂 public/                         # Static Assets
│   ├── 📂 images/
│   │   └── laundra-track-logo.png
│   └── 📂 icons/
│
├── 📂 docs/                           # Documentation
│   ├── SETUP.md                       # Installation guide
│   ├── ARCHITECTURE.md                # System design
│   ├── COMPREHENSIVE_GUIDE.md         # Full reference
│   ├── CONTRIBUTING.md                # Development guidelines
│   ├── DEPLOYMENT.md                  # Production deployment
│   └── SUPERADMIN_SETUP.md            # Advanced configuration
│
├── 📂 styles/                         # CSS Modules
│   └── components.module.css
│
├── 📂 .zencoder/                      # Zencoder Configuration
│   └── 📂 rules/
│       └── repo.md                    # Repository guidelines
│
├── 📂 .vscode/                        # VS Code Configuration
├── 📂 .vercel/                        # Vercel Configuration
├── 📂 .github/                        # GitHub Configuration
│   └── 📂 workflows/
│       └── deploy.yml                 # CI/CD Pipeline
│
├── Configuration Files
│   ├── Dockerfile                     # Production container build
│   ├── docker-compose.yml             # Multi-service orchestration
│   ├── .dockerignore                  # Docker build exclusions
│   ├── .env.example                   # Environment template
│   ├── .env.local                     # Development (local)
│   ├── .env.production                # Production settings
│   ├── next.config.js                 # Next.js configuration
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── tsconfig.json                  # TypeScript config
│   ├── .eslintrc.json                 # ESLint rules
│   ├── .prettierrc.json               # Code formatting
│   └── package.json                   # Dependencies & scripts
│
└── Documentation
    ├── README.md                      # GitHub repository overview (this file)
    ├── START_HERE.md                  # Quick start guide (5 min)
    └── vercel.json                    # Vercel deployment config
```

### Directory Descriptions

| Directory       | Purpose                                         |
| --------------- | ----------------------------------------------- |
| **app/**        | Next.js routes and layouts (App Router)         |
| **api/**        | Backend API route handlers (internal routes)    |
| **components/** | Reusable React components organized by role     |
| **hooks/**      | Custom React hooks for shared logic             |
| **lib/**        | Utility functions, services, and configurations |
| **scripts/**    | Node.js scripts for development and maintenance |
| **docs/**       | Comprehensive project documentation             |
| **public/**     | Static files served at root path                |
| **styles/**     | CSS modules for component styling               |

---

## 📚 Documentation

Comprehensive guides are available in the `/docs` folder:

- **[START_HERE.md](START_HERE.md)** – 5-minute quick start guide
- **[docs/SETUP.md](docs/SETUP.md)** – Installation & initial setup (15 min)
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** – System design & data flow (30 min)
- **[docs/COMPREHENSIVE_GUIDE.md](docs/COMPREHENSIVE_GUIDE.md)** – Complete API reference (60 min)
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** – Development standards & guidelines
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** – Production deployment strategies (30 min)
- **[docs/SUPERADMIN_SETUP.md](docs/SUPERADMIN_SETUP.md)** – Advanced configuration (20 min)

---

## 🚀 Deployment

### Option 1: Vercel (Recommended for Frontend)

Vercel provides optimal Next.js performance and auto-scaling.

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Deploy LaudraTrack"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import your repository
   - Click "Deploy"

3. **Configure Environment Variables**
   - Go to Settings → Environment Variables
   - Add all variables from `.env.production`:
     ```
     NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api
     NEXTAUTH_URL=https://your-app.vercel.app
     NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
     MONGODB_URI=<your-production-mongodb-uri>
     JWT_SECRET=<generate with: openssl rand -base64 32>
     JWT_EXPIRE=7d
     ```

### Option 2: Docker Deployment

Deploy using Docker Compose to any server:

1. **Build & Push Image**

   ```bash
   docker build -t your-registry/laudratrack:v1.0.0 .
   docker push your-registry/laudratrack:v1.0.0
   ```

2. **Create Production Compose File**

   ```bash
   cp docker-compose.yml docker-compose.prod.yml
   ```

3. **Deploy**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

### Option 3: Other Hosting Platforms

- **Railway** – Zero-config Next.js + MongoDB deployment
- **Render** – Simple, managed deployment platform
- **Netlify** – Supports Next.js 14 deployment
- **Self-hosted** – Use Docker Compose on any Linux server

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

---

## 📞 Support

**Questions or Issues?**

- 📧 **Email:** mikplacencia@tip.edu.ph
- 📱 **Phone:** +639123456789
- 📍 **Location:** Manila, Philippines
- 🐛 **GitHub Issues:** Create an issue for bugs or feature requests
- 💬 **Discussions:** Use GitHub Discussions for Q&A

---

## 📄 License

This project is private and created for educational purposes as part of the TIP coursework in Technopreneurship.

---

## 👥 Contributors

- **LaundraTrack Team** – Laundry Management System
- **Course:** Technopreneurship (TIP)
- **Year:** 2025

---

## 🎯 Roadmap

- ✅ Core platform MVP
- ✅ Docker containerization
- 🔄 Enhanced analytics dashboard
- 🔄 Mobile app (React Native)
- 📋 SMS notifications
- 📋 Email alerts
- 📋 Advanced reporting
- 📋 Machine learning insights

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for robust database support
- The open-source community for excellent tools

---

**Last Updated:** 2025 October
**Status:** ✅ Production-Ready  
**Version:** 1.0.0
