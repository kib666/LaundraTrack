# Debugging Changes Summary

## Overview

I've added comprehensive logging throughout the authentication and data flow to help diagnose two critical issues:

1. **Staff Portal Issue**: Revert and Delete actions failing with "no token provided" error
2. **Customer Portal Issue**: Order history displaying "0kg" for all weights instead of actual values

## Files Modified

### 1. `/lib/auth/jwt.js` - Token Extraction & Verification

**Changes:**

- Enhanced `extractToken()` function with detailed logging
- Enhanced `verifyToken()` function with error logging
- Logs show header format, token length, and verification status

**What this reveals:**

- Whether the "Bearer " prefix is present
- If JWT token is valid and not expired
- Exact point where token handling fails

### 2. `/lib/auth/middleware.js` - Authentication Middleware

**Changes:**

- Added detailed logging of incoming Authorization header
- Shows whether header is present and its format
- Logs where token extraction fails

**What this reveals:**

- Whether Authorization header reaches the server
- If header has correct Bearer format
- What the actual header value is (first 20 chars)

### 3. `/components/staff/OrderCardMenu.js` - Staff Actions

**Changes:**

- Enhanced DELETE action (handleDelete) with detailed logging
- Enhanced REVERT action (handleRevert) with detailed logging
- Added POST body to revert-status request for consistency
- Logs show token presence, format, and API response

**What this reveals:**

- If token is present in client session
- Token format and length
- Exact API error response from server
- HTTP status codes

### 4. `/app/customer/page.js` - Customer Order Fetching

**Changes:**

- Added logging of all orders received from API
- Logs filtered orders and extracts weight values
- Shows exact weight values for debugging

**What this reveals:**

- If API returns weight data correctly
- What the actual weight values are (null, 0, or real values)
- If filtering is working correctly

---

## Technical Details

### Token Flow Diagram

```
Client (Browser)
    ↓
[Session Hook stores JWT in session.user.token]
    ↓
[OrderCardMenu reads token from session]
    ↓
[Builds Authorization: Bearer {token} header]
    ↓
Server (Next.js API Route)
    ↓
[Receives Authorization header]
    ↓
[authMiddleware calls extractToken()]
    ↓
[Verifies JWT signature and finds user]
    ↓
[Returns success or "No token provided" error]
```

### Where Failures Could Occur

1. **Client Side:**
   - Session not initialized
   - Token is undefined/null in session
   - Header not being sent with request

2. **Server Side:**
   - Header not received
   - Bearer prefix missing or wrong case
   - JWT signature invalid
   - User not found in database

### Weight Flow Diagram

```
Customer Creates Order
    ↓
[Form sends weight value: "5"]
    ↓
API POST /api/orders
    ↓
[Server stores weight as Number in MongoDB]
    ↓
Customer Views History
    ↓
API GET /api/orders
    ↓
[API returns weight: 5]
    ↓
[Frontend displays: "5 kg"]
```

### Where Weight Failures Could Occur

1. **During Creation:**
   - Weight not being sent in form
   - Weight stored as string instead of number
   - Weight conversion failing

2. **During Display:**
   - API not returning weight field
   - Weight being overwritten with 0
   - Old orders without weight data
   - Display logic showing 0 as fallback

---

## Console Output Reference

### For Token Issue (Look in Browser Console):

```javascript
[STAFF DELETE] Token present: true
[STAFF DELETE] Token length: 248
[STAFF DELETE] Token starts with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
[STAFF DELETE] Request headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer [REDACTED]"
}
[STAFF DELETE] Response status: 401
[STAFF DELETE] Response data: {
  "success": false,
  "message": "No token provided"
}
```

### For Token Issue (Look in Terminal/Server Console):

```
[AUTH MIDDLEWARE] Received auth header: missing
[AUTH MIDDLEWARE] Auth header format: undefined
[AUTH MIDDLEWARE] Token extraction failed - authHeader was: undefined
```

OR if header arrives but can't be parsed:

