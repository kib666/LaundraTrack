# 🚀 Complete LaudraTrack Setup & Deployment Guide

**Everything you need to run locally and deploy to Vercel.**

---

## 📦 What's Already Built

✅ **Backend API Routes** - All endpoints ready in `/app/api`  
✅ **Database Models** - User, Order, Appointment schemas in `/lib/db`  
✅ **Authentication** - JWT tokens + role-based access control  
✅ **Dependencies** - All npm packages installed  
✅ **Environment Config** - `.env.example` ready to copy  

---

## 🔗 How Everything Connects

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION FLOW                    │
└─────────────────────────────────────────────────────────────┘

1. CUSTOMER REGISTERS
   └─> POST /api/auth/register
       ├─> Validates password strength
       ├─> Hashes password with bcryptjs
       ├─> Creates user in MongoDB with status: "active"
       ├─> Generates JWT token
       └─> Returns token + user data
          (Customer can login IMMEDIATELY)

2. STAFF REGISTERS
   └─> POST /api/auth/register (role: "staff")
       ├─> Validates password strength
       ├─> Hashes password with bcryptjs
       ├─> Creates user in MongoDB with status: "pending"
       ├─> NO token generated yet
       └─> Returns message: "Awaiting admin approval"
          (Staff CANNOT login until approved)

3. ADMIN REVIEWS PENDING STAFF
   └─> GET /api/admin/users?role=staff&status=pending
       ├─> Returns list of pending staff requests
       └─> Shows: email, name, phone, registration date

4. ADMIN APPROVES/REJECTS STAFF
   └─> POST /api/admin/users/{id}/approve (or /reject)
       ├─> Updates user status to "approved" (or "rejected")
       ├─> Records admin approval
       └─> Staff can now login with their credentials

5. STAFF LOGS IN
   └─> POST /api/auth/login
       ├─> Validates password
       ├─> Checks if status is "approved" (not pending/rejected)
       ├─> If approved: generates JWT token
       └─> Staff dashboard loads
          (Can view assigned orders, update statuses, etc.)

┌─────────────────────────────────────────────────────────────┐
│                    ORDER & DELIVERY FLOW                     │
└─────────────────────────────────────────────────────────────┘

CUSTOMER CREATES ORDER
   └─> POST /api/orders
       ├─> Requires: items, dates, addresses, JWT token
       ├─> Validates customer is authenticated
       ├─> Generates tracking number: ORD-{timestamp}-{random}
       ├─> Creates order in MongoDB
       ├─> Sets status: "pending" (awaits admin confirmation)
       └─> Returns tracking number to customer

ADMIN/STAFF VIEWS ORDERS
   └─> GET /api/orders?status=pending
       ├─> Admin sees ALL orders
       ├─> Staff sees ONLY their assigned orders
       ├─> Customer sees ONLY their own orders
       └─> Returns filtered list with full details

ADMIN/STAFF UPDATES ORDER STATUS
   └─> PATCH /api/orders/{id}
       ├─> Updates status progression:
       │   pending → confirmed → picked_up → in_progress → ready → delivered
       ├─> Only staff assigned to order can update
       ├─> Admin can reassign and change status
       └─> Triggers notification to customer

CUSTOMER TRACKS ORDER
   └─> GET /api/orders/{id}
       ├─> Returns current status
       ├─> Shows pickup/delivery dates
       ├─> Shows assigned staff name
       └─> Progress tracker updates in real-time

┌─────────────────────────────────────────────────────────────┐
│                 APPOINTMENT BOOKING FLOW                     │
└─────────────────────────────────────────────────────────────┘

CUSTOMER BOOKS APPOINTMENT
   └─> POST /api/appointments
       ├─> Select type: "pickup" or "delivery"
       ├─> Select date + time slot
       ├─> System checks for conflicts (no double bookings)
       ├─> Creates appointment in MongoDB
       └─> Returns confirmation

