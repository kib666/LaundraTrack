# ⚡ Backend Quick Start Guide

Get the backend running and connected to frontend in **5 minutes**.

---

## 🎯 What You Get

✅ User registration (customer & staff)  
✅ User login with JWT  
✅ Admin approval workflow  
✅ Order management  
✅ Appointment booking  
✅ Automatic notifications  
✅ MongoDB integration  
✅ Vercel deployment ready  

---

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn
- MongoDB (local or Atlas cloud)
- Git

---

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

This adds:
- mongoose (MongoDB)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT tokens)
- uuid (Unique IDs)

### Step 2: Setup Environment (1 min)

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/laudratrack

JWT_SECRET=your-super-secret-key-here
JWT_EXPIRE=7d

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=another-secret-here
```

### Step 3: Start MongoDB (1 min)

**Option A: Docker**
```bash
docker-compose up -d mongo
```

**Option B: Local MongoDB**
- Install MongoDB Community
- Run: `mongod`

**Option C: MongoDB Atlas** (Cloud)
- Get connection string
- Paste in MONGODB_URI

### Step 4: Run Development Server (1 min)
```bash
npm run dev
```

Visit: http://localhost:3000

### Step 5: Test API (1 min)

#### Register Customer
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "Test@1234",
    "confirmPassword": "Test@1234",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "...",
    "email": "customer@test.com",
    "role": "customer",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "Test@1234"
  }'
```

---

## 📝 Complete API Endpoints

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user (customer or staff) |
| POST | `/api/auth/login` | Login user |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users (admin only) |
| PATCH | `/api/admin/users/[id]/approve` | Approve/Reject staff (admin only) |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get orders (filtered by role) |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/[id]` | Get single order |
| PATCH | `/api/orders/[id]` | Update order |
| DELETE | `/api/orders/[id]` | Delete order (admin only) |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Get appointments |
| POST | `/api/appointments` | Book appointment |

---

## 🔑 Authentication with JWT

### How It Works

1. **Register/Login** → Get JWT token
2. **Store token** in localStorage
3. **Send token** in Authorization header for every request
4. **Token expires** after 7 days (or custom time)
5. **Re-login** to get new token

### Using Token in Requests

```bash
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### In JavaScript (Frontend)

```javascript
// Login and get token
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const { token } = await response.json();

// Store token
localStorage.setItem('token', token);

// Use token in API calls
const orders = await fetch('/api/orders', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

---

## 👥 User Roles & Permissions

### Customer
- Can register automatically (no approval needed)
- Can create orders
- Can view only own orders
- Can book appointments
- Status: ACTIVE immediately

### Staff
- Must register and await admin approval
- Cannot login until approved
- Status: PENDING until admin approves
- Can view assigned orders
- Can update order status

### Admin
- Full access to all features
- Can approve/reject staff
- Can view all orders
- Can delete records
- Can assign orders to staff

---

## 📊 Database Collections

### Users Collection
```javascript
db.users.find()
// Returns all users with hashed passwords
```

### Orders Collection
```javascript
db.orders.find({ customerId: ObjectId("...") })
// Returns customer's orders
```

### Appointments Collection
```javascript
db.appointments.find({ date: { $gte: new Date("2024-02-15") } })
// Returns appointments after date
```

---

## 🔄 Workflow Example

### Complete Flow: Register → Create Order → Deliver

```
1. CUSTOMER REGISTERS
   POST /api/auth/register
   → Status: ACTIVE (no approval needed)
   → Returns JWT token
   → Can immediately use app

2. CUSTOMER CREATES ORDER
   POST /api/orders
   Headers: Authorization: Bearer token
   → Status: PENDING
   → Admin receives notification

3. ADMIN APPROVES ORDER
   PATCH /api/orders/[id]
   → Status: CONFIRMED
   → Customer gets notification

4. ADMIN ASSIGNS STAFF
   PATCH /api/orders/[id]
   → staffId: staff_user_id
   → Staff notified

5. STAFF UPDATES STATUS
   PATCH /api/orders/[id]
   → Status: PICKED_UP
   → Customer sees update

