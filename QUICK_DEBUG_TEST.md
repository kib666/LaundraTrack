# Quick Debug Test Guide

## 🚀 Quick Start

### 1. Start Dev Server

```bash
npm run dev
```

### 2. Open Browser DevTools

```
Press F12 or Right-click → Inspect → Console tab
```

### 3. Test Token Issue (Staff Revert/Delete)

**Steps:**

1. Log in as Staff user
2. Keep Console visible
3. Try to Delete an order
4. **Copy all console logs** that start with:
   - `[STAFF DELETE]`
   - `[AUTH MIDDLEWARE]`
   - `[EXTRACT TOKEN]`
   - `[VERIFY TOKEN]`

**Expected logs if working:**

```
[STAFF DELETE] Token present: true
[STAFF DELETE] Token length: 200+
[STAFF DELETE] Token starts with: eyJ...
[STAFF DELETE] Response status: 200
[STAFF DELETE] Response data: { success: true, message: '...' }
```

**If error, you should see:**

```
[STAFF DELETE] Response status: 401
[STAFF DELETE] Response data: { message: 'No token provided' }
```

---

### 4. Test Weight Issue (Customer Order History)

**Steps:**

1. Log in as Customer
2. Keep Console visible
3. View order history (or navigate to the section showing orders)
4. **Copy all console logs** that start with:
   - `[CUSTOMER FETCH]`

**Look for this line:**

```
[CUSTOMER FETCH] Weight values in orders: [
  { id: '...', weight: 5 },
  { id: '...', weight: 10 },
  ...
]
```

**If issue, you'll see:**

```
[CUSTOMER FETCH] Weight values in orders: [
  { id: '...', weight: 0 },
  { id: '...', weight: null },
  ...
]
```

---

## 📋 Server-Side Logs

### In Terminal (where `npm run dev` is running):

Look for these patterns in the terminal output:

**For Token Testing:**

```
[AUTH MIDDLEWARE] Received auth header: present
[AUTH MIDDLEWARE] Auth header format: Bearer eyJ...
[EXTRACT TOKEN] Input authHeader: present
[EXTRACT TOKEN] Checking startsWith("Bearer "): true
[EXTRACT TOKEN] Success - token length: 200
[VERIFY TOKEN] Attempting to verify token, length: 200
[VERIFY TOKEN] Token verified successfully, decoded userId: ...
```

**If failing:**

```
[AUTH MIDDLEWARE] Received auth header: missing
```

or

```
[EXTRACT TOKEN] Checking startsWith("Bearer "): false
```

or

```
[VERIFY TOKEN] Verification failed: Invalid or expired token
```

---

## 🎯 What Each Log Means

| Log                                               | Meaning                        |
| ------------------------------------------------- | ------------------------------ |
| `[STAFF DELETE] Token present: true`              | Token found in session ✓       |
| `[STAFF DELETE] Token present: false`             | Token NOT in session ✗         |
| `[AUTH MIDDLEWARE] Received auth header: present` | Header reached server ✓        |
| `[AUTH MIDDLEWARE] Received auth header: missing` | Header NOT sent ✗              |
| `[EXTRACT TOKEN] Success - token length: 200`     | Bearer prefix removed ✓        |
| `[EXTRACT TOKEN] Failed - returning null`         | Bearer prefix missing ✗        |
| `[VERIFY TOKEN] Token verified successfully`      | JWT is valid ✓                 |
| `[VERIFY TOKEN] Verification failed`              | JWT is invalid/expired ✗       |
| `Response status: 200`                            | Request succeeded ✓            |
| `Response status: 401`                            | Unauthorized (token issue) ✗   |
| `Response status: 403`                            | Forbidden (permission issue) ✗ |

---

## 💾 How to Save Logs

### Browser Console:

```
1. F12 → Console
2. Select all (Ctrl+A)
3. Right-click → Copy
4. Paste to notepad or text file
```

### Terminal:

```
1. Click terminal
2. Select all (Ctrl+A)
3. Right-click → Copy
4. Paste to notepad or text file
```

---

## ❓ Common Issues & Solutions

### Issue: Token present but response is 401

**Likely cause:** Token is invalid or expired
**Check:** `[VERIFY TOKEN] Verification failed` in terminal logs

### Issue: Token missing from session

**Likely cause:** User not properly logged in or session expired
**Check:** User is still logged in? Try logging in again

### Issue: Weight shows 0 in history but not null

**Likely cause:** Orders created before weight feature was added
**Check:** Try creating a new order and see if new orders show correct weight

### Issue: Weight shows null in logs

**Likely cause:** API endpoint not returning weight field
**Check:** Look at `/api/orders/route.js` line 83 - weight should be there

---

## 📝 Report Template

When reporting issues, include:

```
[Token/Weight] Issue:

Browser Console Logs:
[paste relevant console logs here]

Terminal Logs:
[paste relevant terminal logs here]

What I was doing:
[describe the action that caused the error]

Expected result:
[what should have happened]

Actual result:
[what actually happened]
```

---

## 🔄 Full Test Flow

```
1. Start dev server: npm run dev
2. Open browser: http://localhost:3000
3. F12 to open DevTools (Console tab)
4. Log in (Staff for delete/revert test, Customer for weight test)
5. Perform the action that fails
6. Copy console logs (browser + terminal)
7. Share the logs
8. I'll implement the fix
9. Test again to verify
```

Good luck! Let me know what the logs show! 🎉
