# 🔐 Portal Authentication & Auto-Redirect Guide

## Overview

The LaudraTrack system now features an **integrated authentication flow** directly from the homepage. When users click on a portal card (Staff, Admin, or Customer), they are presented with a role-specific sign-in/sign-up modal. After successful authentication, the system automatically saves their session and redirects them to their corresponding portal dashboard.

---

## ✨ Key Features

### 1. **Portal-Specific Authentication Modal**

- Click any portal card to open the authentication modal
- Modal displays role-specific information
- Clear indication of what the selected portal offers

### 2. **Smart Sign In/Sign Up**

- **Customer & Staff Portals**: Users can sign up or sign in
- **Admin Portal**: Sign in only (Admins created by Super Admins only)
- Automatic role assignment based on portal selection

### 3. **Session Management**

- Session data stored securely via NextAuth
- User data includes: ID, email, name, role, and JWT token
- Sessions persist across browser sessions (returning users go straight to portal)

### 4. **Automatic Redirection**

- After successful authentication, users are automatically redirected to their portal
- Redirection uses role-based routing:
  - `customer` → `/customer`
  - `staff` → `/staff`
  - `admin` → `/admin`

---

## 🏗️ Architecture

### Components

#### **PortalAuthModal.js** (`/components/common/PortalAuthModal.js`)

- Handles all authentication UI and logic
- Manages sign in/sign up forms
- Handles auto-redirection after successful authentication
- Portal-specific restrictions (no signup for admin)

#### **page.js** (`/app/page.js`)

- Main homepage component
- Portal card button handlers
- Modal state management
- Triggers authentication flow on card click

### Authentication Flow

```
User clicks Portal Card
        ↓
[Portal Type Captured]
        ↓
[Auth Modal Opens]
        ↓
User Sign In or Sign Up
        ↓
[Credentials Sent to API]
        ↓
[User Verified & Session Created]
        ↓
[Automatic Redirect to Portal]
```

---

## 🔧 How It Works

### Step 1: User Clicks Portal Card

**File**: `/app/page.js`

```javascript
const handlePortalClick = (portalType) => {
  setSelectedPortal(portalType);
  setIsAuthModalOpen(true);
};
```

Portal types: `'customer'`, `'staff'`, `'admin'`

### Step 2: Authentication Modal Opens

**File**: `/components/common/PortalAuthModal.js`

The modal displays:

- Portal name and description
- Sign in form (always available)
- Sign up form (Customer & Staff only)
- Role-specific information

### Step 3: User Authenticates

**Sign In Flow**:

```javascript
const result = await signIn('credentials', {
  redirect: false,
  email,
  password,
});
```

**Sign Up Flow**:

```javascript
POST /api/auth/register
{
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword,
  role: portalType  // Role determined by portal selection
}
```

### Step 4: Session Created (NextAuth)

**File**: `/app/api/auth/[...nextauth]/route.js`

The session includes:

- User ID
- Email
- Name (First + Last)
- Role (customer, staff, admin)
- Status (active, pending, etc.)
- JWT Token

### Step 5: Automatic Redirect

```javascript
useEffect(() => {
  if (session?.user?.role && isOpen) {
    const redirectDelay = setTimeout(() => {
      const roleRedirectMap = {
        admin: '/admin',
        staff: '/staff',
        customer: '/customer',
      };

      const redirectUrl = roleRedirectMap[session.user.role];
      if (redirectUrl) {
        onClose();
        window.location.href = redirectUrl;
      }
    }, 1500);
  }
}, [session?.user?.role, isOpen, onClose]);
```

---

## 🔒 Portal Access Control

### Customer Portal (`/customer`)

- **Who Can Access**: All authenticated customers
- **Registration**: Available via portal card
- **Auto-Redirect**: Immediate after sign in/up

### Staff Portal (`/staff`)

- **Who Can Access**: Users with `role: 'staff'` AND `status: 'active'`
- **Registration**: Available (status = 'pending' until approved)
- **Auto-Redirect**: Only if status is 'active'
- **Note**: Unauthenticated users redirect to `/customer?error=staff_access_required`

### Admin Portal (`/admin`)

- **Who Can Access**: Users with `role: 'admin'` only
- **Registration**: NOT available (accounts created by Super Admins)
- **Sign In**: Required credentials
- **Note**: Redirects unauthorized users to `/customer?error=unauthorized`

---

## 📝 User Data Flow

### Registration Data Structure

```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+639123456789",
  password: "SecurePass123!",
  role: "customer" // or "staff" based on portal selection
}
```

### Session Data Structure

```javascript
session.user = {
  id: '507f1f77bcf86cd799439011',
  email: 'john@example.com',
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  role: 'customer',
  status: 'active',
  token: 'eyJhbGc...', // JWT token
};
```

---

## 🚀 Usage Examples

### Accessing the Customer Portal

1. User on homepage clicks **"Track Your Order"** or **"Customer Portal" card**
2. Auth modal opens showing "Customer Portal"
3. User can:
   - Sign in if they have an account
   - Create a new account
