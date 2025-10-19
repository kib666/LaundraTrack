# Debug Report: Weight Display & Token Issues

## Summary

Added comprehensive logging throughout the authentication and data flow to diagnose:

1. **Weight Display Issue**: Customer order history showing "0kg" instead of actual weight
2. **Token Authentication Issue**: Staff revert/delete showing "no token provided" error

## Changes Made

### 1. Authentication Middleware Logging (`lib/auth/middleware.js`)

- Line 14-16: Log when auth header is received and show header format
- Line 21: Log detailed auth header when token extraction fails

**What to look for in browser console:**

- `[AUTH MIDDLEWARE] Received auth header: ...` - Tells you if the header arrived at the server
- `[AUTH MIDDLEWARE] Auth header format: ...` - Shows the first 20 chars of the header
- `[AUTH MIDDLEWARE] Token extraction failed` - Shows what the header actually was

### 2. Token Extraction Logging (`lib/auth/jwt.js`)

- Line 51-66: Detailed logging in `extractToken()` function
- Shows authHeader presence, type, length, and format
- Logs whether "Bearer " prefix was found

**What to look for in server console (Terminal):**

- `[EXTRACT TOKEN] Input authHeader: present` or `null/undefined`
- `[EXTRACT TOKEN] authHeader type: string`
- `[EXTRACT TOKEN] Checking startsWith("Bearer "): true/false`
- `[EXTRACT TOKEN] Success - token length: 200` (or similar)

### 3. Token Verification Logging (`lib/auth/jwt.js`)

- Line 30-35: Detailed logging in `verifyToken()` function
- Shows token length and whether verification succeeded
- Logs decoded userId on success

**What to look for in server console:**

- `[VERIFY TOKEN] Attempting to verify token, length: ...`
- `[VERIFY TOKEN] Token verified successfully, decoded userId: ...`
- `[VERIFY TOKEN] Verification failed: ...` (if JWT is invalid/expired)

### 4. Staff Delete Action Logging (`components/staff/OrderCardMenu.js`)

- Line 65-75: Log token presence, length, and format before DELETE request
- Line 82-84: Log response status and full response data

**What to look for in browser console:**

- `[STAFF DELETE] Token present: true/false`
- `[STAFF DELETE] Token length: ...`
- `[STAFF DELETE] Token starts with: eyJ...` (JWT format starts with eyJ)
- `[STAFF DELETE] Response status: 401` (or other status)
- `[STAFF DELETE] Response data: { message: '...' }`

### 5. Staff Revert Action Logging (`components/staff/OrderCardMenu.js`)

- Line 129-151: Same detailed logging for POST revert-status request
- Line 150: Added `body: JSON.stringify({})` to ensure proper POST format

**What to look for in browser console:**

- `[STAFF REVERT] Token present: true/false`
- `[STAFF REVERT] Response status: 401` (or other status)
- `[STAFF REVERT] Response data: { message: '...' }`

### 6. Customer Order Fetch Logging (`app/customer/page.js`)

- Line 1075: Log all orders received from API
- Line 1086-1087: Log filtered orders and extract weight values

**What to look for in browser console:**

- `[CUSTOMER FETCH] Orders received from API: [...]`
- `[CUSTOMER FETCH] Weight values in orders: [{ id: '...', weight: 5 }, ...]`
- Check if weight is `null`, `0`, or actual value like `5`

---

## Testing Instructions

### For Token Issue (Staff Revert/Delete):

1. **Log in** as a staff member
2. **Open Developer Tools** (F12 in browser)
3. Go to **Console** tab
4. Try to **Delete or Revert** an order
5. **Look for the logging output** starting with `[STAFF DELETE]` or `[STAFF REVERT]`
6. **Copy all console messages** and check:
   - Is the token present?
   - What's the response status?
   - What's the error message in the response?

7. **Also check the Terminal** where your dev server is running
8. **Look for messages** starting with `[AUTH MIDDLEWARE]`, `[EXTRACT TOKEN]`, `[VERIFY TOKEN]`
9. **Copy relevant log entries**

### For Weight Issue (Customer Order History):

1. **Log in** as a customer
2. **Open Developer Tools** (F12 in browser)
3. Go to **Console** tab
4. **Navigate to the order history section**
5. **Look for the logging output** starting with `[CUSTOMER FETCH]`
6. **Check what weights are being received:**
   - Are they `0`, `null`, or actual values like `5`?
7. **If orders show `0` or `null` in the console**, the issue is in the database or API response
8. **If orders show actual values in the console but display as `0kg` on the page**, it's a display issue

---

## Possible Causes & Solutions

### Token Issue Scenarios:

**Scenario A: Token is null/undefined**

- Session not properly initialized
- User not properly logged in
- Token not being stored in session

**Scenario B: Token is present but header not received by server**

- CORS issue (unlikely with same-origin requests)
- Network issue
- Header being stripped by middleware

**Scenario C: Token has wrong format**

- "bearer" instead of "Bearer" (case sensitivity)
- Missing space after "Bearer"
- Token corrupted in transit

**Scenario D: Token is valid but user not found in database**

- User deleted after login
- User status changed to inactive
- Database connection issue

### Weight Issue Scenarios:

**Scenario A: Weight is null/0 in API response**

- Old orders created before weight field was added
- Weight field not being sent during order creation
- Database stores null instead of 0

**Scenario B: Weight is correct in API but displays as 0kg**

- Frontend display logic issue
- Type conversion problem
- Template syntax error

---

## Next Steps After Seeing Logs

1. **Share the console output** from both browser and terminal
2. I'll analyze the exact point of failure
3. Implement targeted fix based on the actual error
4. Test the fix with you

## How to Collect Logs

### Browser Console:

1. F12 → Console tab
2. Right-click → "Save as..."
3. Save with timestamp

### Terminal:

1. Select all text in terminal
2. Ctrl+C to copy
3. Paste into text file

**Please share these logs after testing!**
