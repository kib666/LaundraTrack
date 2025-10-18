# Role-Based Login Redirect Flow

## Overview
The system now implements a complete role-based login flow where users are automatically redirected to their appropriate portal after logging in.

## Login Flow

### 1. **Customer Portal** (`/customer`)
The main entry point for all users

**Features:**
- Three tabs: Track, Login, Register
- Login UI displays three user type badges:
  - 👤 **Customer** - Track orders
  - 👥 **Staff** - Manage tasks  
  - 🛡️ **Admin** - Full control
- Order tracking for public visitors
- Order creation and history for logged-in customers

### 2. **Automatic Role-Based Redirect**
When a user logs in, the system automatically:

```
Login Credentials
      ↓
Session Created & Role Loaded
      ↓
    ┌─────────────────────────┐
    │  Check User Role        │
    └─────────────────────────┘
        ↙            ↓            ↘
    ADMIN        STAFF         CUSTOMER
       ↓            ↓               ↓
    /admin      /staff         /customer
   Dashboard    Portal          Portal
```

**Redirect Details:**
- **Admin users** → Redirected to `/admin` (Admin Dashboard)
- **Staff users** → Redirected to `/staff` (Staff Portal)  
- **Customer users** → Stay on `/customer` (Customer Portal)

### 3. **Loading Screen During Redirect**
While redirecting, users see:
- Spinner animation
- Clear message indicating which portal they're going to
- Prevents page flashing and improves UX

### 4. **Portal Protection**
Each portal validates the user's role:

| Portal | Required Role | Redirect on Fail |
|--------|---------------|------------------|
| `/admin` | admin only | `/customer?error=unauthorized` |
| `/staff` | staff or admin | `/customer?error=unauthorized` |
| `/customer` | anyone | N/A (redirects non-customers) |

---

## Test Accounts

### Admin Account
```
Email: admin@laundry.com
Password: Admin@123
Redirects to: /admin
```

### Staff Account
```
Email: staff@laundry.com
Password: Staff@123
Redirects to: /staff
```

### Customer Account
```
Email: customer@laundry.com (or register a new one)
Password: (your password)
Stays on: /customer
```

---

## Testing Steps

### Test 1: Admin Login
1. Go to `http://localhost:3000/customer`
2. Click "Login" tab
3. Enter admin credentials:
   - Email: `admin@laundry.com`
   - Password: `Admin@123`
4. Click "Login"
5. ✅ Should see loading message "Redirecting to Admin Dashboard..."
6. ✅ Should be redirected to `/admin`
7. ✅ Admin dashboard should load with full controls

### Test 2: Staff Login
1. Go to `http://localhost:3000/customer`
2. Click "Login" tab
3. Enter staff credentials:
   - Email: `staff@laundry.com`
   - Password: `Staff@123`
4. Click "Login"
5. ✅ Should see loading message "Redirecting to Staff Portal..."
6. ✅ Should be redirected to `/staff`
7. ✅ Staff portal should load with task management

### Test 3: Customer Login
1. Go to `http://localhost:3000/customer`
2. Click "Login" tab
3. Register a new account OR use existing customer account
4. Click "Login"
5. ✅ Should stay on `/customer`
6. ✅ Should see order creation and history interface
7. ✅ Can create new orders

### Test 4: Unauthorized Access Prevention
1. Login as a **customer**
2. Manually navigate to `http://localhost:3000/admin`
3. ✅ Should be redirected back to `/customer?error=unauthorized`

1. Logout
2. Manually navigate to `http://localhost:3000/staff`
3. ✅ Should be redirected to `/customer?error=staff_access_required`

---

## Key Implementation Details

### Files Modified:
1. **`/app/customer/page.js`**
   - Added role-based redirect in main `CustomerPortal` component
   - Shows loading screen for non-customer users during redirect
   - Login UI shows three user type badges

2. **`/app/admin/layout.js`**
   - Validates user is admin before rendering admin pages
   - Shows loading while checking authentication
   - Redirects non-admin users to `/customer?error=unauthorized`

3. **`/app/staff/page.js`**
   - Validates user is staff or admin
   - Shows loading during auth check
   - Redirects unauthorized users appropriately

### Key Code Pattern:
```javascript
// Monitor session and redirect based on role
useEffect(() => {
    if (session?.user?.role && status === 'authenticated') {
        const redirectDelay = setTimeout(() => {
            if (session.user.role === 'admin') {
                window.location.href = '/admin';
            } else if (session.user.role === 'staff') {
                window.location.href = '/staff';
            }
        }, 500);
        return () => clearTimeout(redirectDelay);
    }
}, [session?.user?.role, status]);
```

---

## Debugging

### Check Session Info
Visit `http://localhost:3000/debug` to inspect:
- Current session data
- User email and role
- Authentication status
- Admin access indicators

### Console Logs
Check browser console for:
- Session updates
- Role validation
- Redirect events
- Any authentication errors

---

## What Happens Without Proper Role Checking?

❌ **Before these changes:**
- User logs in with admin account
- Gets redirected to customer portal with order creation form
- Can't access admin dashboard

✅ **After these changes:**
- User logs in with admin account
- Immediately redirected to admin dashboard
- Full access to admin controls

---

## Next Steps

1. Create more staff members using `/create-staff.js` script
2. Test all three user types thoroughly
3. Create staff user accounts as needed for your team
4. Monitor `/debug` page to verify session data is correct
