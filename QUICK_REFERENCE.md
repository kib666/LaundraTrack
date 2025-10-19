# Order Management Features - Quick Reference

## 🎯 What Was Built?

Four major order management features for customers and staff:

| Feature           | Who               | What They Can Do                                              |
| ----------------- | ----------------- | ------------------------------------------------------------- |
| **Edit Order**    | Customers         | Modify pending order details (service, weight, date, address) |
| **Undo Cancel**   | Customers & Staff | Restore a cancelled order back to its previous status         |
| **Revert Status** | Staff             | Move an order back one step in the status progression         |
| **Delete Order**  | Staff & Admin     | Permanently remove an order from the system                   |

---

## 📁 Files You Need to Know About

### New Files (Created)

```
App Routes:
├── /api/orders/[id]/edit-details/route.js       ← Edit order details
├── /api/orders/[id]/undo-cancel/route.js        ← Undo cancellation
├── /api/orders/[id]/revert-status/route.js      ← Revert status

UI Components:
├── components/customer/EditOrderModal.js        ← Edit form modal
└── components/staff/OrderCardMenu.js            ← Three-dot menu
```

### Modified Files (Enhanced)

```
Database:
├── lib/db/models.js                             ← Added statusHistory & cancellation fields

APIs:
├── app/api/orders/[id]/route.js                 ← Enhanced PATCH & DELETE

UI:
├── app/customer/page.js                         ← Added edit & restore buttons
└── app/staff/page.js                            ← Added order card menu
```

---

## 🚀 Quick Start for Users

### For Customers

**Edit an Order:**

1. Click your pending order
2. Click "Edit Order Details"
3. Modify any field
4. Click "Save Changes"
5. ✅ Order updated

**Restore a Cancelled Order:**

1. Click your cancelled order
2. Click "Restore Order"
3. Confirm
4. ✅ Order back to previous status

### For Staff

**Revert an Order Status:**

1. Find the order card
2. Click three-dot menu (⋮)
3. Select "Revert Progress"
4. Confirm
5. ✅ Order goes back ONE step

**Delete an Order:**

1. Find the order card
2. Click three-dot menu (⋮)
3. Select "Delete Order"
4. Confirm (irreversible!)
5. ✅ Order permanently removed

---

## 📋 API Endpoints

### Customers

| Method | Endpoint                        | Purpose                 |
| ------ | ------------------------------- | ----------------------- |
| PATCH  | `/api/orders/[id]/edit-details` | Edit pending order      |
| POST   | `/api/orders/[id]/undo-cancel`  | Restore cancelled order |

### Staff

| Method | Endpoint                         | Purpose                  |
| ------ | -------------------------------- | ------------------------ |
| POST   | `/api/orders/[id]/revert-status` | Go back one status step  |
| DELETE | `/api/orders/[id]`               | Delete order permanently |

---

## 🔐 Who Can Do What?

```
CUSTOMERS:
  ✓ Edit their pending orders
  ✓ Cancel their pending orders
  ✓ Restore their cancelled orders
  ✗ Cannot revert status
  ✗ Cannot delete orders

STAFF:
  ✓ Revert any order status (one step)
  ✓ Delete any order
  ✓ Undo any cancellation (with approval)
  ✗ Cannot edit order details
  ✗ Cannot edit without approval

ADMIN:
  ✓ Can do everything
  ✓ No approval needed
  ✓ Override all restrictions
```

---

## 📊 Status Flow

```
PENDING
   ↓
CONFIRMED
   ↓
IN_PROGRESS
   ↓
READY_FOR_PICKUP (or READY_FOR_DELIVERY)
   ↓
PICKED_UP (delivery only)
   ↓
DELIVERED
```

**Revert Button:** Goes back ONE step (e.g., READY_FOR_PICKUP → IN_PROGRESS)

---

## 🛠️ Technical Details

### Database Fields Added

```javascript
statusHistory: [          // Audit trail
  {
    status: string,
    changedAt: Date,
    changedBy: ObjectId,
    notes: string
  }
]

cancelledAt: Date,        // When cancelled
cancelledBy: ObjectId,    // Who cancelled
cancelReason: string      // Why cancelled
```

### Response Format

```json
{
  "success": true/false,
  "message": "Human readable message",
  "order": { /* updated order object */ },
  "error": "Technical error details (if failed)"
}
```

---

## ⚠️ Important Notes

### Editable Fields (Customers)

✓ Service Type
✓ Weight
✓ Preferred Date
✓ Fulfillment Type
✓ Pickup/Delivery Address

### Non-Editable Fields

✗ Total Amount (locked)
✗ Tracking Number
✗ Order Status (via edit endpoint)

### Revert Restrictions

✗ Cannot revert pending orders (already at start)
✗ Cannot revert cancelled orders (use undo instead)
✗ Cannot revert delivered orders (final status)
✓ Can only go back one step

### Delete Restrictions

✓ Can delete any order regardless of status
✗ Deletion is PERMANENT and irreversible
✓ Requires confirmation dialog

---

## 🔍 Status Codes

