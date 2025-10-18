# 🏗️ System Architecture

Comprehensive overview of LaudraTrack's technical architecture, design patterns, and system interactions.

---

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│               FRONTEND (Vercel)                 │
│  ┌──────────────────────────────────────────┐  │
│  │         Next.js 14 (React 18)           │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │   Admin Portal                  │    │  │
│  │  │   Customer Portal               │    │  │
│  │  │   Staff Portal                  │    │  │
│  │  │   Landing Page                  │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                          │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │   API Routes (Edge)             │    │  │
│  │  │   - Authentication              │    │  │
│  │  │   - Orders CRUD                 │    │  │
│  │  │   - User Management             │    │  │
│  │  │   - Appointments                │    │  │
│  │  └─────────────────────────────────┘    │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
              ↓ HTTPS Requests ↓
┌─────────────────────────────────────────────────┐
│         MIDDLEWARE LAYER                        │
│  ┌──────────────────────────────────────────┐  │
│  │   JWT Authentication Middleware         │  │
│  │   - Verify JWT tokens                   │  │
│  │   - Role-based access control           │  │
│  │   - Token refresh logic                 │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
              ↓ HTTPS Requests ↓
┌─────────────────────────────────────────────────┐
│      DATABASE LAYER (MongoDB Atlas)             │
│  ┌──────────────────────────────────────────┐  │
│  │   Collections:                          │  │
│  │   - users (admin, staff, customers)     │  │
│  │   - orders (full lifecycle)             │  │
│  │   - appointments (bookings)             │  │
│  │   - services (service types)            │  │
│  │   - pricing (service pricing)           │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Authentication Flow

```
User Input
    ↓
[Login Page]
    ↓
POST /api/auth/login
    ↓
[JWT Middleware: Verify Credentials]
    ↓
MongoDB: Check User
    ↓
Generate JWT Token
    ↓
Return Token + Redirect
    ↓
[Store Token in localStorage]
    ↓
[Render Portal Based on Role]
```

### Order Management Flow

```
Customer/Admin Action
    ↓
API Call (with JWT in header)
    ↓
[JWT Middleware: Verify Token]
    ↓
[Authorization Middleware: Check Role]
    ↓
Process Request
    ↓
MongoDB Operation
    ↓
Return Response
    ↓
[Update Component State]
    ↓
[Re-render UI]
```

---

## 🏛️ Component Architecture

### Page Layer (app/)

```
Landing Page (Public)
    ↓
Authenticated Check
    ↓
├── Admin Portal (app/admin)
│   ├── Dashboard
│   ├── Orders Management
│   ├── User Management
│   ├── Calendar View
│   └── Reports
│
├── Customer Portal (app/customer)
│   ├── Order Tracking
│   ├── Order History
│   └── Appointment Booking
│
└── Staff Portal (app/staff)
    ├── Task List
    ├── Calendar
    └── Profile
```

### Component Reusability

```
/components/common          (Shared by all roles)
├── Modal                   (Generic dialog)
├── StatusBadge             (Status display)
├── SessionProvider         (Auth context)
└── PortalAuthModal         (Login/registration)

/components/admin           (Admin-specific)
├── Sidebar                 (Navigation)
├── OrdersTable             (Orders list)
├── OrderForm               (Create/edit order)
├── OrderCalendarView       (Calendar widget)
└── UserForm                (User management)

/components/customer        (Customer-specific)
├── OrderLookupForm         (Search orders)
└── StatusProgressTracker   (Order status)

/components/staff           (Staff-specific)
└── Sidebar                 (Navigation)
```

---

## 🔌 API Architecture

### Request-Response Cycle

```
Client
  ↓
Axios (with interceptors)
  ↓
Next.js API Route
  ↓
JWT Verification
  ↓
Role-Based Access Control
  ↓
Request Handler
  ↓
MongoDB Query/Update
  ↓
Response Serialization
  ↓
Axios (response interceptor)
  ↓
Component State Update
```

### API Service Layer

```
/lib/api/
├── apiClient.js
│   ├── Axios instance
│   ├── Request interceptors (add JWT)
│   ├── Response interceptors (handle 401)
│   └── Error handling
│
├── authService.js
│   ├── login(email, password)
│   ├── register(userData)
│   ├── logout()
│   └── getCurrentUser()
│
└── orderService.js
    ├── getOrders(filters)
    ├── getOrderById(id)
    ├── createOrder(data)
    ├── updateOrder(id, data)
    └── deleteOrder(id)
```

### JWT Token Lifecycle

```
Login Request
    ↓
Generate Token (JWT)
    ↓
Set Expiration (7 days)
    ↓
Return to Client
    ↓
Client stores in localStorage
    ↓
Include in Authorization header
    ↓
Server verifies signature
    ↓
Token expires → Auto redirect to login
```

---

## 🗄️ Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  password: string (hashed),
  role: "admin" | "staff" | "customer",
  status: "pending" | "approved" | "rejected",
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection

