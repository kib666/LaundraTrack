# LaudraTrack Repository Overview

## Project Status: ✅ CLEAN & OPTIMIZED

**Last Cleanup**: Project structure reorganized, unnecessary documentation removed, dead code eliminated.

---

## 🛠️ Tech Stack

| Component     | Technology                  |
| ------------- | --------------------------- |
| **Framework** | Next.js 14+ with App Router |
| **Language**  | JavaScript (ES6+)           |
| **Styling**   | Tailwind CSS                |
| **Icons**     | lucide-react                |
| **Database**  | MongoDB with Mongoose       |
| **Auth**      | NextAuth.js + JWT           |
| **APIs**      | Next.js Route Handlers      |
| **Forms**     | React hooks (custom)        |
| **Client**    | React 18+                   |

---

## 📍 Key Application Routes

- **`app/page.js`** – Landing page
- **`app/admin/**`\*\* – Admin dashboard (orders, users, reports, calendar)
- **`app/customer/page.js`** – Customer tracking portal
- **`app/staff/page.js`** – Staff operations dashboard
- **`app/api/**`\*\* – Backend API routes (auth, orders, users, appointments)

---

## 📁 Clean Project Structure

```
LaudraTrack/
├── app/                          # Next.js 14 App Router
│   ├── admin/                    # Admin portal
│   │   ├── orders/              # Order management
│   │   ├── users/               # User management
│   │   ├── calendar/            # Calendar view
│   │   ├── reports/             # Analytics
│   │   └── page.js              # Dashboard
│   ├── api/                      # Backend API routes
│   │   ├── auth/                # Authentication
│   │   ├── orders/              # Order endpoints
│   │   ├── admin/               # Admin endpoints
│   │   ├── staff/               # Staff endpoints
│   │   └── appointments/        # Appointment endpoints
│   ├── customer/                 # Customer portal
│   ├── staff/                    # Staff portal
│   ├── page.js                   # Landing page
│   ├── layout.js                 # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # Reusable React components
│   ├── admin/                    # Admin-specific components
│   │   ├── OrderForm.js
│   │   ├── EditOrderForm.js
│   │   ├── OrdersTable.js
│   │   ├── UserForm.js
│   │   ├── OrderCalendarView.js
│   │   └── Sidebar.js
│   ├── customer/                 # Customer components
│   │   ├── OrderLookupForm.js
│   │   ├── EditOrderModal.js
│   │   └── StatusProgressTracker.js
│   ├── staff/                    # Staff components
│   │   ├── OrderCardMenu.js
│   │   └── Sidebar.js
│   └── common/                   # Shared components
│       ├── Modal.js
│       ├── SessionProvider.js
│       ├── PortalAuthModal.js
│       ├── StatusBadge.js
│       ├── UserProfileDropdown.js
│       ├── ManilaLiveClock.js
│       └── OrderTimestampDisplay.js
│
├── hooks/                        # Custom React hooks
│   ├── useApi.js                 # API data fetching
│   ├── useAuth.js                # Authentication state
│   ├── useForm.js                # Form state management
│   └── index.js                  # Central export
│
├── lib/                          # Utilities and helpers
│   ├── api/                      # API services
│   │   ├── apiClient.js          # Generic HTTP client
│   │   ├── authService.js        # Auth-specific API
│   │   └── orderService.js       # Order-specific API
│   ├── auth/                     # Authentication utilities
│   │   ├── authOptions.js        # NextAuth config
│   │   ├── jwt.js                # JWT helpers
│   │   └── middleware.js         # Auth middleware
│   ├── db/                       # Database utilities
│   │   ├── models.js             # Mongoose schemas
│   │   └── mongodb.js            # Connection setup
│   ├── formatters.js             # Data formatting
│   ├── validators.js             # Input validation
│   ├── constants.js              # App constants
│   ├── data.js                   # Seed/mock data
│   └── index.js                  # Central export hub
│
├── scripts/                      # Utility scripts
│   ├── reset-database.js         # Clear all data except admins
│   ├── create-admin.js           # Create admin user
│   ├── create-staff.js           # Create staff user
│   ├── create-superadmin.js      # Create superadmin
│   └── verify-admin.js           # Verify admin access
│
├── docs/                         # Clean documentation
│   ├── SETUP.md                  # Installation & initial setup
│   ├── ARCHITECTURE.md           # System design & data flow
│   ├── COMPREHENSIVE_GUIDE.md    # Full reference guide
│   ├── CONTRIBUTING.md           # Development guidelines
│   ├── SUPERADMIN_SETUP.md       # Superadmin configuration
│   └── DEPLOYMENT.md             # Production deployment
│
├── styles/                       # CSS modules
│   └── components.module.css
│
├── public/                       # Static assets
│   ├── images/
│   │   └── laundra-track-logo.png
│   └── icons/
│
├── Config Files
│   ├── .env.example              # Environment template
│   ├── .env.local                # Development environment
│   ├── .env.production           # Production environment
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── .eslintrc.json
│   └── .prettierrc.json
│
└── Top-level Documentation
    ├── README.md                 # Main project documentation
    ├── START_HERE.md             # Quick start guide
    ├── package.json
    └── docker-compose.yml        # Container orchestration
```

