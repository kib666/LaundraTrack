# 🚀 Vercel Deployment Quick Reference

## Copy These Values Exactly

### Environment Variables to Paste in Vercel

```
MONGODB_URI=mongodb+srv://laudratrack_user:<PASSWORD>@cluster0.xxxxx.mongodb.net/laudratrack?retryWrites=true&w=majority

JWT_SECRET=d3b5c2f8a1e6b4c9f7d2e5a8b1c4f7d0a3e6b9c2f5d8e1a4b7c0d3e6f9a2b5

NEXTAUTH_SECRET=c4b6a1f9d2e8c5b7f0a3d6e9b2c5f8a1d4e7b0c3f6a9d2e5b8c1f4a7d0e3b6
```

**Note:** Replace `<PASSWORD>` with your MongoDB Atlas password

---

## Step-by-Step Deployment

### 1. Vercel Setup (5 min)
- [ ] Go to https://vercel.com/new
- [ ] Import LaudraTrack GitHub repository
- [ ] Click "Import"

### 2. MongoDB Atlas Setup (10 min)
- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create FREE cluster
- [ ] Create database user: `laudratrack_user`
- [ ] Get connection string
- [ ] Copy MONGODB_URI

### 3. Add Environment Variables in Vercel
- [ ] Paste MONGODB_URI (replace <PASSWORD>)
- [ ] Paste JWT_SECRET
- [ ] Paste NEXTAUTH_SECRET

### 4. Deploy
- [ ] Click "Deploy" button
- [ ] Wait 2-3 minutes
- [ ] ✅ Done! Visit your live URL

---

## Test Your Live Deployment

Once deployed, test these endpoints:

### Register a Customer (Auto-Activated)
```bash
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "Password123!",
    "role": "customer",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Response:** 
- Customer created with status: "active"
- JWT token returned
- Can login immediately

### Register Staff (Pending Approval)
```bash
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@test.com",
    "password": "Password123!",
    "role": "staff",
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

**Expected Response:**
- Staff created with status: "pending"
- No token (awaiting admin approval)
- Login will fail until approved

### Login
```bash
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "Password123!"
  }'
```

**Expected Response:**
- JWT token returned
- Token valid for 7 days

---

## Troubleshooting

### Issue: Build fails
**Solution:** Check Vercel build logs → Fix any errors → Redeploy

### Issue: MongoDB connection error
**Solution:** 
1. Verify MONGODB_URI is correct
2. Check MongoDB Atlas IP whitelist (should allow anywhere)
3. Verify password is correct

### Issue: Endpoints return 404
**Solution:**
1. Check your Vercel project URL
2. Verify /api/ prefix is included
3. Restart Vercel deployment

---

## What's Deployed

✅ Fully Automated Backend
- Customer registration → Auto-activated
- Staff registration → Pending approval
- Admin approval system
- Order creation with auto-tracking
- JWT authentication
- Role-based access control

✅ 10+ API Endpoints
- Authentication
- Order management
- Staff approval
- Appointment booking

✅ Security
- Password hashing (bcryptjs)
- JWT tokens (7-day expiration)
- Role-based access control
- Input validation
- CORS headers

---

## Support Files

Need help? Check these files in your repo:
- `README_FIRST.md` - Quick start
- `GET_STARTED.md` - Local testing
- `SYSTEM_COMPLETE.md` - Architecture overview
- `BACKEND_API.md` - API reference