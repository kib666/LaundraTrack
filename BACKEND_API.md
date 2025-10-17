# 🚀 LaudraTrack Backend API Documentation

## Overview

The backend is built with **Next.js API Routes** (Vercel Functions) and **MongoDB**. All API endpoints are automatically deployed to Vercel.

---

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

New packages added:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `uuid` - Unique ID generation

### 2. Setup Environment Variables

Create `.env.local` with:
```env
# Database
MONGODB_URI=mongodb://admin:password123@localhost:27017/laudratrack?authSource=admin

# Authentication
JWT_SECRET=your-very-secure-secret-key-here
JWT_EXPIRE=7d

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### 3. Setup MongoDB Locally (Optional)

Using Docker Compose:
```bash
docker-compose up -d
```

Or use MongoDB Atlas (Cloud):
```
mongodb+srv://username:password@cluster.mongodb.net/laudratrack
```

### 4. Run Development Server
```bash
npm run dev
```

API will be available at `http://localhost:3000/api`

---

## 📊 Database Models

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  phone: String (required),
  role: 'customer' | 'staff' | 'admin' (default: 'customer'),
  status: 'pending' | 'approved' | 'rejected' | 'active' (default: 'active' for customer, 'pending' for staff),
  profileImage: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  isActive: Boolean (default: true),
  approvedBy: ObjectId (reference to admin user),
  approvedAt: Date,
  rejectionReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  trackingNumber: String (unique),
  customerId: ObjectId (reference to User, required),
  staffId: ObjectId (reference to User),
  status: 'pending' | 'confirmed' | 'in_progress' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'cancelled',
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number (required),
  description: String,
  notes: String,
  pickupDate: Date,
  deliveryDate: Date,
  pickupAddress: String (required),
  deliveryAddress: String (required),
  paymentStatus: 'pending' | 'paid' | 'refunded',
  paymentMethod: String,
  serviceType: 'wash' | 'dry-clean' | 'iron' | 'combo' (default: 'wash'),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model
```javascript
{
  customerId: ObjectId (reference to User, required),
  type: 'pickup' | 'delivery' (required),
  status: 'available' | 'booked' | 'completed' | 'cancelled',
  date: Date (required),
  timeSlot: '08:00-10:00' | '10:00-12:00' | '14:00-16:00' | '16:00-18:00' (required),
  notes: String,
  orderId: ObjectId (reference to Order),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication Flow

### User Registration (Customer)
1. User fills registration form
2. Validates email & password strength
3. Hashes password with bcrypt
4. Creates user in database
5. **Automatically approved** (role: 'customer', status: 'active')
6. Returns JWT token

### Staff Registration
1. Staff fills registration form
2. Same validation as customer
3. Creates user with role: 'staff', status: 'pending'
4. **NO token returned** - awaits admin approval
5. Admin receives notification

### Admin Approval
1. Admin views pending users
2. Reviews staff application
3. Approves/Rejects user
4. Approved: status changes to 'active'
5. Staff can now login

### Login
1. User enters email & password
2. Finds user by email
3. Compares password with bcrypt
4. Validates user status
5. Generates JWT token (valid for 7 days)
6. Returns token to frontend

---

## 📡 API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "customer" // or "staff"
}

Response (201):
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "status": "active"
  },
  "token": "jwt_token_here"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "status": "active"
  },
  "token": "jwt_token_here"
}
```

---

### Admin Users Management

#### Get All Users (Admin Only)
```
GET /api/admin/users?role=staff&status=pending&page=1&limit=10
Authorization: Bearer jwt_token

Response (200):
{
  "success": true,
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### Approve User (Admin Only)
```
PATCH /api/admin/users/[id]/approve
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "action": "approve"
}

Response (200):
{
  "success": true,
  "message": "User has been approved as staff",
  "user": { ... }
}
```

#### Reject User (Admin Only)
```
PATCH /api/admin/users/[id]/approve
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "action": "reject",
  "reason": "Incomplete information"
}

Response (200):
{
  "success": true,
  "message": "User has been rejected",
  "user": { ... }
}
```

---

### Orders

#### Get All Orders
```
GET /api/orders?status=pending&page=1&limit=10
Authorization: Bearer jwt_token

Note: Customers only see their own orders
      Staff/Admin see all orders

Response (200):
{
  "success": true,
  "orders": [...],
  "pagination": { ... }
}
```

#### Get Single Order
```
GET /api/orders/[id]
Authorization: Bearer jwt_token

Response (200):
{
  "success": true,
  "order": { ... }
}
```

#### Create Order
```
POST /api/orders
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "items": [
    {
      "name": "T-Shirt",
      "quantity": 2,
      "price": 5.00
    },
    {
      "name": "Pants",
      "quantity": 1,
      "price": 10.00
    }
  ],
  "totalAmount": 20.00,
  "description": "Regular laundry",
  "pickupAddress": "123 Main St",
  "deliveryAddress": "456 Oak Ave",
  "pickupDate": "2024-02-15T10:00:00Z",
  "deliveryDate": "2024-02-17T14:00:00Z",
  "serviceType": "wash"
}

