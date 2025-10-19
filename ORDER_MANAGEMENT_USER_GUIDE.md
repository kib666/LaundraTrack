# Order Management Features - User Guide

## For Customers

### Editing Your Order Details

**When can you edit?**

- Your order must be in **"PENDING"** or **"PENDING"** (confirmed) status
- You can edit before the order starts processing

**How to edit:**

1. Go to your order tracking dashboard
2. Click on the order you want to modify
3. The order details expand showing your order information
4. Click the **"Edit Order Details"** button
5. A modal window opens with an edit form
6. Modify any of the following:
   - **Service Type** (Wash, Dry Clean, Iron, Combo)
   - **Weight** (in kg, minimum 0.5 kg)
   - **Preferred Date** (when you want it ready)
   - **Fulfillment Type** (Pickup or Delivery)
   - **Pickup Address** (if you selected Pickup)
   - **Delivery Address** (if you selected Delivery)
7. Click **"Save Changes"** to confirm
8. You'll see a success message, and the order updates

**What you CANNOT edit:**

- ❌ Total Amount (price is locked)
- ❌ Orders that are in progress or later stages

---

### Cancelling Your Order

**When can you cancel?**

- Order is in **PENDING** status
- Once order moves to "In Progress", you cannot cancel

**How to cancel:**

1. Click on your pending order
2. Click the **"Cancel Order"** button (red button at bottom)
3. Confirm the cancellation
4. Order status changes to "CANCELLED"

---

### Restoring a Cancelled Order

**When can you restore?**

- Order must be in **CANCELLED** status
- You can restore at ANY time (no time limit!)
- This will bring the order back to its previous status

**How to restore:**

1. Click on your cancelled order
2. Click the **"Restore Order"** button (green button with ↻ icon)
3. Confirm the restoration
4. Order will be restored to its previous status (usually PENDING)
5. You can now edit or proceed with the order

**Pro Tip:** Made a mistake cancelling? You can always undo it!

---

## For Staff Members

### Overview

As a staff member, you have additional powers to manage orders that have been accidentally updated or need to be removed from the system.

### Viewing Order Actions

Each order card displays a **three-dot menu (⋮)** in the top-right corner of the card.

**Click the three-dot menu to see available actions:**

- **Revert Progress** (for eligible orders)
- **Delete Order** (always available)

---

### Reverting Order Progress

**When would you use this?**

- You accidentally moved an order to the wrong status
- Example: Marked as "In Progress" when it should still be "Confirmed"

**Which statuses can be reverted?**

- ✅ Confirmed → Pending
- ✅ In Progress → Confirmed
- ✅ Ready for Pickup → In Progress
- ✅ Picked Up → Ready for Pickup
- ✅ Delivered → Picked Up

**Which statuses CANNOT be reverted?**

- ❌ Pending (already at start)
- ❌ Cancelled (use different recovery method)
- ❌ Delivered (final status)

**How to revert an order:**

1. Find the order card in the appropriate section
2. Click the **three-dot menu (⋮)** in the top-right corner
3. Select **"Revert Progress"**
4. A confirmation dialog appears asking if you're sure
5. Click **Confirm** in the dialog
6. The order moves back ONE step in the progression
7. Status history is updated for audit trail

**Important:**

- You can only go back ONE step at a time
- If you need to go back 3 steps, you'll need to revert 3 times
- This ensures proper state management

---

### Deleting an Order

**When would you delete an order?**

- The order contains incorrect data and needs to be removed
- Customer requested order to be completely removed
- Duplicate orders were created by mistake

**Which orders can be deleted?**

- ANY order can be deleted regardless of status
- This is a permanent action (cannot be undone!)

**How to delete an order:**

1. Find the order card
2. Click the **three-dot menu (⋮)** in the top-right corner
3. Select **"Delete Order"**
4. A confirmation dialog appears with a warning:
   > "Are you sure you want to delete this order? This action cannot be undone."
5. Click **Confirm** if you're sure
6. The order is permanently removed from the system
7. You'll see the order card disappear from the dashboard

**Caution:**

