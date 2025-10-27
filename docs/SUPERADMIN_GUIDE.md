# Super Admin Dashboard Guide

## Overview

The Super Admin Dashboard is a dedicated interface for managing all admin accounts in the LaudraTrack system. Only one Super Admin account exists in the system with the following credentials:

- **Email**: `super@gmail.com`
- **Password**: `superadmin123`

> ⚠️ **Important**: These credentials are hardcoded for the initial setup. Consider updating the password immediately after first login for security purposes.

---

## Accessing Super Admin Dashboard

### Method 1: Click the Logo (Recommended)

1. Go to the LaundraTrack homepage
2. Click on the **LaundraTrack logo** in the top-left corner
3. A login modal will appear
4. Enter the super admin credentials:
   - Email: `super@gmail.com`
   - Password: `superadmin123`
5. Click **Login**
6. You will be redirected to the Super Admin Dashboard

### Method 2: Direct URL (After Login)

Once logged in, you can access the dashboard directly at:

```
http://localhost:3000/superadmin
```

---

## Features

### 1. **View All Admins**

- See a complete table of all admin accounts
- View admin details: Name, Email, Status, and Creation Date
- Admins are sorted by creation date (newest first)

### 2. **Add New Admin**

- Click the **"Add New Admin"** button
- Fill in the required information:
  - First Name
  - Last Name
  - Email
  - Password (minimum 6 characters)
- Click **"Create Admin"** to save

**Validation:**

- All fields are required
- Email must be unique
- Password must be at least 6 characters long

### 3. **Edit Admin Information**

- Click the **Edit** icon (pencil) next to an admin
- Modify any of the following:
  - First Name
  - Last Name
  - Email
  - Password (optional - leave blank to keep current password)
- Click **"Update Admin"** to save changes

**Note:** When editing, the password field is optional. Leave it blank if you don't want to change the password.

### 4. **Delete Admin**

- Click the **Delete** icon (trash can) next to an admin
- A confirmation dialog will appear
- Click **"Delete Admin"** to permanently remove the account

**Warning:** Deletion is permanent and cannot be undone.

### 5. **Logout**

- Click the **"Logout"** button in the top-right corner
- Your session will be terminated and you'll be redirected to the homepage

---

## Setup Instructions

### Initial Setup

#### Option 1: Run Setup Script (Recommended)

```bash
node scripts/create-superadmin.js
```

This script will:

- Check if a super admin account already exists
- Create the default super admin account if it doesn't exist
- Display the login credentials

#### Option 2: Manual Database Entry

If you prefer to add the super admin manually:

1. Connect to your MongoDB database
2. Insert a new user document with:
   - Email: `super@gmail.com`
   - Password: `superadmin123` (will be hashed by the model)
   - Role: `superadmin`
   - Status: `active`
   - First Name: `Super`
   - Last Name: `Admin`

---

## Technical Details

### API Endpoints

#### Authentication

```
POST /api/auth/superadmin
```

Authenticate as super admin. Returns JWT token.

**Request Body:**

```json
{
  "email": "super@gmail.com",
  "password": "superadmin123"
}
```

#### Get All Admins

```
GET /api/superadmin/admins
```

Requires: Authorization header with Bearer token

**Response:**

```json
{
  "success": true,
  "admins": [...]
}
```

#### Create Admin

```
POST /api/superadmin/admins
```

Requires: Authorization header with Bearer token

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Update Admin

```
PATCH /api/superadmin/admins/:id
```

Requires: Authorization header with Bearer token

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```

#### Delete Admin

```
DELETE /api/superadmin/admins/:id
```

Requires: Authorization header with Bearer token

### Token Storage

- JWT tokens are stored in the browser's `localStorage` as `superadminToken`
- Tokens expire after 24 hours
- Automatic logout occurs when token expires

---

## Security Considerations

### Best Practices

1. **Change Default Password Immediately**
   - After first login, edit the super admin profile to change the password
   - Use a strong password (combination of letters, numbers, and symbols)

2. **Limited Access**
   - Only the super admin can:
     - Add new admin accounts
     - Edit admin information (including passwords)
     - Delete admin accounts
   - Regular admins cannot access this dashboard

3. **Token Expiration**
   - JWT tokens expire after 24 hours
   - Users must re-login after token expiration
   - Logout manually to clear the token immediately

4. **Password Security**
   - Passwords are hashed using bcryptjs before storage
   - Never share admin credentials
   - Consider using environment variables for the default super admin password

### Audit Trail

Currently, the system does not log admin modifications. Consider adding:

- Timestamp of when admins were created/modified/deleted
- User ID of who made the change
- Change history for audit purposes

---

## Troubleshooting

### "Invalid email or password" Error

- Ensure you're using the correct credentials
- Check that the super admin account has been created (run the setup script)
- Verify the email and password haven't been changed

### "Missing or invalid authorization header" Error

- Your session has expired
- Click Logout and log back in
- Clear your browser's localStorage and retry

### "Admin not found" Error

- The admin you're trying to edit or delete no longer exists
- Refresh the page to see the updated list

### Admins List Not Loading

- Check your internet connection
- Verify the API server is running
- Check browser console for error messages
- Logout and log back in

---

## Workflow Examples

### Example 1: Add a New Admin

1. Click the LaundraTrack logo on the homepage
2. Login with super admin credentials
3. Click **"Add New Admin"** button
4. Fill in the form:
   - First Name: `Alice`
   - Last Name: `Johnson`
   - Email: `alice@laudratrack.com`
   - Password: `securepass123`
5. Click **"Create Admin"**
6. Success message appears, and Alice is added to the admin list

### Example 2: Update Admin Information

1. In the Super Admin Dashboard, locate the admin to edit
2. Click the **Edit** icon (pencil)
3. Modify the information (e.g., update email)
4. Click **"Update Admin"**
5. Changes are saved and the list updates

### Example 3: Remove an Admin

1. Locate the admin to remove in the list
2. Click the **Delete** icon (trash can)
3. Confirm the deletion in the popup dialog
4. Admin is permanently deleted

---

## Support

For issues or questions:

- Check the troubleshooting section above
- Review the technical details for API information
- Contact the development team

---

## Version History

- **v1.0** - Initial Super Admin Dashboard release
  - Add/Edit/Delete admin accounts
  - JWT-based authentication
  - Token expiration after 24 hours