4. After authentication:
   - Session saved with `role: 'customer'`
   - User redirected to `/customer`
   - Customer dashboard loads with their data

### Accessing the Staff Portal

1. User clicks **"Staff Portal" card**
2. Auth modal opens showing "Staff Portal"
3. User can:
   - Sign in if approved
   - Register (status will be 'pending' until admin approves)
4. If status is 'active':
   - User redirected to `/staff`
5. If status is 'pending':
   - Staff page will show access denied until approved

### Accessing the Admin Portal

1. User clicks **"Admin Portal" card** or **"Business Login"**
2. Auth modal opens showing "Admin Portal"
3. User can:
   - Sign in with admin credentials only
   - NO sign-up option (message: "Admin accounts are created by Super Admins only")
4. After authentication:
   - Session saved with `role: 'admin'`
   - User redirected to `/admin`

---

## 🔄 Returning Users

### Session Persistence

Returning users benefit from NextAuth's session persistence:

1. User visits homepage
2. System checks if valid session exists
3. If session is valid and not expired:
   - Clicking portal card may auto-redirect if correct role
   - Can access portal directly via URL

### Manual Portal Navigation

```javascript
// Can be bookmarked or accessed directly
https://yourdomain.com/customer
https://yourdomain.com/staff
https://yourdomain.com/admin

// Each portal checks session and redirects if unauthorized
```

---

## ⚙️ Configuration

### Password Requirements

From `/app/api/auth/register/route.js`:

- Minimum 8 characters
- Must include uppercase letter
- Must include number
- Must include special character

Example valid passwords:

- `SecurePass123!`
- `MyPwd@2024`
- `Admin#Password99`

### Staff Registration Flow

1. Staff member signs up via Staff Portal
2. Account created with `status: 'pending'`
3. Admin reviews pending staff
4. Admin approves staff account
5. Staff gets email (future feature)
6. Staff can now sign in

### Email Uniqueness

- Each email can only be registered once
- Attempting to register with existing email shows error
- Use different email for different accounts

---

## 🛡️ Security Features

### NextAuth Integration

- Secure credentials provider
- JWT-based sessions
- Password hashing with bcrypt
- Session expiration handling

### Role-Based Access Control

- Each portal validates user role
- Unauthorized redirects to appropriate error page
- Session data includes role verification

### Admin-Only Portals

- Admin accounts cannot be self-registered
- Prevents unauthorized admin account creation
- Requires Super Admin intervention

### Password Security

- Strong password requirements enforced
- Passwords hashed before storage
- JWT tokens expire automatically

---

## 🐛 Troubleshooting

### Issue: "Invalid email or password"

**Solution**: Verify correct credentials. Password is case-sensitive.

### Issue: Staff account created but can't sign in

**Solution**: Check if status is 'pending'. Admin must approve first.

### Issue: Admin portal shows sign-up option

**Solution**: This should not happen. Clear cache and try again.

### Issue: Auto-redirect not working

**Solution**:

- Check browser console for errors
- Verify NextAuth session is initialized
- Check if session has valid role

### Issue: Session lost after refresh

**Solution**: This is expected if session expired. Sign in again.

---

## 📊 Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  role: String, // 'customer', 'staff', 'admin'
  status: String, // 'active', 'pending', 'inactive'
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 Related Files

| File                                    | Purpose                      |
| --------------------------------------- | ---------------------------- |
| `/app/page.js`                          | Homepage with portal buttons |
| `/components/common/PortalAuthModal.js` | Authentication modal UI      |
| `/app/api/auth/[...nextauth]/route.js`  | NextAuth configuration       |
| `/app/api/auth/register/route.js`       | Registration endpoint        |
| `/app/customer/page.js`                 | Customer portal              |
| `/app/staff/page.js`                    | Staff portal                 |
| `/app/admin/page.js`                    | Admin portal                 |
| `/lib/auth/jwt.js`                      | JWT token generation         |
| `/lib/db/models.js`                     | Database models              |

---

## 🚀 Future Enhancements

- [ ] Email verification for new accounts
- [ ] Two-factor authentication
- [ ] Password reset functionality
- [ ] Social login (Google, GitHub)
- [ ] Account profile management
- [ ] Staff approval notifications
- [ ] Session activity logging
- [ ] Automatic session timeout warning

---

## ✅ Verification Checklist

- [x] Portal cards open authentication modal
- [x] Role-specific forms displayed
- [x] Admin portal disables registration
- [x] Session created after authentication
- [x] Auto-redirect to portal on successful auth
- [x] Returning users access portals
- [x] Unauthorized users redirected
- [x] Role-based access control enforced
- [x] Password requirements validated
- [x] Email uniqueness enforced

---

## 📞 Support

For issues or questions about the authentication system:

1. Check this guide first
2. Review troubleshooting section
3. Check browser console for errors
4. Review server logs for auth errors

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: ✅ Production Ready
