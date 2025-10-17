# 🎯 GET STARTED - Your Next Steps

**Everything is built! Follow these steps to test and deploy.**

---

## ✅ What's Complete

- ✅ User registration (customer auto-active, staff pending)
- ✅ Admin staff approval workflow
- ✅ Complete order management system
- ✅ Appointment booking system
- ✅ Authentication with JWT tokens
- ✅ Role-based access control
- ✅ MongoDB database schema
- ✅ Vercel deployment ready
- ✅ Build passes without errors
- ✅ All documentation complete

---

## 🚀 OPTION 1: Test Locally First (Recommended)

### Step 1: Start MongoDB
**Choose one:**

**A) Using Docker** (Easiest)
```bash
docker run --name laudratrack-mongo -p 27017:27017 -d mongo:7.0
```

**B) Using local MongoDB**
```bash
# On Windows, mongod should already be in PATH after installation
mongod
```

**C) Using MongoDB Atlas** (Cloud - No local install needed)
- Skip to Step 3

### Step 2: Start Dev Server
```bash
npm run dev
```

You should see:
```
✓ Ready in 2.5s
  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
```

### Step 3: Test Registration Flow

**Open another terminal and test:**

**Register Customer** (Auto-Active)
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

You should see:
```json
{
  "message": "Registration successful",
  "user": {
    "email": "customer@example.com",
    "role": "customer",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

✅ **Customer is immediately active!**

---

**Register Staff** (Pending Approval)
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

You should see:
```json
{
  "message": "Registration successful. Awaiting admin approval",
  "user": {
    "email": "staff@example.com",
    "role": "staff",
    "status": "pending"
  },
  "token": null
}
```

❌ **Staff has no token yet (can't login)**

---

### Step 4: Manually Create Admin Account

You need to create an admin account in MongoDB to test approval:

```bash
# In MongoDB (using MongoDB Compass or mongosh)
# Database: laudratrack
# Collection: users

db.users.insertOne({
  email: "admin@example.com",
  password: "$2b$10$...", // This is a bcryptjs hash - see Step 5
  name: "Admin User",
  phone: "+1111111111",
  role: "admin",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Need to generate the password hash?** Run this in Node:
```javascript
const bcrypt = require('bcryptjs');
const password = 'AdminPass123!';
const hash = bcrypt.hashSync(password, 10);
console.log(hash); // Copy this hash
```

Or use MongoDB Compass → Insert document with the exact structure above

---

### Step 5: Admin Login & Approve Staff

**Admin logs in:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123!"
  }'
```

Copy the `token` from response

**Get pending staff list:**
```bash
curl -X GET "http://localhost:3000/api/admin/users?role=staff&status=pending" \
  -H "Authorization: Bearer {admin_token}"
```

**Approve the staff (replace with actual ID):**
```bash
curl -X POST http://localhost:3000/api/admin/users/{staff_id}/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "approvedBy": "admin@example.com"
  }'
```

Response:
```json
{
  "message": "Staff approved successfully",
  "user": {
    "status": "approved"
  }
}
```

✅ **Staff is now approved and can login!**

---

### Step 6: Test Complete Workflow

**Staff now logs in:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@example.com",
    "password": "SecurePass123!"
  }'
```

**Customer creates order:**
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

Response:
```json
{
  "message": "Order created successfully",
  "order": {
    "trackingNumber": "ORD-1707900000000-ABC12345",
    "status": "pending",
    "paymentStatus": "pending",
    "totalPrice": 20.00
  }
}
```

✅ **Order created with tracking number!**

---

## 🌐 OPTION 2: Deploy to Vercel Now

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Complete automated backend system"
git push origin main
```

### Step 2: Create Vercel Project
1. Go to **https://vercel.com/new**
2. Click "Import Git Repository"
3. Find your repository
4. Click "Import"

### Step 3: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
MONGODB_URI           = mongodb+srv://user:password@cluster.mongodb.net/laudratrack
JWT_SECRET            = (Use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_EXPIRE            = 7d
NEXTAUTH_URL          = https://your-project.vercel.app
NEXTAUTH_SECRET       = (Use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NEXT_PUBLIC_API_URL   = https://your-project.vercel.app/api
NODE_ENV              = production
```

**Click Save** → Vercel auto-deploys! ✅

### Step 4: Setup MongoDB Atlas
1. Go to **https://www.mongodb.com/cloud/atlas**
2. Sign up (free)
3. Create cluster (free tier available)
4. Create database user (username/password)
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the string: `mongodb+srv://username:password@cluster.mongodb.net/laudratrack`
6. Paste in Vercel environment variables

### Step 5: Test Production

Your app is at: **https://your-project.vercel.app**

Test with same cURL commands as local testing.

---

## 📚 Documentation Guide

**For different tasks, read:**

| Task | Document |
|------|----------|
| Local testing & workflows | `COMPLETE_SETUP_GUIDE.md` |
| All API endpoints reference | `BACKEND_API.md` |
| 5-minute quick start | `BACKEND_QUICK_START.md` |
| User registration workflows | `USER_WORKFLOWS.md` |
| Quick Vercel deploy | `VERCEL_QUICK_DEPLOY.md` |
| System architecture | `SYSTEM_ARCHITECTURE.md` |
| Production deployment | `VERCEL_DEPLOYMENT.md` |

---

## ✨ Key Features to Test

1. **Customer Registration** ✅
   - Auto-activated
   - Can login immediately
   - Can create orders

2. **Staff Workflow** ✅
   - Registers as pending
   - Awaits admin approval
   - Can login after approval
   - Can view assigned orders

3. **Admin Controls** ✅
   - Approve/reject staff
   - View all users
   - Manage orders
   - Assign staff

4. **Order Management** ✅
   - Create with auto-generated tracking
   - Status progression
   - Staff updates status
   - Customer tracks order

5. **Security** ✅
   - Passwords hashed (bcryptjs)
   - JWT tokens (7-day expiration)
   - Role-based access
   - Input validation

---

## 🐛 Troubleshooting

### "MONGODB_URI not defined"
→ Create `.env.local` file with MongoDB connection string

### "Connection refused to MongoDB"
→ Make sure MongoDB is running:
```bash
docker ps  # Check if container running
mongod     # Or start local MongoDB
```

### "Cannot login as staff"
→ Status must be "approved" (not "pending")
→ Use admin account to approve first

### "Order not created"
→ Must be authenticated (include JWT token)
→ All required fields must be present

---

## 🎉 You're All Set!

Your LaudraTrack system is production-ready with:

✅ **Automated Workflows**
- Customer auto-activation
- Staff approval process
- Order automation

✅ **Security**
- Password hashing
- JWT authentication
- Role-based access

✅ **Database**
- MongoDB cloud-ready
- 3 complete schemas
- Scalable design

✅ **Deployment**
- One-click Vercel deploy
- Auto-scaling functions
- Production monitoring

---

## 📞 Need Help?

Check these in order:
1. See if the issue is in `COMPLETE_SETUP_GUIDE.md`
2. Check `BACKEND_API.md` for endpoint details
3. Review error message carefully
4. Check Vercel logs: https://vercel.com/dashboard

---

**Next step: Choose between local testing or direct Vercel deployment above! 🚀**