6. ORDER DELIVERED
   PATCH /api/orders/[id]
   → Status: DELIVERED
   → Customer notified
   → Order complete
```

---

## 🧪 Testing Different Roles

### Test 1: Register as Customer
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@test.com",
    "password": "Test@1234",
    "confirmPassword": "Test@1234",
    "firstName": "John",
    "lastName": "Customer",
    "phone": "+1111111111",
    "role": "customer"
  }'

# Login and get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@test.com",
    "password": "Test@1234"
  }'
```

### Test 2: Register as Staff (Pending Approval)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff1@test.com",
    "password": "Staff@1234",
    "confirmPassword": "Staff@1234",
    "firstName": "Jane",
    "lastName": "Staff",
    "phone": "+2222222222",
    "role": "staff"
  }'

# Result: Status PENDING, no token returned
# Staff must wait for admin approval
```

### Test 3: Admin Approves Staff
```bash
# First, register as admin (create manually in database)
# Then approve staff user

curl -X PATCH http://localhost:3000/api/admin/users/staff_user_id/approve \
  -H "Authorization: Bearer admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve"
  }'

# Now staff can login
```

### Test 4: Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer customer_token" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "name": "Shirt", "quantity": 2, "price": 5.00 },
      { "name": "Pants", "quantity": 1, "price": 10.00 }
    ],
    "totalAmount": 20.00,
    "pickupAddress": "123 Main St",
    "deliveryAddress": "456 Oak Ave",
    "description": "Regular laundry",
    "serviceType": "wash"
  }'
```

---

## 📱 Frontend Integration

The `/services` folder already has everything:

```javascript
// Use existing services
import { register, login } from '@/services/authService';
import { getOrders, createOrder } from '@/services/orderService';
import { useApi } from '@/hooks/useApi';
import { useForm } from '@/hooks/useForm';

// Example: Registration Form
const RegistrationForm = () => {
  const { values, handleChange, handleSubmit } = useForm(
    { email: '', password: '', ... },
    async (formData) => {
      await register(formData);
    }
  );
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={values.email} onChange={handleChange} />
      <input name="password" value={values.password} onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
};
```

---

## 🚀 Deploy to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Add backend API"
git push origin main
```

### 2. Set Environment Variables in Vercel
```
MONGODB_URI = mongodb+srv://...
JWT_SECRET = your_secret
NEXTAUTH_SECRET = your_secret
```

### 3. Deploy
```bash
vercel --prod
```

Your backend is now live! 🎉

---

## ✅ Verification Checklist

- [ ] npm install completes without errors
- [ ] MongoDB is running/accessible
- [ ] .env.local has all required variables
- [ ] npm run dev starts server
- [ ] http://localhost:3000 loads
- [ ] Register endpoint works (201 response)
- [ ] Login endpoint works (200 response)
- [ ] JWT token is returned
- [ ] Can make authenticated requests
- [ ] Orders can be created
- [ ] Admin endpoints work

---

## 🆘 Troubleshooting

### "MongoDB Connection Failed"
```
Solution:
1. Check MONGODB_URI in .env.local
2. Verify MongoDB is running
3. Check credentials if using Atlas
4. Whitelist IP 0.0.0.0/0 in MongoDB Atlas
```

### "Cannot find module 'mongoose'"
```
Solution:
npm install mongoose bcryptjs jsonwebtoken uuid
```

### "JWT Verification Failed"
```
Solution:
1. Check JWT_SECRET matches frontend
2. Check token not expired
3. Try logging in again
```

### "CORS Error"
```
Solution:
Already configured in vercel.json
Restart dev server: Ctrl+C, npm run dev
```

---

## 📚 Learn More

- See `BACKEND_API.md` for detailed API docs
- See `USER_WORKFLOWS.md` for complete workflows
- See `VERCEL_DEPLOYMENT.md` for deployment guide
- See `USING_NEW_STRUCTURE.md` for code patterns

---

## 🎉 You're Ready!

Your backend is fully functional with:
- ✅ User authentication
- ✅ Role-based access control
- ✅ Order management
- ✅ Appointment booking
- ✅ MongoDB persistence
- ✅ Vercel ready

**Start building amazing features!** 🚀