STAFF VIEWS ASSIGNED APPOINTMENTS
   └─> GET /api/appointments
       ├─> Shows only their scheduled appointments
       └─> Includes customer info, address, notes

ADMIN MANAGES ALL APPOINTMENTS
   └─> GET /api/appointments
       ├─> Can filter by date, staff, type
       ├─> Can reassign staff to appointments
       └─> Can view full schedule
```

---

## 🔑 Key Endpoints

### 📝 **Authentication**
```
POST   /api/auth/register    - Register (customer auto-active, staff pending)
POST   /api/auth/login       - Login (returns JWT token)
```

### 👥 **Admin Management**
```
GET    /api/admin/users?role=staff&status=pending   - View pending staff
POST   /api/admin/users/{id}/approve                - Approve staff
POST   /api/admin/users/{id}/reject                 - Reject staff
```

### 📦 **Orders**
```
POST   /api/orders           - Create order
GET    /api/orders           - List orders (filtered by role)
GET    /api/orders/{id}      - Get order details
PATCH  /api/orders/{id}      - Update order status
DELETE /api/orders/{id}      - Delete order (admin only)
```

### 📅 **Appointments**
```
POST   /api/appointments     - Book appointment
GET    /api/appointments     - View appointments (filtered by role)
```

---

## 💻 LOCAL TESTING SETUP

### Step 1: Create `.env.local`

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with these values:

```env
# FRONTEND
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# DATABASE - Use MongoDB locally or Atlas
MONGODB_URI=mongodb://localhost:27017/laudratrack

# AUTHENTICATION
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-123-change-in-production

# JWT
JWT_SECRET=jwt-secret-key-456-change-in-production
JWT_EXPIRE=7d

NODE_ENV=development
```

### Step 2: Start MongoDB Locally

**Option A: Using Docker (Recommended)**
```bash
docker run --name laudratrack-mongo -p 27017:27017 -d mongo:7.0
```

**Option B: Manual MongoDB Installation**
- Download from https://www.mongodb.com/try/download/community
- Install and run `mongod` command

**Option C: Use MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account
- Create cluster
- Get connection string
- Paste in `MONGODB_URI=...`

### Step 3: Start Dev Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## ✅ LOCAL TESTING SCENARIOS

### Test 1: Customer Registration & Auto-Login

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "phone": "+1234567890",
    "role": "customer"
  }'
```

**Expected Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "...",
    "email": "customer@example.com",
    "name": "John Doe",
    "role": "customer",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

✅ Customer is ACTIVE and can login immediately.

---

### Test 2: Staff Registration & Pending Approval

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@example.com",
    "password": "SecurePass123!",
    "name": "Jane Smith",
    "phone": "+9876543210",
    "role": "staff"
  }'
```

**Expected Response:**
```json
{
  "message": "Registration successful. Awaiting admin approval",
  "user": {
    "id": "...",
    "email": "staff@example.com",
    "name": "Jane Smith",
    "role": "staff",
    "status": "pending"
  },
  "token": null
}
```

❌ Staff does NOT get a token. Status is "pending".

---

### Test 3: Admin Approves Staff

**First, login as admin to get token:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123!",
    "role": "admin"
  }'
```

**Then approve staff:**
```bash
curl -X POST http://localhost:3000/api/admin/users/{staff_id}/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "approvedBy": "admin@example.com"
  }'
```

**Expected Response:**
```json
{
  "message": "Staff approved successfully",
  "user": {
    "status": "approved"
  }
}
```

✅ Staff status changed to "approved". Now staff can login.

---

### Test 4: Staff Login After Approval

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@example.com",
    "password": "SecurePass123!"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "staff@example.com",
    "role": "staff",
    "status": "approved"
  }
}
```

✅ Staff can now login and access their dashboard.

---

### Test 5: Create Order (as Customer)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {customer_token}" \
  -d '{
    "items": [
      {"name": "T-Shirt", "quantity": 2, "price": 5.00},
      {"name": "Pants", "quantity": 1, "price": 10.00}
    ],
    "totalPrice": 20.00,
    "description": "Regular wash",
    "pickupAddress": "123 Main St",
    "deliveryAddress": "123 Main St",
    "pickupDate": "2024-02-20",
    "deliveryDate": "2024-02-22"
  }'
```