```javascript
{
  _id: ObjectId,
  orderNumber: string (unique),
  customer: ObjectId (ref: users),
  services: [
    { serviceType: string, quantity: number, price: number }
  ],
  status: "pending" | "confirmed" | "in_progress" | "ready" | "picked_up" | "delivered" | "cancelled",
  totalAmount: number,
  pickupDate: Date,
  deliveryDate: Date,
  notes: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Appointments Collection

```javascript
{
  _id: ObjectId,
  customer: ObjectId (ref: users),
  appointmentDate: Date,
  service: string,
  notes: string,
  status: "available" | "booked" | "completed" | "cancelled",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security Architecture

### Authentication

- **Method**: JWT (JSON Web Tokens)
- **Storage**: localStorage (client-side)
- **Transmission**: Authorization header
- **Expiration**: 7 days
- **Refresh**: Re-login required

### Authorization

- **Pattern**: Role-Based Access Control (RBAC)
- **Roles**: Admin, Staff, Customer
- **Enforcement**: Middleware on every API route

### Password Security

- **Hashing**: bcryptjs with salt rounds
- **Validation**: Minimum 8 characters, mixed case, numbers

### Data Protection

- **Transport**: HTTPS/TLS
- **Database**: MongoDB Atlas with encryption
- **Secrets**: Environment variables (never in code)

---

## 📈 Scalability Considerations

### Current Capacity

- Suitable for ~10,000 users
- ~100,000 orders per month
- Single MongoDB cluster

### Scaling Strategies

1. **Horizontal Scaling**
   - Multiple Vercel deployments
   - Load balancing via CDN

2. **Database Scaling**
   - MongoDB sharding for large datasets
   - Read replicas for queries

3. **Caching**
   - Redis for session management
   - API response caching

4. **Performance**
   - Implement pagination
   - Add search indexes
   - Use CDN for static assets

---

## 🛠️ Technology Stack

| Layer              | Technology     | Version |
| ------------------ | -------------- | ------- |
| Frontend Framework | Next.js        | 14+     |
| UI Library         | React          | 18+     |
| Styling            | Tailwind CSS   | 3+      |
| Icons              | lucide-react   | Latest  |
| HTTP Client        | Axios          | 1.4+    |
| Authentication     | JWT            | -       |
| Database           | MongoDB        | Atlas   |
| ORM                | Mongoose       | 7+      |
| Password Hashing   | bcryptjs       | 2.4+    |
| Deployment         | Vercel         | -       |
| CI/CD              | GitHub Actions | -       |

---

## 🔄 Deployment Architecture

```
GitHub Repository
    ↓
Automatic push detection
    ↓
GitHub Actions Workflow
    ↓
├── Run linting
├── Run tests
├── Build application
└── Push to Vercel
    ↓
Vercel Build Process
    ↓
├── Install dependencies
├── Run build command
├── Check environment variables
└── Deploy to edge network
    ↓
Global CDN
    ↓
Multiple regions
```

---

## 📝 Design Patterns

### 1. MVC (Model-View-Controller)

- **Model**: MongoDB collections
- **View**: React components
- **Controller**: API routes + services

### 2. Custom Hooks

- Encapsulate logic in reusable hooks
- `useApi`: API calls
- `useAuth`: Authentication state
- `useForm`: Form state management

### 3. Service Pattern

- API services abstract HTTP calls
- Central point for API configuration
- Easy to mock for testing

### 4. Middleware Pattern

- JWT verification middleware
- Role-based access middleware
- Error handling middleware

### 5. Factory Pattern

- Modal component factory
- Form component factory
- API client factory

---

## 🔍 Error Handling

### Client-Side

```javascript
try {
  const response = await apiCall();
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  } else if (error.response?.status === 403) {
    // Show permission denied
  } else {
    // Show generic error
  }
}
```

### Server-Side

```javascript
export async function POST(req) {
  try {
    // Process request
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
```

---

## 🧪 Testing Strategy

### Unit Testing

- Test utility functions (formatters, validators)
- Test hooks in isolation
- Mock API calls

### Integration Testing

- Test component + hooks interactions
- Test full user flows
- Test API endpoints

### E2E Testing

- Test complete user journeys
- Multiple browser/devices
- Production-like environment

---

## 📊 Monitoring & Logging

### Logs to Implement

- User login/logout events
- Order status changes
- API errors
- Database query times
- Failed authentications

### Monitoring Tools

- Vercel Analytics (built-in)
- Sentry for error tracking
- MongoDB Atlas monitoring
- Custom logging service

---

## 🚀 Performance Optimization

### Frontend

- Code splitting (dynamic imports)
- Image optimization
- CSS minification
- JavaScript minification

### Backend

- Database indexing
- Query optimization
- Pagination
- Response caching

### Network

- Gzip compression
- CDN caching
- Lazy loading
- Service workers

---

**Last Updated**: 2024  
**Version**: 1.0  
**Status**: ✅ Complete