- ⚠️ This action is PERMANENT
- ⚠️ You cannot undo a deletion
- ⚠️ The order will be completely removed from the system
- ⚠️ Verify you're deleting the correct order before confirming!

---

### Undoing Staff Cancellations

**If you accidentally cancel an order as staff:**

1. The order will appear in the "CANCELLED" section
2. You can restore it just like customers can
3. Access the order and look for a "Restore Order" or undo option
4. The order returns to its previous status

**Alternatively:**

- Click the three-dot menu and look for restore option if available
- Or ask a customer to restore if they have access

---

## Status Flow Reference

Orders follow this progression:

```
PENDING → CONFIRMED → IN PROGRESS → READY FOR PICKUP → PICKED UP → DELIVERED
                                ↓
                          (or delivery)
                                ↓
                    READY FOR DELIVERY → DELIVERED
```

**At any point:** Order can be CANCELLED

---

## Common Tasks

### "I edited the wrong field - how do I fix it?"

1. Click the order again
2. Click "Edit Order Details" again
3. Make the correct changes
4. Click "Save Changes"
5. Done! You can edit as many times as needed (until order starts processing)

### "I accidentally cancelled an order - can it be restored?"

1. Yes! Click the cancelled order
2. Click "Restore Order" (green button)
3. Confirm the restoration
4. Order comes back to previous status
5. You can now continue with it

### "I cancelled the wrong order as staff - how do I undo?"

1. Find the cancelled order in the system
2. If you have permissions, use "Restore Order"
3. Or contact admin to restore it
4. The order returns to its original status

### "I made an order as CONFIRMED by mistake - how do I fix it?"

1. Find the order in "PENDING ORDERS" section
2. Click the three-dot menu (⋮)
3. Select "Revert Progress"
4. Order goes back to PENDING
5. Now you can edit it if needed

### "A customer wants to completely remove an order - how?"

1. Find the order card
2. Click the three-dot menu (⋮)
3. Select "Delete Order"
4. Confirm the deletion
5. Order is permanently removed
6. Note: This cannot be undone, so be certain

---

## Troubleshooting

### "I don't see an 'Edit' button for an order"

**Reason:** Order is no longer in PENDING/CONFIRMED status

**Solution:** Only pending and confirmed orders can be edited. Once the order starts processing, editing is locked to prevent conflicts.

### "I can't restore a cancelled order"

**Reason:** You might not have permission or restoration failed

**Solution:**

- Try clicking again or refreshing the page
- Contact an admin if the problem persists
- Check that you have proper staff/customer permissions

### "The 'Revert Progress' button is greyed out"

**Reason:** Order is in a status that cannot be reverted (pending, cancelled, or delivered)

**Solution:** Only intermediate statuses can be reverted. You cannot revert the first step (pending) or final steps (delivered).

### "I'm getting an error when trying to delete"

**Reason:** Permission issue or server error

**Solution:**

- Make sure you're a staff member or admin
- Refresh the page and try again
- Check your internet connection
- Contact admin if problem continues

### "The order didn't update after I made changes"

**Reason:** The request might have failed or is still processing

**Solution:**

- Wait a moment (requests can take 1-2 seconds)
- Refresh the page to see current status
- Try again if it still didn't update
- Check for error messages in red text

---

## Tips & Best Practices

### For Customers

✅ **DO:**

- Edit orders BEFORE they start processing
- Save important order details separately
- Use the "Restore" option if you cancel by mistake
- Check the status progress tracker regularly

❌ **DON'T:**

- Edit orders that are already in progress
- Keep changing details repeatedly
- Cancel without thinking (though you can restore!)

### For Staff

✅ **DO:**

- Double-check before confirming status changes
- Use revert if you make a small mistake
- Document why you're deleting orders
- Review status history to understand order flow

❌ **DON'T:**

- Delete orders without confirming they need removal
- Force-revert orders just to experiment
- Change statuses without checking current state
- Forget that deletion is permanent

---

## Questions?

If you need help:

1. Check the error message - it usually tells you what's wrong
2. Try refreshing the page
3. Ensure you're using the correct status
4. Contact an admin or superadmin for additional support

---

**Last Updated:** Current Session
**Version:** 1.0
