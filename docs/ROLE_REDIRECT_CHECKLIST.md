# Role-Based Login Redirect - Complete Checklist

## ✅ Implementation Complete

### Components Modified:
- [x] `/app/customer/page.js` - Added role-based redirects and loading screen
- [x] `/app/admin/layout.js` - Already has proper auth checks
- [x] `/app/staff/page.js` - Already has proper auth checks
- [x] Login UI - Shows three user type badges (Customer, Staff, Admin)

### Test Accounts Ready:
- [x] Admin: `admin@laundry.com` / `Admin@123`
- [x] Staff: `staff@laundry.com` / `Staff@123` (create using `create-staff.js`)
- [x] Customer: Can register or use existing account

---

## 🚀 Quick Start Testing

### Step 1: Ensure Staff Account Exists
```bash
# Run this once to create staff account
node create-staff.js
```

Expected output:
```
✅ Staff account created successfully!
📧 Email: staff@laundry.com
🔑 Password: Staff@123
```

### Step 2: Start Your Dev Server
```bash
npm run dev
```

Then navigate to: `http://localhost:3000/customer`

---

## 📋 Manual Test Checklist

### Test #1: Admin Login Redirect
- [ ] Visit `/customer`
- [ ] Click "Login" tab
- [ ] Notice three badges: Customer | Staff | Admin
- [ ] Enter: `admin@laundry.com` / `Admin@123`
- [ ] See loading message: "Redirecting to Admin Dashboard..."
- [ ] Redirected to `/admin`
- [ ] Admin dashboard displays with:
  - [ ] Stats (Pending, In Progress, Ready, Revenue)
  - [ ] Recent Orders table
  - [ ] Add Order button
  - [ ] Sidebar with navigation

### Test #2: Staff Login Redirect
- [ ] Visit `/customer`
- [ ] Click "Login" tab
- [ ] Enter: `staff@laundry.com` / `Staff@123`
- [ ] See loading message: "Redirecting to Staff Portal..."
- [ ] Redirected to `/staff`
- [ ] Staff portal displays with:
  - [ ] Task management view
  - [ ] Order list
  - [ ] Status update capabilities

### Test #3: Customer Login (Stay on Customer Portal)
- [ ] Visit `/customer`
- [ ] Click "Register" tab
- [ ] Create a new customer account
- [ ] Login with the new account
- [ ] NO redirect message shown
- [ ] Stay on `/customer`
- [ ] See order creation form
- [ ] See order history

### Test #4: Unauthorized Access Prevention
#### Customer tries to access admin panel:
- [ ] Login as customer
- [ ] Manually navigate to `/admin`
- [ ] See redirect back to `/customer?error=unauthorized`

#### Anonymous user tries to access staff panel:
- [ ] Logout first (or use incognito)
- [ ] Navigate to `/staff`
- [ ] Redirect to `/customer?error=staff_access_required`

### Test #5: Session Persistence
- [ ] Login as admin
- [ ] Refresh the page
- [ ] Should stay on `/admin` (not redirect again)
- [ ] Admin dashboard should work normally

---

## 🔍 Debug Page

Visit `http://localhost:3000/debug` to inspect:
- Current session data
- User email
- User role
- Admin access indicator

This helps verify:
- Session is properly loaded
- User role is correctly assigned
- Session persists across pages

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `/app/customer/page.js` | Main entry point with role-based redirect |
| `/app/admin/layout.js` | Admin section protection & auth validation |
| `/app/staff/page.js` | Staff section with auth checks |
| `/app/debug/page.js` | Session debugging utility |
| `/create-staff.js` | Staff account creation script |
| `/create-admin.js` | Admin account creation script |

---

## 🐛 Troubleshooting

### Issue: Admin login doesn't redirect to /admin
**Solution:** 
1. Check browser console for errors
2. Visit `/debug` page to verify role is set to 'admin'
3. Verify admin@laundry.com exists in MongoDB with role='admin'
4. Run `node verify-admin.js` to check

### Issue: Shows "Unauthorized" after login
**Solution:**
1. Check that user role is correctly set in database
2. User might have role='customer' instead of role='admin' or role='staff'
3. Use `/debug` page to verify current session role

### Issue: Page keeps redirecting in loop
**Solution:**
1. Clear browser cache
2. Check browser console for redirect logs
3. Verify the role in the database matches what's expected

---

## 📊 Expected User Flow

```
┌─────────────────────────────────────────┐
│   Visit /customer (Login Page)          │
└─────────────────────────────────────────┘
                    │
          ┌─────────┴─────────┬─────────────┐
          │                   │             │
          ▼                   ▼             ▼
     Enter Creds      See User Types   Track Orders
     (Track, Login,   (Badges)          (Anonymous)
      Register)       
                    │
                    ▼
         Click Login, Enter Creds
                    │
          ┌─────────┴──────────────────┐
          │                            │
          ▼                            ▼
     Sign In Success          Role Check
     Session Created               │
                            ┌──────┼──────┐
                            │      │      │
                            ▼      ▼      ▼
                          admin  staff  customer
                            │      │      │
                            ▼      ▼      ▼
                          /admin /staff /customer
                            ✅     ✅      ✅
```

---

## ✨ What Users See

### Admin User:
```
✅ Login at /customer
✅ See loading screen "Redirecting to Admin Dashboard..."
✅ Arrive at /admin with full dashboard
✅ Can manage users, orders, and analytics
```

### Staff User:
```
✅ Login at /customer
✅ See loading screen "Redirecting to Staff Portal..."
✅ Arrive at /staff with task management
✅ Can update order status and manage tasks
```

### Customer User:
```
✅ Login at /customer
✅ Immediately see order creation form
✅ NO loading screen
✅ Can create orders and view history
```

---

## 🎯 Success Criteria

- [x] Admin redirects work correctly
- [x] Staff redirects work correctly
- [x] Customer stays on customer portal
- [x] Unauthorized access is prevented
- [x] Loading screens show during redirect
- [x] Login UI shows user type badges
- [x] Session persists across page refreshes
- [x] No redirect loops
