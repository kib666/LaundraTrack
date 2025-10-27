# Super Admin Feature - Quick Setup

## What Was Created

### New Files & Directories

1. ✅ **Components**
   - `components/common/SuperAdminLoginModal.js` - Login modal for super admin

2. ✅ **API Routes**
   - `app/api/auth/superadmin/route.js` - Authentication endpoint
   - `app/api/superadmin/admins/route.js` - Get/Create admins endpoint
   - `app/api/superadmin/admins/[id]/route.js` - Update/Delete admin endpoint

3. ✅ **Dashboard**
   - `app/superadmin/page.js` - Super Admin Dashboard (main interface)

4. ✅ **Documentation**
   - `docs/SUPERADMIN_GUIDE.md` - Complete user guide

5. ✅ **Scripts**
   - `scripts/create-superadmin.js` - Setup script (updated)

### Updated Files

- `app/page.js` - Added super admin login modal trigger on logo click

---

## Setup Steps

### Step 1: Create Super Admin Account

Run this command once to create the default super admin user:

```bash
node scripts/create-superadmin.js
```

**Output:**

```
✅ Super admin created successfully!
Email: super@gmail.com
Password: superadmin123
```

### Step 2: Verify Setup

1. Start the development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click the **LaundraTrack logo** in the top-left corner
4. A login modal should appear

### Step 3: Login to Dashboard

1. Enter credentials:
   - Email: `super@gmail.com`
   - Password: `superadmin123`
2. Click **Login**
3. You should be redirected to `/superadmin`

---

## Super Admin Dashboard Features

✅ **View all admin accounts** - Table with admin details  
✅ **Add new admin** - Create admin with name, email, password  
✅ **Edit admin** - Update name, email, password  
✅ **Delete admin** - Remove admin account (permanent)  
✅ **Logout** - Secure logout with token clearing

---

## How It Works

### Login Flow

```
User clicks logo → Login modal appears →
Super admin enters credentials → API authenticates →
JWT token returned → Token stored in localStorage →
Redirects to /superadmin dashboard
```

### Dashboard Access

- Dashboard verifies localStorage token
- If no token, redirects to homepage
- Token expires after 24 hours (auto logout)

### Admin Management

```
Super Admin → Can add/edit/delete admins →
Each admin can login and manage orders/users
```

---

## Security

⚠️ **Important Security Notes:**

1. **Change Default Password**
   - After first login, edit the super admin account to change password
   - Use a strong password (mix of letters, numbers, symbols)

2. **Token Management**
   - JWT tokens are stored in browser's localStorage
   - Tokens expire after 24 hours
   - Manual logout clears token

3. **API Protection**
   - All admin management endpoints require valid super admin JWT
   - Regular admins cannot access these endpoints
   - Unauthorized requests return 401 status

---

## File Structure

```
LaudraTrack/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── superadmin/
│   │   │       └── route.js ✨ NEW
│   │   └── superadmin/
│   │       └── admins/
│   │           ├── route.js ✨ NEW
│   │           └── [id]/
│   │               └── route.js ✨ NEW
│   ├── superadmin/
│   │   └── page.js ✨ NEW
│   └── page.js (UPDATED)
├── components/
│   └── common/
│       └── SuperAdminLoginModal.js ✨ NEW
├── docs/
│   └── SUPERADMIN_GUIDE.md ✨ NEW
├── scripts/
│   └── create-superadmin.js (UPDATED)
└── SUPERADMIN_SETUP.md ✨ NEW (THIS FILE)
```

---

## Testing Checklist

- [ ] Run setup script successfully
- [ ] Click logo opens super admin login modal
- [ ] Login with super@gmail.com / superadmin123
- [ ] Dashboard loads with admin list
- [ ] Can add new admin
- [ ] Can edit admin information
- [ ] Can delete admin
- [ ] Can logout successfully
- [ ] Token expires after 24 hours (or manually test by clearing localStorage)

---

## Troubleshooting

### Setup Script Error

```bash
Error: Cannot find module 'mongoose'
```

**Solution:** Run `npm install` to ensure all dependencies are installed

### Login Error

```
"Invalid email or password"
```

**Solution:**

- Run setup script again: `node scripts/create-superadmin.js`
- Verify MongoDB connection

### Dashboard Won't Load

```
"Unauthorized" or redirects to homepage
```

**Solution:**

- Clear browser's localStorage
- Logout and login again
- Check browser console for errors

---

## Database Schema

Super Admin uses the existing User model with:

```javascript
{
  email: "super@gmail.com",
  password: "superadmin123" (hashed),
  firstName: "Super",
  lastName: "Admin",
  role: "superadmin",
  status: "active",
  isActive: true
}
```

---

## Next Steps (Optional Enhancements)

🔄 **Potential Future Features:**

- [ ] Audit log for admin modifications
- [ ] Two-factor authentication
- [ ] Activity history
- [ ] Bulk admin import
- [ ] Admin permission levels
- [ ] Session management (view active sessions)
- [ ] Super admin password reset via email

---

## Support

For complete documentation, see: `docs/SUPERADMIN_GUIDE.md`

For questions or issues, review the troubleshooting section above.