---

## 🔐 User Roles & Permissions

| Role         | Access                                           | Features                          |
| ------------ | ------------------------------------------------ | --------------------------------- |
| **Admin**    | Full system access                               | Users, orders, reports, analytics |
| **Staff**    | Assigned orders only (must be approved by admin) | Order updates, status tracking    |
| **Customer** | Own orders only                                  | Order creation, tracking, edits   |

---

## 🔄 Data Flow

1. **Authentication**: User logs in → JWT token stored → Routed to appropriate portal
2. **API Requests**: Components use `useApi` hook → `apiClient` sends request → API route processes
3. **Database**: API routes interact with MongoDB via Mongoose models
4. **State Management**: React hooks (`useAuth`, `useForm`) manage local state
5. **Real-time Updates**: Polling mechanism in dashboard components

---

## ⚙️ Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL` – Frontend API base URL
- `MONGODB_URI` – Database connection string
- `NEXTAUTH_URL` – NextAuth domain
- `NEXTAUTH_SECRET` – Session encryption key
- `JWT_SECRET` – Token signing key
- `JWT_EXPIRE` – Token expiration time

### Files to Never Modify

- `lib/db/models.js` – Core data schemas
- `lib/auth/authOptions.js` – Auth configuration
- `app/api/auth/[...nextauth]/route.js` – NextAuth handler

---

## 🚀 Development Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Check code quality
npm run lint:fix         # Fix linting issues

# Utilities
node scripts/create-admin.js        # Create admin
node scripts/reset-database.js      # Clear data
```

---

## 📊 What Was Cleaned Up

✅ **Removed 20 debug documentation files** from root directory  
✅ **Deleted unused Python script** (duplicate database reset)  
✅ **Removed debug page** (`app/debug/page.js`)  
✅ **Removed dead code** (`AdminFormModal.js` - unused component)  
✅ **Consolidated documentation** into organized `/docs` folder  
✅ **Maintained all functionality** - zero breaking changes

---

## 📝 Documentation Structure

- **START_HERE.md** – Quick start (5 min)
- **docs/SETUP.md** – Installation & initial setup
- **docs/ARCHITECTURE.md** – Technical design
- **docs/COMPREHENSIVE_GUIDE.md** – Full reference
- **docs/CONTRIBUTING.md** – Development standards
- **docs/DEPLOYMENT.md** – Production deployment
- **docs/SUPERADMIN_SETUP.md** – Advanced configuration

---

## 🛡️ Security Notes

- JWT tokens stored in secure HTTP-only cookies (NextAuth)
- Database credentials in `.env.local` (never committed)
- Password hashing with bcryptjs
- Role-based access control (RBAC) on all protected routes
- CORS configured for secure cross-origin requests

---

## 🔧 Development Notes

- Global CSS optimized (no universal transitions for performance)
- Components use responsive Tailwind classes
- Custom hooks centralized in `/hooks`
- API services modular and reusable
- Database models follow Mongoose best practices
- All scripts use Node.js with proper error handling

---

## ✅ Last Updates

- **Documentation**: Cleaned, consolidated into `/docs`
- **Code**: Removed dead code and unused components
- **Scripts**: Removed Python duplicate, kept Node.js version
- **Debug Pages**: Removed for production cleanness
- **Config**: All properly organized and documented

**Status**: Production-ready, clean, and optimized for development  
**Next Steps**: Run `npm install && npm run dev` to get started
