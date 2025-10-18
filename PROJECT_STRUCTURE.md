# 📁 LaudraTrack - Clean Project Structure

## Overview

This document describes the organized project structure after cleanup. All files are logically grouped by functionality for clarity and maintainability.

---

## 🗂️ Root-Level Directory Structure

```
LaudraTrack/
├── app/                    # Next.js App Router (core application)
├── components/             # Reusable React components
├── hooks/                  # Custom React hooks
├── lib/                    # Shared utilities and business logic
├── scripts/                # Utility and setup scripts
├── styles/                 # Global stylesheets
├── public/                 # Static assets (images, icons, etc.)
├── docs/                   # Documentation files
│
├── Configuration Files:
├── .env.example            # Environment variables template
├── .env.local              # Local environment variables (git-ignored)
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
├── Dockerfile              # Docker container setup
├── docker-compose.yml      # Docker multi-container setup
├── vercel.json             # Vercel deployment config
└── README.md               # Main project README
```

---

## 📂 Detailed Directory Organization

### `/app` - Next.js Application

The main application directory using Next.js 14 App Router pattern.

```
app/
├── layout.js               # Root layout
├── page.js                 # Home page
├── globals.css             # Global styles
├── favicon.ico             # App favicon
├── api/                    # API Routes (Backend)
│   ├── auth/
│   │   ├── login/route.js
│   │   ├── register/route.js
│   │   └── [...nextauth]/route.js
│   ├── orders/
│   │   ├── route.js        # GET/POST for orders list
│   │   └── [id]/route.js   # GET/PATCH/DELETE for specific order
│   ├── appointments/route.js
│   └── admin/users/route.js
├── admin/                  # Admin Dashboard Pages
│   ├── layout.js
│   ├── page.js
│   ├── orders/page.js
│   ├── users/page.js
│   ├── calendar/page.js
│   └── reports/page.js
├── customer/               # Customer Portal Pages
│   └── page.js
├── staff/                  # Staff Portal Pages
│   └── page.js
└── debug/                  # Debug/Testing Pages
    └── page.js
```

### `/components` - React Components

Organized by feature/role for better maintainability.

```
components/
├── admin/                  # Admin-specific components
│   ├── Sidebar.js
│   ├── OrderForm.js
│   ├── EditOrderForm.js
│   ├── OrdersTable.js
│   ├── OrderCalendarView.js
│   └── UserForm.js
├── customer/               # Customer-specific components
│   ├── OrderLookupForm.js
│   └── StatusProgressTracker.js
├── staff/                  # Staff-specific components
│   └── Sidebar.js
└── common/                 # Shared components
    ├── Modal.js
    ├── SessionProvider.js
    └── StatusBadge.js
```

### `/hooks` - Custom React Hooks

Reusable React hooks for common functionality.

```
hooks/
├── useApi.js               # API calls and data fetching
├── useAuth.js              # Authentication state management
└── useForm.js              # Form handling and validation
```

### `/lib` - Shared Utilities & Business Logic

Centralized location for all utility functions and services.

```
lib/
├── index.js                # Main export file (for easy imports)
├── constants.js            # App-wide constants
├── formatters.js           # Data formatting utilities
├── validators.js           # Data validation functions
├── api/                    # API services
│   ├── apiClient.js        # Axios instance with interceptors
│   ├── authService.js      # Auth API endpoints
│   └── orderService.js     # Order API endpoints
├── auth/                   # Authentication utilities
│   ├── jwt.js              # JWT token handling
│   └── middleware.js       # Auth middleware
└── db/                     # Database utilities
    ├── mongodb.js          # MongoDB connection
    └── models.js           # Database models/schemas
```

### `/scripts` - Utility Scripts

Administrative and setup scripts.

```
scripts/
├── create-admin.js         # Create admin user
├── create-staff.js         # Create staff user
├── test-login.js           # Test login functionality
└── verify-admin.js         # Verify admin user
```

### `/styles` - Stylesheets

Global and component-specific styles.

```
styles/
└── components.module.css   # Component styles
```

### `/public` - Static Assets

Resources served directly to the client.

```
public/
├── icons/                  # Icon files
│   └── .gitkeep
└── images/                 # Image files
    └── .gitkeep
```

### `/docs` - Documentation

All project documentation consolidated in one location.

```
docs/
├── BACKEND_API.md
├── BACKEND_QUICK_START.md
├── SYSTEM_ARCHITECTURE.md
├── LOGIN_FLOW_GUIDE.md
├── USER_WORKFLOWS.md
├── DEPLOYMENT.md
├── VERCEL_DEPLOYMENT.md
├── VERCEL_QUICK_DEPLOY.md
├── VERCEL_DEPLOY_REFERENCE.md
└── [other documentation files...]
```

---

## 🔗 Import Paths

### Using Aliases

TypeScript is configured with `@/` path alias. Examples:

```javascript
// ✅ Correct imports
import { formatDate, ROLES } from '@/lib';
import apiClient from '@/lib/api/apiClient';
import OrderForm from '@/components/admin/OrderForm';
import { useApi } from '@/hooks';
import { ORDER_STATUS } from '@/lib/constants';

// ❌ Avoid relative imports for distant files
import OrderForm from '../../../components/admin/OrderForm';
```

### From `/lib`

All common utilities are re-exported from `/lib/index.js`:

```javascript
// Single import for multiple utilities
import { formatDate, formatCurrency, isValidEmail, apiClient, ROLES, ORDER_STATUS } from '@/lib';
```

---

## ✅ Cleanup Summary

### Moved to `/docs`:

- 24 documentation files (SETUP.md, DEPLOYMENT.md, etc.)
- Organized in one location for easy reference

### Moved to `/scripts`:

- 4 utility scripts (create-admin.js, test-login.js, etc.)
- Kept separate from application code

### Consolidated into `/lib`:

- `/utils` → `/lib/formatters.js`, `/lib/validators.js`
- `/constants` → `/lib/constants.js`
- `/services` → `/lib/api/`

### Removed:

- Empty directories: `/services`, `/utils`, `/constants`
- `.gitkeep` placeholder files

---

## 🚀 Benefits of This Structure

✅ **Clarity**: Files organized logically by purpose and role  
✅ **Scalability**: Easy to add new components, hooks, and utilities  
✅ **Maintainability**: Quick to locate specific functionality  
✅ **Reduced Clutter**: No duplicate or redundant files at root level  
✅ **Better Imports**: Centralized lib exports eliminate import confusion  
✅ **Documentation**: All guides in one `/docs` folder

---

## 📝 Guidelines for Future Development

1. **New Components**: Add to `/components` with role-based subfolder
2. **New Utilities**: Add to `/lib` and export from `/lib/index.js`
3. **New Hooks**: Add to `/hooks` following naming convention `use*.js`
4. **New API Endpoints**: Add to `/app/api` following Next.js conventions
5. **New Documentation**: Add to `/docs` folder with clear naming
6. **Scripts**: Keep in `/scripts` for administrative tasks

---

## 🔄 Migration Notes

If you had existing imports from the old structure:

```javascript
// Old (now removed)
import { formatDate } from '@/utils/formatters';
import { ROLES } from '@/constants';
import { authService } from '@/services';

// New (use these)
import { formatDate, ROLES } from '@/lib';
import { authService } from '@/lib/api/authService';
```

Update any imports in your project to use the new paths.
