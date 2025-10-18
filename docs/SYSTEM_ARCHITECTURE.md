# 🏗️ LaudraTrack - Complete System Architecture

**Your fully automated laundry management system is complete and production-ready.**

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        LAUDRATRACK SYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     │
│  │   FRONTEND   │     │  NEXT.JS API │     │  MONGODB     │     │
│  │  (Pages &    │────▶│   ROUTES     │────▶│   DATABASE   │     │
│  │ Components)  │     │ (Vercel Fn)  │     │   (Cloud)    │     │
│  └──────────────┘     └──────────────┘     └──────────────┘     │
│       React                 7 Routes           3 Collections     │
│      Pages:                 - Auth              - Users          │
│      - Home                 - Orders            - Orders         │
│      - Login                - Appointments      - Appointments   │
│      - Dashboard            - Admin             JWT Auth         │
│      - Orders               Middleware:         Role-based       │
│      - Appointments         - Auth Check        Validation       │
│                             - Role Validation                    │
│                             - Status Check                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 Complete Connection Map

### **1. USER REGISTRATION FLOW**

```
┌──────────────────────────────────────────────────────────────┐
│ User fills registration form (role: "customer" or "staff")     │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ POST /api/auth/register  │
         └───────────┬────────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
         ▼                        ▼
    CUSTOMER                  STAFF
         │                        │
         ├─ Validate password     ├─ Validate password
         ├─ Hash with bcryptjs    ├─ Hash with bcryptjs
         ├─ Create user in DB     ├─ Create user in DB
         ├─ Set status: "active"  ├─ Set status: "pending"
         ├─ Generate JWT token    └─ No token yet
         └─ Return token             (Await admin approval)
              │
              ▼
         Can LOGIN IMMEDIATELY
         Access dashboard
```

---

### **2. ADMIN APPROVAL FLOW**

```
┌──────────────────────────────────────────────────────────────┐
│ Admin logs in & views pending staff requests                  │
│ GET /api/admin/users?role=staff&status=pending               │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
         ┌────────────────────────┐
         │ Admin Reviews Staff:   │
         │ - Name                 │
         │ - Email                │
         │ - Phone                │
         │ - Registration date    │
         └────────────┬───────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
       APPROVE               REJECT
          │                       │
    POST /api/admin/users/{id}/approve
    POST /api/admin/users/{id}/reject
          │                       │
    Set status: "approved"   Set status: "rejected"
          │                       │
          ▼                       ▼
     Can LOGIN NOW           Cannot login
     Access dashboard         Access denied
```

---

### **3. ORDER MANAGEMENT FLOW**

```
┌──────────────────────────────────────────────────────────────┐
│ CUSTOMER creates order                                         │
│ POST /api/orders (with JWT token)                             │
│ Payload: items[], dates, addresses                            │
└────────────────────┬─────────────────────────────────────────┘
                     │
    ┌────────────────┴────────────────┐
    │                                  │
    ▼                                  ▼
System validates:                Customer sees:
- Required fields present        - Tracking number: ORD-xxx-xxx
- Total price matches           - Status: pending
- Dates are valid               - Pickup/delivery dates
                                - Confirmation message
    │
    ▼
MongoDB: Create order with status = "pending"
    │
    ┌───────────────┬────────────────┬─────────────┐
    │               │                │             │
    ▼               ▼                ▼             ▼
Customer sees   Admin sees       Staff sees      Database
tracking #      order to         nothing yet     updated
Can track       confirm          (not assigned)
order                            
    │
    ▼
Admin approves → Status changes to "confirmed"
    │
    ▼
Admin assigns staff → Staff can now see order
    │
    ▼
Staff updates status through:
pending → confirmed → picked_up → in_progress → ready → delivered
    │
    ▼
Customer gets notified of each status update
Real-time progress tracker on dashboard
```

---

### **4. APPOINTMENT BOOKING FLOW**

