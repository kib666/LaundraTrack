# 📚 LaudraTrack - Comprehensive Development Guide

> Complete guide covering setup, architecture, deployment, and development practices.

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18.17.0 or higher
- npm or yarn
- Git
- MongoDB (Atlas or local)

### Installation & Setup

```bash
# Clone repository
git clone https://github.com/yourusername/laudratrack.git
cd laudratrack

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit: **http://localhost:3000**

---

## 📁 Project Structure

```
laudratrack/
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API routes (backend endpoints)
│   ├── admin/                    # Admin portal (dashboard, orders, reports)
│   ├── customer/                 # Customer portal (tracking, bookings)
│   ├── staff/                    # Staff portal (tasks, calendar)
│   ├── page.js                   # Landing page
│   ├── layout.js                 # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── admin/                    # Admin UI components
│   │   ├── Sidebar.js
│   │   ├── OrdersTable.js
│   │   ├── OrderForm.js
│   │   ├── OrderCalendarView.js
│   │   └── UserForm.js
│   ├── customer/                 # Customer UI components
│   │   ├── OrderLookupForm.js
│   │   └── StatusProgressTracker.js
│   ├── staff/                    # Staff UI components
│   │   └── Sidebar.js
│   └── common/                   # Shared components
│       ├── Modal.js
│       ├── StatusBadge.js
│       ├── SessionProvider.js
│       └── PortalAuthModal.js
│
├── hooks/                        # Custom React hooks
│   ├── useApi.js                 # API call hook
│   ├── useAuth.js                # Authentication hook
│   ├── useForm.js                # Form state hook
│   └── index.js                  # Export hub
│
├── lib/                          # Unified utilities & services
│   ├── index.js                  # Central export hub
│   ├── constants.js              # App constants & configuration
│   ├── formatters.js             # Data formatting utilities
│   ├── validators.js             # Form & data validators
│   ├── data.js                   # Mock data & fixtures
│   │
│   ├── api/                      # API services
│   │   ├── apiClient.js          # Axios instance with interceptors
│   │   ├── authService.js        # Authentication API
│   │   └── orderService.js       # Orders API
│   │
│   ├── auth/                     # Authentication utilities
│   │   ├── jwt.js                # JWT token helpers
│   │   └── middleware.js         # Auth middleware
│   │
│   └── db/                       # Database utilities
│       ├── mongodb.js            # MongoDB connection
│       └── models.js             # Mongoose models
│
├── public/                       # Static assets
│   ├── icons/
│   └── images/
│
├── scripts/                      # Node utility scripts
│   ├── create-admin.js
│   ├── create-staff.js
│   ├── test-login.js
│   └── verify-admin.js
│
├── styles/                       # Stylesheets
│   └── components.module.css
│
├── types/                        # Type definitions
│   └── index.js
│
├── docs/                         # Documentation
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .eslintrc.json
├── vercel.json
└── README.md
```

---

## 🔧 Environment Configuration

### `.env.local` (Local Development)

```env
# Frontend API
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-32-chars-minimum

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/laudratrack

# JWT
JWT_SECRET=your-jwt-secret-32-chars-minimum
JWT_EXPIRE=7d
```

### Production Deployment

For Vercel deployment, add environment variables in:

- **Vercel Dashboard** → Settings → Environment Variables

---

## 🏗️ Architecture

### Authentication Flow

1. User logs in via `/api/auth/login`
2. JWT token generated and stored in localStorage
3. Token sent in Authorization header for authenticated requests
4. Automatic redirect to login on 401 response

### Data Flow

1. Components dispatch API calls via services
2. Services use `apiClient` (Axios) with interceptors
3. Responses cached in component state or Context API
4. Database updates trigger re-renders

### Role-Based Access

- **Admin**: Full system management
- **Staff**: Task and delivery management
- **Customer**: Order tracking and booking

---

## 📦 Using Exports

### Import from Central Hub (`@/lib`)

```javascript
import {
  // Constants
  ROLES,
  ORDER_STATUS,
  ROUTES,
  // Utilities
  formatDate,
  formatCurrency,
  isValidEmail,
  // Services
  apiClient,
  login,
  register,
  getOrders,
} from '@/lib';
```

### Import Specific Files

```javascript
import { formatDate } from '@/lib/formatters';
import authService from '@/lib/api/authService';
import { User } from '@/lib/db/models';
```

### Import Hooks

```javascript
import { useApi, useAuth, useForm } from '@/hooks';
```

---

## 🚀 Running Commands

### Development

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
```