```
[AUTH MIDDLEWARE] Received auth header: present
[AUTH MIDDLEWARE] Auth header format: bearer eyJ... (wrong case!)
[EXTRACT TOKEN] Checking startsWith("Bearer "): false
[EXTRACT TOKEN] Failed - returning null
```

### For Weight Issue (Look in Browser Console):

```javascript
[CUSTOMER FETCH] Orders received from API: [
  {
    _id: "507f1f77bcf86cd799439011",
    id: "507f1f77bcf86cd799439011",
    weight: 0,  // ← Problem: should be 5, 10, etc.
    status: "PENDING",
    ...
  }
]
[CUSTOMER FETCH] Weight values in orders: [
  { id: "507f1f77bcf86cd799439011", weight: 0 },
  { id: "507f1f77bcf86cd799439012", weight: 0 }
]
```

---

## Quick Diagnosis Guide

### If you see "No token provided" error:

1. **Check Browser Console:**
   - `[STAFF DELETE] Token present: false` → Session/token issue on client
   - `[STAFF DELETE] Token present: true` but response is 401 → Server-side issue

2. **Check Terminal:**
   - `[AUTH MIDDLEWARE] Received auth header: missing` → Header not sent
   - `[EXTRACT TOKEN] Checking startsWith("Bearer "): false` → Wrong format
   - `[VERIFY TOKEN] Verification failed` → Invalid token

3. **Next Step:** Based on which log shows the problem, we know where to fix

### If you see "0kg" for all orders:

1. **Check Browser Console:**
   - `weight: 0` in logs → Database has 0 or null
   - `weight: 5` in logs but displays as "0kg" → Display logic issue

2. **Check if it's only old orders:**
   - Try creating a NEW order with weight
   - If new orders show correct weight but old ones show 0 → Old data issue
   - If all orders including new ones show 0 → API/Database issue

---

## Potential Quick Fixes (Before Seeing Logs)

### Possible Fix 1: Header Case Sensitivity

In `/lib/auth/jwt.js`, case might be an issue. Currently checks for `'Bearer '` (capital B).
Some clients might send `'bearer '` (lowercase b). However, fetch should normalize this.

### Possible Fix 2: Token Storage

If token is not being stored correctly in NextAuth session, we might need to check:

- `/lib/auth/authOptions.js` session callback (line 113)
- Whether JWT token is being passed correctly

### Possible Fix 3: Weight Parsing

If weight is being stored as string "0" instead of number 0:

- Check POST endpoint in `/app/api/orders/route.js` line 216
- Ensure weight is converted to number

---

## Next Action Items

1. **Run the app** with these logging changes
2. **Reproduce the errors** (try delete/revert for staff, view orders for customer)
3. **Capture console logs** from both browser (F12) and terminal
4. **Send the logs** to me
5. **I'll identify the exact failure point** and implement the targeted fix

---

## Testing Without Logs (If You Want to Try)

### Potential Fix for Token Issue:

If you see "No token provided" immediately, try checking:

```javascript
// In browser console, after logging in as staff:
// Run this to see what's in the session:
sessionStorage.getItem('next-auth.session-token');
// Or check the session callback:
const { data: session } = useSession();
console.log('Session:', session);
console.log('Token:', session?.user?.token);
```

### Potential Fix for Weight Issue:

Create a new test order with weight 25kg and see:

1. If the new order shows correct weight → Old orders need migration
2. If the new order also shows 0kg → API/storage issue

---

## Environment Assumptions

- Node.js with Next.js App Router
- NextAuth v4 with JWT strategy
- MongoDB for data storage
- CORS not blocking same-origin requests
- JWT_SECRET environment variable set

---

## Support

When you're ready with the logs:

1. Share browser console logs (F12 → Console tab)
2. Share terminal output from dev server
3. Describe what action you were taking
4. Mention expected vs actual behavior

This will help me pinpoint the exact issue and provide a targeted fix! 🎯
