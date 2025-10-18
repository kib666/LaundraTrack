# 📁 LaudraTrack - Improved File Structure

## Overview
This document outlines the organized file structure for the LaudraTrack project, following Next.js and React best practices.

---

## 📂 Complete Directory Structure

```
laudratrack/
│
├── app/                              # Next.js App Router (Pages & Routing)
│   ├── layout.js                     # Root layout
│   ├── page.js                       # Home/Landing page
│   ├── globals.css                   # Global styles
│   ├── favicon.ico                   # Favicon
│   │
│   ├── admin/                        # Admin Portal
│   │   ├── layout.js                 # Admin layout wrapper
│   │   ├── page.js                   # Admin dashboard
│   │   ├── orders/
│   │   │   ├── page.js               # Orders list
│   │   │   └── [id]/
│   │   │       └── page.js           # Order detail/edit
│   │   ├── users/
│   │   │   ├── page.js               # Users management
│   │   │   └── [id]/
│   │   │       └── page.js           # User detail/edit
│   │   ├── calendar/
│   │   │   └── page.js               # Calendar view
│   │   └── reports/
│   │       └── page.js               # Analytics & reports
│   │
│   ├── customer/                     # Customer Portal
│   │   └── page.js                   # Customer dashboard
│   │
│   ├── staff/                        # Staff Portal
│   │   └── page.js                   # Staff dashboard
│   │
│   └── api/                          # API Routes (Backend connection)
│       ├── auth/
│       │   ├── login.js
│       │   ├── register.js
│       │   └── logout.js
│       ├── orders/
│       │   └── [...slug].js
│       ├── users/
│       │   └── [...slug].js
│       └── appointments/
│           └── [...slug].js
│
├── components/                       # Reusable React Components
│   ├── admin/                        # Admin-specific components
│   │   ├── Sidebar.js                # Admin sidebar navigation
│   │   ├── OrdersTable.js            # Orders display table
│   │   ├── OrderForm.js              # Create/edit order form
│   │   ├── EditOrderForm.js          # Order editing form
│   │   ├── OrderCalendarView.js      # Calendar component
│   │   └── UserForm.js               # User management form
│   │
│   ├── customer/                     # Customer-specific components
│   │   ├── OrderLookupForm.js        # Order search form
│   │   └── StatusProgressTracker.js  # Order status tracker
│   │
│   ├── staff/                        # Staff-specific components
│   │   └── Sidebar.js                # Staff sidebar navigation
│   │
│   └── common/                       # Shared components
│       ├── SessionProvider.js        # NextAuth session provider
│       ├── Modal.js                  # Reusable modal
│       ├── StatusBadge.js            # Status badge component
│       ├── Button.js                 # Reusable button (can be created)
│       ├── Input.js                  # Reusable input (can be created)
│       └── Layout.js                 # Common layout wrapper
│
├── lib/                              # Library & Utility Code
│   ├── data.js                       # Mock data for development
│   ├── api/                          # API utilities
│   │   └── handlers.js               # API handlers & middleware
│   ├── db/                           # Database utilities
│   │   ├── connection.js             # DB connection config
│   │   └── models.js                 # Data models (schema definitions)
│   └── auth/                         # Authentication utilities
│       ├── authOptions.js            # NextAuth configuration
│       └── middleware.js             # Auth middleware
│
├── services/                         # API Service Layer
│   ├── apiClient.js                  # Axios instance & interceptors
│   ├── authService.js                # Authentication API calls
│   ├── orderService.js               # Order API calls
│   ├── userService.js                # User API calls (to be created)
│   └── appointmentService.js         # Appointment API calls (to be created)
│
├── hooks/                            # Custom React Hooks
│   ├── useApi.js                     # Generic API hook
│   ├── useAuth.js                    # Authentication hook
│   ├── useForm.js                    # Form management hook
│   ├── useFetch.js                   # Data fetching hook (to be created)
│   └── useLocalStorage.js            # Local storage hook (to be created)
│
├── utils/                            # Utility Functions
│   ├── formatters.js                 # Date, currency, phone formatters
│   ├── validators.js                 # Email, phone, password validators
│   ├── constants.js                  # App-wide constants (moved to /constants)
│   ├── helpers.js                    # General helper functions
│   └── logger.js                     # Logging utilities (to be created)
│
├── constants/                        # Application Constants
│   └── index.js                      # All app constants (roles, statuses, routes, endpoints)
│
├── types/                            # TypeScript/JSDoc Type Definitions
│   └── index.js                      # Type definitions for models
│
├── public/                           # Static Assets
│   ├── images/                       # Image files
│   │   ├── logo.png
│   │   ├── favicon.png
│   │   └── ...
│   ├── icons/                        # Icon files
│   │   └── ...
│   └── ...
│
├── styles/                           # Global & Module Styles
│   ├── components.module.css         # Component-specific styles
│   ├── globals.module.css            # Global styles (alternative)
│   └── tailwind.css                  # Tailwind customizations
│
├── .github/
│   └── workflows/
│       └── deploy.yml                # CI/CD deployment workflow
│
├── Configuration Files
│   ├── .env.example                  # Environment variables template
│   ├── .env.local                    # Local environment (dev)
│   ├── .eslintrc.json                # ESLint configuration
│   ├── .prettierrc.json              # Prettier configuration
│   ├── next.config.js                # Next.js configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── package.json                  # Dependencies & scripts
│   ├── package-lock.json             # Dependency lock file
│   ├── postcss.config.js             # PostCSS configuration
│   └── .gitignore                    # Git ignore rules
│
├── Documentation
│   ├── README.md                     # Project overview
│   ├── SETUP.md                      # Setup instructions
│   ├── FILE_STRUCTURE.md             # This file
│   ├── DEPLOYMENT.md                 # Deployment guide
│   ├── QUICKSTART.md                 # Quick start guide
│   └── API.md                        # API documentation (to be created)
│
└── Docker Files (Optional)
    ├── Dockerfile                    # Docker image configuration
    ├── docker-compose.yml            # Multi-container setup
    └── .dockerignore                 # Docker ignore rules
```