**Expected Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "...",
    "trackingNumber": "ORD-1707900000000-ABC12345",
    "customerId": "...",
    "status": "pending",
    "paymentStatus": "pending",
    "totalPrice": 20.00
  }
}
```

✅ Order created with tracking number.

---

### Test 6: View Orders (Different Perspectives)

**As Customer (see only own orders):**
```bash
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer {customer_token}"
```

**As Staff (see assigned orders):**
```bash
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer {staff_token}"
```

**As Admin (see ALL orders):**
```bash
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer {admin_token}"
```

✅ Each role sees different data based on permissions.

---

### Test 7: Update Order Status (as Staff)

```bash
curl -X PATCH http://localhost:3000/api/orders/{order_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {staff_token}" \
  -d '{
    "status": "confirmed"
  }'
```

**Expected Response:**
```json
{
  "message": "Order updated successfully",
  "order": {
    "id": "...",
    "status": "confirmed",
    "updatedAt": "2024-02-20T10:30:00Z"
  }
}
```

✅ Order status progresses through workflow.

---

## 🌐 VERCEL DEPLOYMENT

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Complete backend setup"
git push origin main
```

### Step 2: Create Vercel Project

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select "Next.js" as framework
4. Click "Deploy"

### Step 3: Set Environment Variables in Vercel

In Vercel dashboard → Project Settings → Environment Variables, add:

```
MONGODB_URI = mongodb+srv://user:password@cluster.mongodb.net/laudratrack
JWT_SECRET = your-super-secret-jwt-key (generate with: node -e "console.log(require('uuid').v4())")
JWT_EXPIRE = 7d
NEXTAUTH_URL = https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET = another-secret-key (generate with: node -e "console.log(require('uuid').v4())")
NODE_ENV = production
NEXT_PUBLIC_API_URL = https://your-vercel-domain.vercel.app/api
```

### Step 4: Setup MongoDB Atlas (Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account (free tier available)
3. Create cluster
4. Create database user
5. Whitelist Vercel IPs (or use 0.0.0.0/0 for development)
6. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/laudratrack`
7. Add to Vercel environment variables

### Step 5: Deploy

Vercel automatically deploys on every git push. Check deployment logs at:
```
https://vercel.com/your-username/laudratrack/deployments
```

---

## 🧪 Test Production After Deployment

```bash
# Register customer
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User",
    "phone": "+1234567890",
    "role": "customer"
  }'

# Should work exactly like local testing
```

---

## 🔍 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# If using Docker
docker start laudratrack-mongo

# If using local MongoDB
mongod
```

### JWT Token Error
```
Error: MONGODB_URI is not defined
```
**Solution:** Check `.env.local` has all variables

### Vercel Deployment Failed
Check logs at https://vercel.com/dashboard
Common causes:
- Missing environment variables
- MongoDB connection string invalid
- Node version mismatch (use Node 18+)

---

## 📊 Architecture Summary

```
Frontend (Next.js Pages)
    ↓
    ├─→ /api/auth/register     → User model + password hashing
    ├─→ /api/auth/login        → JWT generation
    ├─→ /api/orders            → Order model + validation
    ├─→ /api/appointments      → Appointment model
    └─→ /api/admin/users       → Role-based access control
         ↓
      MongoDB (Atlas)
         ↓
      Vercel Functions (Auto-scaling)
```

---

## ✨ Next Steps

1. ✅ Run locally with `npm run dev`
2. ✅ Test with provided cURL commands
3. ✅ Create admin account manually in MongoDB
4. ✅ Test full workflows (register → approve → order → deliver)
5. ✅ Deploy to Vercel
6. ✅ Connect frontend components to API services

**You now have a production-ready backend! 🎉**