### Code Quality

```bash
npm run lint             # Check linting issues
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run type-check       # Check TypeScript types
```

### Utilities

```bash
node scripts/create-admin.js    # Create admin user
node scripts/create-staff.js    # Create staff user
node scripts/test-login.js      # Test login flow
node scripts/verify-admin.js    # Verify admin setup
```

---

## 🌐 API Endpoints

### Authentication

```
POST   /api/auth/login              # User login
POST   /api/auth/register           # User registration
POST   /api/auth/logout             # User logout
GET    /api/auth/[...nextauth]      # NextAuth routes
```

### Orders

```
GET    /api/orders                  # List orders (paginated)
POST   /api/orders                  # Create order
GET    /api/orders/:id              # Get order details
PATCH  /api/orders/:id              # Update order
DELETE /api/orders/:id              # Delete order
```

### Admin - Users

```
GET    /api/admin/users             # List users
POST   /api/admin/users             # Create user
GET    /api/admin/users/:id         # Get user details
PATCH  /api/admin/users/:id         # Update user
DELETE /api/admin/users/:id         # Delete user
POST   /api/admin/users/:id/approve # Approve pending user
```

### Appointments

```
GET    /api/appointments            # List appointments
POST   /api/appointments            # Create appointment
PATCH  /api/appointments/:id        # Update appointment
```

---

## 🎨 Styling

### Tailwind CSS

- Configured in `tailwind.config.js`
- Global styles in `app/globals.css`
- Component module styles in `styles/components.module.css`

### Color Scheme

- **Blue**: Primary (admin)
- **Green**: Success (staff)
- **Orange**: Warning (customer)
- **Red**: Danger/Error

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- All components are responsive by default

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local`
   - Use strong, unique secrets (32+ characters)
   - Rotate secrets regularly

2. **Authentication**
   - JWT tokens stored in localStorage (client-side auth)
   - Tokens included in Authorization header
   - Automatic logout on 401 response

3. **API Security**
   - HTTPS for all production requests
   - CORS configured for allowed origins
   - Input validation on all endpoints
   - Rate limiting on sensitive endpoints

4. **Data Protection**
   - MongoDB connection with SSL/TLS
   - Encrypted password storage (bcryptjs)
   - Access control based on user roles
   - Audit logging for sensitive operations

---

## 📊 Performance Tips

1. **Code Splitting**
   - Use dynamic imports for large components
   - Next.js automatic code splitting in App Router

2. **Image Optimization**
   - Use Next.js Image component
   - Optimize before uploading to public/

3. **Caching**
   - Implement React Query or SWR for API caching
   - Use Browser cache for static assets

4. **Database**
   - Index frequently queried fields
   - Paginate large result sets
   - Use projection to fetch only needed fields

---

## 🚀 Deployment to Vercel

### Prerequisites

- GitHub account with repository
- Vercel account

### Steps

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Deploy"

3. **Configure Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env.example`
   - Important: `NEXT_PUBLIC_*` prefix for client-side vars

4. **Verify Deployment**
   - Check deployment logs in Vercel dashboard
   - Test all portals in production URL

### Troubleshooting

- Check build logs for errors
- Verify environment variables are set
- Ensure all dependencies are in package.json
- Run `npm run build` locally to test

---

## 🐛 Debugging

### Enable Debug Logs

```javascript
// In development
const DEBUG = process.env.NODE_ENV === 'development';
console.log(DEBUG && 'Debug info:', data);
```

### Browser DevTools

- React DevTools extension for component inspection
- Network tab for API debugging
- Storage tab for localStorage inspection

### Common Issues

| Issue                     | Solution                               |
| ------------------------- | -------------------------------------- |
| API requests fail         | Check NEXT_PUBLIC_API_URL env variable |
| Authentication fails      | Verify JWT_SECRET is set correctly     |
| Styling not applied       | Clear Next.js cache: `rm -rf .next`    |
| Page not found            | Check file structure and route naming  |
| Database connection error | Verify MONGODB_URI connection string   |

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [NextAuth.js Guide](https://next-auth.js.org)

---

## 👥 Team

**LaundraTrack Team** - LaudraTrack Project  
Course: Technopreneurship (TIP)

---

## 📄 License

Private project - TIP coursework

---

**Last Updated**: 2024  
**Status**: ✅ Production Ready