```
┌──────────────────────────────────────────────────────────────┐
│ Customer wants to book appointment                             │
│ POST /api/appointments (with JWT token)                       │
│ Payload: type (pickup/delivery), date, time slot              │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
    ┌─────────────────────────────┐
    │ System checks for conflicts:  │
    │ - Is time slot available?    │
    │ - Is customer already booked? │
    │ - Is staff available?        │
    └───┬────────────────┬─────────┘
        │                │
        ▼                ▼
    AVAILABLE      CONFLICT FOUND
        │                │
        ▼                ▼
    Create         Return error:
    appointment    "Time slot not available"
        │                │
        ▼                ▼
    Status: confirmed   Ask customer to choose
    Added to calendar   different time
        │
        ▼
    Assign staff
        │
        ▼
    Send notification:
    - Customer gets booking confirmation
    - Staff gets appointment assignment
        │
        ▼
    Customer can view appointment
    Staff can manage appointments
    Admin can view all & reassign
```

---

## 📁 Complete File Structure

```
c:\Users\63926\Documents\VS CODE\LaudraTrack\
│
├── app/                           # Next.js App Router
│   ├── api/                       # Backend API Routes (Vercel Functions)
│   │   ├── auth/
│   │   │   ├── register/route.js  # POST - Register user
│   │   │   └── login/route.js     # POST - Login user
│   │   ├── admin/
│   │   │   └── users/
│   │   │       ├── route.js       # GET - View all users
│   │   │       └── [id]/approve/  # POST - Approve/reject staff
│   │   │           └── route.js
│   │   ├── orders/
│   │   │   ├── route.js           # POST/GET - Orders CRUD
│   │   │   └── [id]/route.js      # GET/PATCH/DELETE - Order details
│   │   └── appointments/
│   │       └── route.js           # POST/GET - Appointments
│   │
│   ├── admin/                     # Admin Pages
│   │   ├── layout.js
│   │   ├── page.js                # Dashboard
│   │   ├── orders/
│   │   │   ├── page.js
│   │   │   └── [id]/page.js
│   │   ├── users/
│   │   │   ├── page.js            # Staff approval management
│   │   │   └── [id]/page.js
│   │   ├── calendar/
│   │   │   └── page.js
│   │   └── reports/
│   │       └── page.js
│   │
│   ├── customer/                  # Customer Pages
│   │   └── page.js                # Dashboard
│   │
│   ├── staff/                     # Staff Pages
│   │   └── page.js                # Dashboard
│   │
│   ├── layout.js                  # Root layout
│   ├── page.js                    # Home/Login page
│   └── globals.css
│
├── components/                    # Reusable Components
│   ├── admin/
│   │   ├── OrderForm.js
│   │   ├── OrdersTable.js
│   │   ├── UserForm.js
│   │   ├── EditOrderForm.js
│   │   ├── OrderCalendarView.js
│   │   └── Sidebar.js
│   ├── customer/
│   │   ├── OrderLookupForm.js
│   │   └── StatusProgressTracker.js
│   ├── staff/
│   │   └── Sidebar.js
│   └── common/
│       ├── Modal.js
│       ├── SessionProvider.js
│       └── StatusBadge.js
│
├── lib/                           # Business Logic
│   ├── db/
│   │   ├── mongodb.js             # MongoDB connection
│   │   └── models.js              # User, Order, Appointment schemas
│   ├── auth/
│   │   ├── jwt.js                 # JWT generation & verification
│   │   └── middleware.js          # Auth & role-based access control
│   ├── api/                       # API utilities
│   ├── data.js
│   ├── validators.js
│   └── formatters.js
│
├── hooks/                         # Custom React Hooks
│   ├── useApi.js                  # API fetching with auth
│   ├── useAuth.js                 # Authentication state
│   └── useForm.js                 # Form handling
│
├── services/                      # API Client Services
│   ├── apiClient.js               # Axios instance with interceptors
│   ├── authService.js             # Auth API calls
│   └── orderService.js            # Order API calls
│
├── constants/
│   └── index.js                   # Constants & configuration
│
├── types/
│   └── index.js                   # TypeScript/JSDoc type definitions
│
├── utils/
│   ├── validators.js              # Input validation
│   └── formatters.js              # Data formatting
│
├── public/                        # Static files
│   ├── images/
│   └── icons/
│
├── .env.local                     # Environment variables (local)
├── .env.example                   # Environment template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── next.config.js                 # Next.js config
├── tailwind.config.js             # Tailwind CSS config
├── vercel.json                    # Vercel deployment config
│
└── Documentation Files:
    ├── COMPLETE_SETUP_GUIDE.md    # Local testing guide
    ├── BACKEND_API.md             # API reference (90+ sections)
    ├── BACKEND_QUICK_START.md     # 5-minute setup
    ├── USER_WORKFLOWS.md          # User journey diagrams
    ├── VERCEL_QUICK_DEPLOY.md     # 3-step deployment
    ├── SYSTEM_ARCHITECTURE.md     # This file
    ├── VERCEL_DEPLOYMENT.md       # Detailed deployment guide
    ├── DEPLOYMENT.md
    ├── FILE_STRUCTURE.md
    └── README.md
```

