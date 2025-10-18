# Super Admin Portal - Setup & Usage Guide

## Overview

The Super Admin Portal is a centralized management system for LaudraTrack that allows super administrators to create, manage, and oversee all system admins. This is the top-level administrative interface separate from the standard admin portal.

## Features

### 1. **Dashboard**

- **System Statistics**: View total counts of:
  - Active Admins
  - Total Staff Members
  - Total Customers
- **Recent Admins List**: See the latest admin accounts created in the system
- **Quick Overview**: Monitor the health of the platform at a glance

### 2. **Admin Management**

- **Create New Admins**: Add new admin accounts with:
  - First Name
  - Last Name
  - Email
  - Phone Number
  - Password

- **Edit Admins**: Update admin information:
  - First/Last Name
  - Email
  - Phone Number
  - Password (optional - leave blank to keep current password)

- **Delete Admins**: Remove admin accounts permanently
  - Confirmation dialog to prevent accidental deletion

- **View All Admins**: Table view showing:
  - Admin name
  - Email address
  - Phone number
  - Account status
  - Created date

### 3. **System Reports**

- **Key Metrics**:
  - Total Users across the platform
  - Total Orders processed
  - Total Revenue generated

- **Monthly Performance Chart**:
  - Track orders and revenue for the last 6 months
  - Visual bar chart for easy analysis
  - Identify trends and patterns

### 4. **Settings**

- **Site Configuration**:
  - Site name customization
  - Support email configuration
  - Max admins per branch setting
  - Maintenance mode toggle

## Setup Instructions

### Step 1: Create Super Admin Account

Run the creation script to set up the initial super admin user:

```bash
node scripts/create-superadmin.js
```

**Default Credentials:**

- Email: `superadmin@laundry.com`
- Password: `SuperAdmin@123`

⚠️ **IMPORTANT**: Change this password immediately in production!

### Step 2: Access the Super Admin Portal

1. Go to `http://localhost:3000/superadmin` (or your production URL)
2. You'll be redirected to login if not authenticated
3. Log in with super admin credentials
4. You'll be granted access to the full Super Admin Dashboard

### Step 3: Navigation

The Super Admin sidebar provides quick access to:

```
Laundry Tracker - Super Admin Portal
├── Dashboard          → Overview and statistics
├── Manage Admins      → Create, edit, delete admins
├── System Reports     → Analytics and trends
└── Settings          → Configuration options
```

## Color Scheme

The Super Admin Portal uses **Indigo** as the primary color (#4F46E5) to differentiate it from:

- **Admin Portal** (uses Blue)
- **Customer Portal** (uses default theme)
- **Staff Portal** (uses different theme)

## Database Schema Updates

The User model has been updated to support the 'superadmin' role:

```javascript
role: {
  type: String,
  enum: ['customer', 'staff', 'admin', 'superadmin'],
  default: 'customer',
}
```

## API Endpoints

### Dashboard

- `GET /api/superadmin/dashboard` - Get system statistics

### Admin Management

- `GET /api/superadmin/admins` - List all admins
- `POST /api/superadmin/admins` - Create new admin
- `PATCH /api/superadmin/admins/:id` - Update admin
- `DELETE /api/superadmin/admins/:id` - Delete admin

### Reports

- `GET /api/superadmin/reports` - Get system analytics

## Authentication & Authorization

All endpoints require:

1. **Valid JWT Token** in Authorization header: `Bearer <token>`
2. **Super Admin Role** in the user's role field

The middleware (`authMiddleware` and `requireRole`) ensures that:

- Only authenticated users can access endpoints
- Only users with 'superadmin' role can manage admins
- Proper error messages are returned for unauthorized access

## File Structure

```
/app/superadmin/
├── layout.js                 → Super Admin layout with sidebar
├── page.js                   → Dashboard page
├── admins/
│   └── page.js              → Admin management page
├── reports/
│   └── page.js              → System reports page
└── settings/
    └── page.js              → Settings page

/components/admin/
├── SuperAdminSidebar.js     → Navigation sidebar
└── AdminFormModal.js        → Admin form component

/app/api/superadmin/
├── dashboard/
│   └── route.js             → Dashboard API
├── admins/
│   ├── route.js             → List/Create admins
│   └── [id]/route.js        → Update/Delete admin
└── reports/
    └── route.js             → Reports API

/scripts/
└── create-superadmin.js     → Super admin creation script
```

## Security Considerations

1. **Password Security**:
   - All passwords are hashed using bcryptjs
   - Pre-save hook automatically hashes passwords
   - Passwords are never returned in API responses

2. **Role-Based Access**:
   - Only superadmin can manage admins
   - Attempts to access with other roles return 403 Forbidden

3. **Email Uniqueness**:
   - Email addresses must be unique in the system
   - Duplicate email validation on both create and update

4. **Authentication Required**:
   - All operations require valid JWT token
   - Tokens expire according to JWT configuration
   - Invalid/expired tokens return 401 Unauthorized

## Best Practices

1. **Regular Audits**: Periodically review admin accounts and remove inactive ones
2. **Strong Passwords**: Encourage admins to use strong, unique passwords
3. **Limited Access**: Only grant super admin access to trusted personnel
4. **Backup Credentials**: Keep backup credentials secure
5. **Monitor Activity**: Check system reports regularly for anomalies

## Troubleshooting

### Super Admin can't log in

- Verify credentials are correct
- Check database connection
- Ensure super admin account exists: `db.users.findOne({ email: 'superadmin@laundry.com' })`

### Can't create new admins

- Check JWT token is valid
- Verify user role is 'superadmin'
- Ensure email doesn't already exist in system

### Reports showing zero data

- Check if orders exist in database
- Verify database connection
- Check for data in proper date ranges

### 403 Forbidden errors

- Confirm you're logged in as super admin
- Check JWT token hasn't expired
- Verify browser hasn't cached old session

## Next Steps

1. ✅ Create super admin account using script
2. ✅ Log in to super admin portal
3. ✅ Change default password
4. ✅ Create first admin accounts
5. ✅ Set up system configuration in Settings
6. ✅ Review initial system reports

## Support

For issues or questions about the Super Admin Portal:

1. Check this documentation
2. Review API error responses
3. Check browser console for client-side errors
4. Review server logs for backend issues