---

## 📖 Directory Descriptions

### `/app` - Next.js App Router
- Contains all page routes and layouts
- Uses file-based routing
- Each folder represents a route
- `page.js` files are the actual pages
- `layout.js` files are layout wrappers

### `/components` - React Components
- Organized by feature/role (admin, customer, staff)
- `common` folder for shared components
- Each component is self-contained and reusable
- Props-driven, no global state in components

### `/lib` - Library Code
- Database models and utilities
- Authentication setup (NextAuth options)
- Middleware functions
- Shared logic not suitable for `/utils`

### `/services` - API Layer
- Axios configuration with interceptors
- Service functions for different API endpoints
- Centralized API call management
- Request/response handling

### `/hooks` - Custom React Hooks
- `useApi` - Generic API call hook
- `useAuth` - Authentication state
- `useForm` - Form state management
- Other custom hooks

### `/utils` - Utility Functions
- Pure functions for formatting
- Validation functions
- Helper functions
- No React dependencies

### `/constants` - Application Constants
- Global constants (roles, statuses)
- API endpoints
- Application routes
- Configuration values

### `/types` - Type Definitions
- JSDoc type definitions
- Model interfaces
- API response types
- Shared types

### `/public` - Static Assets
- Images
- Icons
- Fonts
- Other static files

### `/styles` - CSS & Styling
- CSS Modules
- Global style overrides
- Component-specific styles

---

## 🔄 How to Use

### Adding a New Component
```
components/
└── admin/
    └── NewComponent.js
```

### Adding a New Page
```
app/
└── admin/
    └── new-feature/
        └── page.js
```

### Adding a New API Service
```
services/
└── newService.js
```

### Adding a New Hook
```
hooks/
└── useNewFeature.js
```

### Adding a New Utility
```
utils/
└── newUtility.js
```

---

## 🎯 Best Practices

1. **Keep Components Focused** - One responsibility per component
2. **Use Services for API** - Never make API calls directly in components
3. **Reuse Hooks** - Share stateful logic via custom hooks
4. **Type Everything** - Use JSDoc for type safety in JavaScript
5. **Organize by Feature** - Group related files together
6. **Use Constants** - Don't hardcode values
7. **Keep Utils Pure** - No side effects in utility functions
8. **Document Complex Logic** - Add comments for complex implementations

---

## 🚀 Next Steps

1. **Migrate Components** - Move existing components to proper folders
2. **Setup Services** - Create service files for backend API endpoints
3. **Create Hooks** - Extract stateful logic into custom hooks
4. **Add Tests** - Create `__tests__` folders alongside components
5. **API Integration** - Connect frontend to backend services

---

## 📝 Notes

- This structure supports both JavaScript and TypeScript
- Easily scalable for large projects
- Follows industry best practices
- Integrates well with Next.js 14+
- Supports proper code splitting and lazy loading