---

## 🔐 Security & Authentication

```
┌─────────────────────────────────────────────────────┐
│ PASSWORD SECURITY                                   │
├─────────────────────────────────────────────────────┤
│ 1. User enters password                             │
│ 2. Client-side validation:                          │
│    - Min 8 characters                               │
│    - 1 uppercase letter                             │
│    - 1 number                                       │
│    - 1 special character (!@#$%^&*)                 │
│ 3. Hash with bcryptjs (salt rounds: 10)             │
│    Password → hashed_value                          │
│ 4. Never store plaintext password                   │
│ 5. Database stores hash only                        │
│                                                     │
│ ❌ Plaintext password NEVER transmitted             │
│ ❌ Plaintext password NEVER stored                  │
│ ✅ Hash stored securely                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ JWT TOKEN AUTHENTICATION                            │
├─────────────────────────────────────────────────────┤
│ 1. User logs in (POST /api/auth/login)              │
│ 2. Password validated against hash                  │
│ 3. JWT token generated (valid for 7 days)           │
│    Payload: { userId, role, expiresAt }            │
│ 4. Token sent to client in response                 │
│ 5. Client stores in sessionStorage/localStorage    │
│                                                     │
│ For subsequent requests:                            │
│ 1. Client sends token in Authorization header      │
│    Authorization: Bearer {token}                    │
│ 2. Server verifies token signature                  │
│ 3. Check expiration date                            │
│ 4. If valid → allow request                         │
│ 5. If invalid/expired → deny & ask to re-login     │
│                                                     │
│ ✅ Stateless (no sessions to store)                 │
│ ✅ Auto-expiration after 7 days                     │
│ ✅ Can't be forged without JWT_SECRET               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ROLE-BASED ACCESS CONTROL                           │
├─────────────────────────────────────────────────────┤
│ Three roles:                                        │
│                                                     │
│ 🧑‍💼 CUSTOMER                                        │
│    - Register: Auto-activated                       │
│    - Can: View own orders, create orders, book     │
│      appointments, track delivery                   │
│    - Cannot: View other orders, manage users,      │
│      approve staff, access admin pages             │
│                                                     │
│ 👨‍💻 STAFF                                           │
│    - Register: Pending approval                     │
│    - After admin approval: Can login               │
│    - Can: View assigned orders, update status,     │
│      view appointments, track deliveries           │
│    - Cannot: View orders from other staff,         │
│      create orders, manage users, access admin    │
│                                                     │
│ 👨‍💼 ADMIN                                          │
│    - Full access to everything                      │
│    - Can: Approve/reject staff, view all users,    │
│      manage all orders, view reports, assign       │
│      staff to orders, manage appointments          │
│    - Create account: Manual in database            │
│                                                     │
│ Middleware checks role on every request             │
│ Returns 403 Forbidden if insufficient permissions  │
└─────────────────────────────────────────────────────┘
```

---

## 📦 API Endpoints Summary