Response (201):
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "order_id",
    "trackingNumber": "ORD-1234567890-ABCD1234",
    "status": "pending",
    ...
  }
}
```

#### Update Order
```
PATCH /api/orders/[id]
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "status": "confirmed",
  "staffId": "staff_id",
  "notes": "Special care for delicate items"
}

Response (200):
{
  "success": true,
  "message": "Order updated successfully",
  "order": { ... }
}
```

#### Delete Order (Admin Only)
```
DELETE /api/orders/[id]
Authorization: Bearer jwt_token

Response (200):
{
  "success": true,
  "message": "Order deleted successfully"
}
```

---

### Appointments

#### Get Appointments
```
GET /api/appointments?type=pickup&date=2024-02-15&page=1&limit=20
Authorization: Bearer jwt_token

Note: Customers see their own appointments
      Staff/Admin see all appointments

Response (200):
{
  "success": true,
  "appointments": [...],
  "pagination": { ... }
}
```

#### Book Appointment
```
POST /api/appointments
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "type": "pickup",
  "date": "2024-02-15",
  "timeSlot": "10:00-12:00",
  "notes": "Ring doorbell twice",
  "orderId": "order_id" (optional)
}

Response (201):
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": { ... }
}
```

---

## 🔒 Authorization Levels

### Customer
- ✓ Register
- ✓ Login
- ✓ View own orders
- ✓ Create orders
- ✓ Update own pending orders
- ✓ View own appointments
- ✓ Book appointments
- ✗ View other users' data
- ✗ Manage staff
- ✗ Delete orders

### Staff
- ✓ Must be approved by admin
- ✓ Login (after approval)
- ✓ View assigned orders
- ✓ Update order status
- ✓ View appointments
- ✗ Create orders
- ✗ Approve users
- ✗ Delete orders

### Admin
- ✓ All permissions
- ✓ View all users
- ✓ Approve/Reject staff
- ✓ View all orders
- ✓ Delete orders
- ✓ Manage staff

---

## 📝 Request Headers

All requests (except register & login) require:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request data",
  "error": "Details about the error"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details"
}
```

---

## 🚀 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Add backend API with MongoDB integration"
git push origin main
```

### 2. Connect to Vercel
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Select your GitHub repository
- Click "Import"

### 3. Set Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| MONGODB_URI | Your MongoDB Atlas connection string |
| JWT_SECRET | Your JWT secret key |
| JWT_EXPIRE | 7d |
| NEXTAUTH_SECRET | Your NextAuth secret |
| NEXTAUTH_URL | Your production domain |
| NODE_ENV | production |

### 4. Deploy
```bash
vercel --prod
```

Or push to GitHub and Vercel will auto-deploy.

---

## 📊 MongoDB Atlas Setup (Cloud)

1. Go to [mongodb.com/cloud](https://www.mongodb.com/cloud/atlas)
2. Create account and cluster
3. Create database user
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/laudratrack`
5. Add it to `.env.local` and Vercel environment variables
6. Whitelist Vercel IPs (0.0.0.0/0 for development)

---

## 🔄 Workflow Example

### Complete Flow: User Registration → Admin Approval → Login

```mermaid
1. Customer registers
   ↓
2. Account created (status: active)
   ↓
3. JWT token generated
   ↓
4. Customer logs in and creates order
   ↓
5. Staff registers
   ↓
6. Account created (status: pending)
   ↓
7. NO token - awaits approval
   ↓
8. Admin approves staff
   ↓
9. Staff status: active
   ↓
10. Staff logs in and views orders
    ↓
11. Staff updates order status
    ↓
12. Customer sees status updates
```

---

## 🧪 Testing with cURL

### Register Customer
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "customer"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Orders (with token)
```bash
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📚 Frontend Integration

### Using Services Layer

```javascript
// /services/authService.js
import apiClient from './apiClient';

export const register = (userData) =>
  apiClient.post('/auth/register', userData);

export const login = (email, password) =>
  apiClient.post('/auth/login', { email, password });

// Usage in component
import { register } from '@/services/authService';
import { useApi } from '@/hooks/useApi';

const { data, loading, error, execute } = useApi(register);
await execute(formData);
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error
- Check connection string
- Verify credentials
- Whitelist IP addresses
- Test locally first

### JWT Token Issues
- Token expired? Regenerate by logging in again
- Invalid token? Check JWT_SECRET is same everywhere
- Token not sent? Add Authorization header

### CORS Issues
- Already configured in vercel.json
- Check API URL in .env.local
- Ensure headers are correct

---

## 📞 Support

For issues:
1. Check `.env.local` is properly configured
2. Verify MongoDB connection
3. Check browser console for errors
4. Review API error messages
5. Check Vercel logs in dashboard

---

**Happy Backend Development! 🚀**