| Code | Meaning         | Example                                  |
| ---- | --------------- | ---------------------------------------- |
| 200  | ✅ Success      | Edit completed                           |
| 400  | ⚠️ Bad Request  | Invalid date format                      |
| 403  | 🚫 Forbidden    | Not authorized, insufficient permissions |
| 404  | ❌ Not Found    | Order doesn't exist                      |
| 500  | 💥 Server Error | Unexpected problem                       |

---

## 📝 Common Scenarios

### Scenario 1: Customer Edits Order

```
Customer clicks "Edit Order Details"
  ↓
Modal opens with current order data
  ↓
Customer changes weight from 2kg to 3kg
  ↓
Clicks "Save Changes"
  ↓
PATCH /api/orders/[id]/edit-details sent
  ↓
✅ Order updated, modal closes
```

### Scenario 2: Customer Cancels Then Restores

```
Customer cancels pending order
  ↓
Order status: pending → cancelled
  ↓
Cancellation metadata saved
  ↓
Customer sees "Restore Order" button
  ↓
Clicks button
  ↓
POST /api/orders/[id]/undo-cancel sent
  ↓
✅ Order restored to pending status
```

### Scenario 3: Staff Accidentally Confirms Order

```
Order status: pending
Staff clicks "Start Wash" → confirmed
  ↓
Oh no! Meant to wait
  ↓
Staff opens three-dot menu
  ↓
Clicks "Revert Progress"
  ↓
POST /api/orders/[id]/revert-status sent
  ↓
✅ Order back to pending status
```

### Scenario 4: Staff Deletes Duplicate Order

```
Duplicate order created
  ↓
Staff finds duplicate
  ↓
Opens three-dot menu
  ↓
Clicks "Delete Order"
  ↓
Confirmation dialog appears
  ↓
Confirms deletion
  ↓
DELETE /api/orders/[id] sent
  ↓
✅ Order permanently removed
```

---

## 🐛 Troubleshooting

| Problem                 | Solution                                   |
| ----------------------- | ------------------------------------------ |
| Can't edit order        | Order must be PENDING/CONFIRMED status     |
| Can't restore order     | Order must be CANCELLED status             |
| Can't see Revert button | Order is pending, cancelled, or delivered  |
| Delete didn't work      | No permission or server error (check logs) |
| Getting 403 error       | Check user role and approval status        |
| Modal won't open        | Refresh page, check browser console        |

---

## 📚 Documentation Links

- **User Guide:** `ORDER_MANAGEMENT_USER_GUIDE.md`
- **API Reference:** `ORDER_MANAGEMENT_API_REFERENCE.md`
- **Technical Summary:** `ORDER_MANAGEMENT_FEATURES_SUMMARY.md`
- **Implementation Checklist:** `IMPLEMENTATION_VERIFICATION_CHECKLIST.md`

---

## 🎓 For Developers

### Testing an Edit Request

```bash
curl -X PATCH http://localhost:3000/api/orders/ORDER_ID/edit-details \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"weight": 2.5, "serviceType": "dry-clean"}'
```

### Testing a Revert Request

```bash
curl -X POST http://localhost:3000/api/orders/ORDER_ID/revert-status \
  -H "Authorization: Bearer TOKEN"
```

### Testing a Delete Request

```bash
curl -X DELETE http://localhost:3000/api/orders/ORDER_ID \
  -H "Authorization: Bearer TOKEN"
```

### Database Query (MongoDB)

```javascript
// View status history
db.orders.findById('ORDER_ID').statusHistory;

// View cancellation info
db.orders.findById('ORDER_ID').cancelledAt;
db.orders.findById('ORDER_ID').cancelledBy;
db.orders.findById('ORDER_ID').cancelReason;
```

---

## ✅ Features Checklist

- [x] Customers can edit pending orders
- [x] Customers can undo cancellations (anytime)
- [x] Staff can revert order status (one step)
- [x] Staff can delete orders permanently
- [x] Full audit trail via status history
- [x] Proper error handling
- [x] Role-based access control
- [x] Three-dot menu UI
- [x] Edit modal UI
- [x] Loading states
- [x] Confirmation dialogs
- [x] Success/error feedback

---

## 🎯 Key Takeaways

1. **No Time Limit on Undo:** Customers can restore cancelled orders anytime
2. **One Step Revert:** Staff can only go back one status step at a time
3. **Permanent Delete:** Deletion cannot be undone
4. **Full Audit Trail:** All changes recorded in statusHistory
5. **Status History:** Preserved for every operation
6. **Approval System:** Staff need approval for sensitive operations

---

## 📞 Support

For issues:

1. Check the error message
2. Review the appropriate user/developer guide
3. Check the troubleshooting section
4. Review API responses for details
5. Check browser console for client errors
6. Check server logs for API errors

---

**Quick Fact:** The system now has a complete audit trail of every order change!

Every time an order's status changes, it's recorded in the `statusHistory` array with:

- Who made the change
- When it happened
- What it was changed to
- Notes about the change

This enables full traceability and recovery of orders.

---

**Last Updated:** Current Implementation Session  
**Status:** ✅ Complete and Ready to Use