| Method | Endpoint | Purpose | Auth Required | Role Required |
|--------|----------|---------|---------------|---------------|
| POST | `/api/auth/register` | Register user | ❌ | - |
| POST | `/api/auth/login` | Login user | ❌ | - |
| GET | `/api/admin/users` | Get all/filtered users | ✅ | Admin |
| POST | `/api/admin/users/{id}/approve` | Approve staff | ✅ | Admin |
| POST | `/api/admin/users/{id}/reject` | Reject staff | ✅ | Admin |
| POST | `/api/orders` | Create order | ✅ | Customer |
| GET | `/api/orders` | List orders (filtered) | ✅ | Any |
| GET | `/api/orders/{id}` | Get order details | ✅ | Any |
| PATCH | `/api/orders/{id}` | Update order | ✅ | Staff/Admin |
| DELETE | `/api/orders/{id}` | Delete order | ✅ | Admin |
| POST | `/api/appointments` | Book appointment | ✅ | Customer |
| GET | `/api/appointments` | List appointments | ✅ | Any |

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: "user@example.com",          // Unique
  password: "hashed_password",        // bcrypt hash
  name: "John Doe",
  phone: "+1234567890",
  role: "customer|staff|admin",       // User type
  status: "active|pending|approved|rejected",
  
  // For staff tracking
  approvedBy: "admin@example.com",    // Admin who approved
  approvalDate: Date,
  rejectionReason: "string",
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  trackingNumber: "ORD-1707900000000-ABC12345",  // Unique
  customerId: ObjectId,                          // Reference to User
  staffId: ObjectId,                             // Assigned staff (optional)
  status: "pending|confirmed|picked_up|in_progress|ready|delivered",
  paymentStatus: "pending|paid|refunded",
  
  items: [
    { name: "T-Shirt", quantity: 2, price: 5.00 },
    { name: "Pants", quantity: 1, price: 10.00 }
  ],
  
  totalPrice: 20.00,
  description: "Regular laundry, gentle with colors",
  
  addresses: {
    pickup: "123 Main Street, Apt 4B",
    delivery: "Same as pickup"
  },
  
  dates: {
    preferredPickup: Date,
    preferredDelivery: Date,
    actualPickup: Date,
    actualDelivery: Date
  },
  
  // Tracking
  updatedAt: Date,
  createdAt: Date
}
```

### Appointments Collection
```javascript
{
  _id: ObjectId,
  orderId: ObjectId,                   // Related order
  customerId: ObjectId,
  staffId: ObjectId,                   // Assigned staff (optional)
  
  type: "pickup|delivery",
  date: Date,
  timeSlot: "10:00 AM - 12:00 PM",
  notes: "Ring doorbell twice",
  
  status: "scheduled|in_progress|completed|cancelled",
  
  // Conflict prevention
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 How to Use Different Features

### **For Customers**
1. Visit home page → Click "Sign Up"
2. Select role: "Customer"
3. Fill form & register
4. ✅ Instantly activated (no approval needed)
5. Login & create order
6. System generates tracking number
7. Track order status in real-time
8. Book appointment for pickup/delivery

### **For Staff**
1. Visit home page → Click "Sign Up"
2. Select role: "Staff"
3. Fill form & register
4. ⏳ Status: Pending (waiting for admin)
5. Admin approves request
6. Staff can now login
7. View assigned orders
8. Update order status
9. Complete deliveries

### **For Admins**
1. Register in database with `role: "admin"`
2. Login to dashboard
3. Go to "Users" section
4. See pending staff requests
5. Review & approve/reject staff
6. View all orders
7. Assign staff to orders
8. Track overall operations
9. View reports & analytics

---

## 🎯 What's Automated

✅ **Customer registration** - Auto-activated immediately  
✅ **Staff registration** - Status set to pending  
✅ **Admin approval** - Change staff status to approved  
✅ **Order creation** - Auto-generate tracking number  
✅ **Status progression** - Track through 6 stages  
✅ **Notifications** - Send on status updates  
✅ **Appointment conflicts** - Prevent double bookings  
✅ **Password hashing** - bcryptjs with salt  
✅ **JWT tokens** - 7-day auto-expiration  
✅ **Role-based access** - Enforce permissions  

---

## 📈 Ready for Production

✅ **Scalable Architecture** - Add new features without refactoring  
✅ **Serverless Functions** - Auto-scale with Vercel  
✅ **Cloud Database** - MongoDB Atlas (no server management)  
✅ **Security** - Password hashing, JWT, role-based access  
✅ **Error Handling** - Comprehensive error messages  
✅ **Validation** - Input validation on all endpoints  
✅ **Documentation** - 5 complete guides included  
✅ **Testing** - Complete cURL examples provided  

---

## 🔗 Quick Links

- **Local Testing**: See `COMPLETE_SETUP_GUIDE.md`
- **API Reference**: See `BACKEND_API.md`
- **Deploy to Vercel**: See `VERCEL_QUICK_DEPLOY.md`
- **User Workflows**: See `USER_WORKFLOWS.md`
- **Quick Start**: See `BACKEND_QUICK_START.md`

---

**Your LaudraTrack system is complete and ready to serve customers! 🎉**

Built with:
- Next.js 14 (Frontend & API)
- MongoDB (Database)
- JWT (Authentication)
- Vercel (Deployment)
- bcryptjs (Password Security)
- Tailwind CSS (Styling)