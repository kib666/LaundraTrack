# 🚀 Vercel Deployment - Quick Start

**Everything is built and ready to deploy!**

---

## 📋 Checklist Before Deployment

- ✅ Backend API routes complete
- ✅ Authentication system implemented
- ✅ MongoDB models ready
- ✅ Build passes without errors
- ✅ Environment variables configured

---

## 🌐 Deploy to Vercel in 3 Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Complete backend setup with all automations"
git push origin main
```

### Step 2: Create Vercel Project

1. Go to **https://vercel.com/new**
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click **"Import"**

### Step 3: Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add these:

```
MONGODB_URI           = mongodb+srv://username:password@cluster.mongodb.net/laudratrack
JWT_SECRET            = (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_EXPIRE            = 7d
NEXTAUTH_URL          = https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET       = (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NEXT_PUBLIC_API_URL   = https://your-vercel-domain.vercel.app/api
NODE_ENV              = production
```

**Click "Save"** → Vercel auto-deploys!

---

## 🗄️ Setup MongoDB Atlas (Free Database)

### Quick Setup
1. Go to **https://www.mongodb.com/cloud/atlas**
2. Sign up (free)
3. Create organization → Create project → Create cluster (free tier)
4. Create database user:
   - Username: `laudrauser`
   - Password: (strong password)
5. Whitelist IPs: Click "Allow Access from Anywhere" (0.0.0.0/0) for development
6. Get connection string: Click "Connect" → "Connect your application"
   - Copy: `mongodb+srv://laudrauser:password@cluster0.xxxxx.mongodb.net/laudratrack?retryWrites=true&w=majority`
7. Paste in Vercel `MONGODB_URI` variable

---

## ✨ Your App is Live!

After deployment completes, your app will be at:
```
https://your-project-name.vercel.app
```

---

## 🧪 Test Your Live Backend

### Register Customer (Auto-Active)
```bash
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "phone": "+1234567890",
    "role": "customer"
  }'
```

**Expected:** Customer is active and can login immediately ✅

### Register Staff (Pending Approval)
```bash
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@example.com",
    "password": "SecurePass123!",
    "name": "Jane Smith",
    "phone": "+9876543210",
    "role": "staff"
  }'
```

**Expected:** Staff status is "pending" (no token) ❌ Needs approval

### Create Order
```bash
curl -X POST https://your-domain.vercel.app/api/orders \
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

**Expected:** Order created with tracking number ✅

---

## 🔍 Monitor Your Backend

Check logs and errors:
- Go to **https://vercel.com/dashboard**
- Click your project
- View "Deployments" tab
- Click latest deployment
- Check "Function Logs"

---

## 🎉 You Now Have:

✅ Fully automated user registration (customer auto-active, staff pending)  
✅ Admin approval workflow  
✅ Complete order management system  
✅ Appointment booking system  
✅ Role-based access control  
✅ JWT authentication  
✅ MongoDB cloud database  
✅ Production-grade deployment on Vercel  
✅ Auto-scaling serverless functions  

---

## 🔗 What Connects Where

```
User Registration
├─ Customer → Auto-activated, can login immediately
├─ Staff → Status: pending, awaits admin approval
└─ Admin → Full access, approves staff

Admin Dashboard
├─ View all pending staff
├─ Approve/reject staff
├─ View all orders
└─ Manage users

Customer Dashboard
├─ Create orders → Tracked automatically
├─ Book appointments
├─ View order status in real-time
└─ Track delivery

Staff Dashboard
├─ View assigned orders
├─ Update order status
├─ Complete deliveries
└─ Track appointments

MongoDB Atlas
├─ Users collection (customers, staff, admins)
├─ Orders collection (with tracking numbers)
└─ Appointments collection (with time slots)

Vercel Functions (Auto-scaling)
├─ /api/auth/* (Login/Register)
├─ /api/admin/* (User approval)
├─ /api/orders/* (Order CRUD)
└─ /api/appointments/* (Booking)
```

---

## 📚 More Documentation

- **COMPLETE_SETUP_GUIDE.md** - Local testing & full workflows
- **BACKEND_API.md** - Complete API reference with all endpoints
- **USER_WORKFLOWS.md** - Visual user journey diagrams
- **BACKEND_QUICK_START.md** - 5-minute local setup

---

**Your automated laundry management system is ready for production! 🎉**

Need to add features? The backend structure is designed to scale - just add new API routes in `/app/api/` and they automatically become endpoints.