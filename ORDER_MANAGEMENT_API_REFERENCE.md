# Order Management API Reference

## Base URL

```
/api/orders
```

All requests require authentication via JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## 1. Edit Order Details

### Endpoint

```
PATCH /api/orders/[id]/edit-details
```

### Description

Allows customers to edit details of pending or confirmed orders.

### Authorization

- Role: `customer` only
- Must own the order (verified via customerId)

### Request Body

```json
{
  "serviceType": "wash|dry-clean|iron|combo",
  "weight": 1.5,
  "preferredDate": "2024-12-25",
  "fulfillmentType": "pickup|delivery",
  "pickupAddress": "123 Main St",
  "deliveryAddress": "456 Oak Ave"
}
```

### Fields Description

| Field           | Type              | Required | Notes                                          |
| --------------- | ----------------- | -------- | ---------------------------------------------- |
| serviceType     | String            | No       | One of: wash, dry-clean, iron, combo           |
| weight          | Number            | No       | Minimum 0.5 kg, typically in 0.5 kg increments |
| preferredDate   | String (ISO 8601) | No       | Format: YYYY-MM-DD                             |
| fulfillmentType | String            | No       | pickup or delivery                             |
| pickupAddress   | String            | No\*     | Required if fulfillmentType is pickup          |
| deliveryAddress | String            | No\*     | Required if fulfillmentType is delivery        |

### Response - Success (200)

```json
{
  "success": true,
  "message": "Order details updated successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "trackingNumber": "TRK001",
    "customerId": "507f1f77bcf86cd799439012",
    "status": "pending",
    "serviceType": "wash",
    "weight": 2.5,
    "preferredDate": "2024-12-25T00:00:00.000Z",
    "fulfillmentType": "delivery",
    "deliveryAddress": "456 Oak Ave",
    "totalAmount": 250,
    "statusHistory": [...],
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### Response - Errors

**403 Forbidden - Not a Customer**

```json
{
  "success": false,
  "message": "Only customers can edit order details"
}
```

**403 Forbidden - Not Your Order**

```json
{
  "success": false,
  "message": "Access denied - not your order"
}
```

**400 Bad Request - Order Not Editable**

```json
{
  "success": false,
  "message": "Can only edit pending orders"
}
```

**400 Bad Request - Invalid Date**

```json
{
  "success": false,
  "message": "Invalid preferred date"
}
```

**400 Bad Request - Delivery Address Required**

```json
{
  "success": false,
  "message": "Delivery address is required for delivery orders"
}
```

**404 Not Found**

```json
{
  "success": false,
  "message": "Order not found"
}
```

**500 Server Error**

```json
{
  "success": false,
  "message": "Failed to edit order details",
  "error": "Error details here"
}
```

### Example cURL

```bash
curl -X PATCH http://localhost:3000/api/orders/507f1f77bcf86cd799439011/edit-details \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "serviceType": "dry-clean",
    "weight": 3.0,
    "fulfillmentType": "delivery",
    "deliveryAddress": "789 Pine St"
  }'
```

---

## 2. Undo Order Cancellation

### Endpoint

```
POST /api/orders/[id]/undo-cancel
```

### Description

Restores a cancelled order to its previous status. Works for both customers and staff.

### Authorization

- **Customers:** Can only undo their own cancelled orders
- **Staff/Admin:** Can undo any cancelled order (requires approval)

### Request Body

```json
{}
```

No request body needed.

### Response - Success (200)

```json
{
  "success": true,
  "message": "Order cancellation undone successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "trackingNumber": "TRK001",
    "customerId": "507f1f77bcf86cd799439012",
    "status": "pending",
    "items": [...],
    "totalAmount": 250,
    "cancelledAt": null,
    "cancelledBy": null,
    "cancelReason": null,
    "statusHistory": [
      {
        "status": "cancelled",
        "changedAt": "2024-01-15T10:30:00.000Z",
        "changedBy": "507f1f77bcf86cd799439012",
        "notes": "Order cancelled by customer"
      },
      {
        "status": "pending",
        "changedAt": "2024-01-15T10:31:00.000Z",
        "changedBy": "507f1f77bcf86cd799439012",
        "notes": "Order restored from cancellation by customer"
      }
    ],
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:31:00.000Z"
  }
}
```

### Response - Errors

**403 Forbidden - Insufficient Permission**

```json
{
  "success": false,
  "message": "Staff member does not have approval to perform this action"
}
```

**403 Forbidden - Not Your Order** (Customer only)

```json
{
  "success": false,
  "message": "Access denied - not your order"
}
```

**400 Bad Request - Not Cancelled**

```json
{
  "success": false,
  "message": "Order is not cancelled"
}
```

**404 Not Found**

```json
{
  "success": false,
  "message": "Order not found"
}
```

**500 Server Error**

```json
{
  "success": false,
  "message": "Failed to undo cancellation",
  "error": "Error details here"
}
```

### Example cURL

```bash
# Customer undoing their own order
curl -X POST http://localhost:3000/api/orders/507f1f77bcf86cd799439011/undo-cancel \
  -H "Authorization: Bearer customer_token"

# Staff undoing an order
curl -X POST http://localhost:3000/api/orders/507f1f77bcf86cd799439011/undo-cancel \
  -H "Authorization: Bearer staff_token"
```

---

## 3. Revert Order Status

### Endpoint

```
POST /api/orders/[id]/revert-status
```

### Description

Reverts an order to the previous status in the progression sequence. Staff and admin only.

### Authorization

- Role: `staff` or `admin`
- Requires approval (checked via `requireApproval`)
- Cannot revert pending, cancelled, or delivered orders

### Request Body

```json
{}
```

No request body needed.

### Status Progression

```
pending → confirmed → in_progress → ready_for_pickup → picked_up → delivered
```

Each call reverts ONE step backward.

### Response - Success (200)

```json
{
  "success": true,
  "message": "Order reverted to in_progress",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "trackingNumber": "TRK001",
    "customerId": "507f1f77bcf86cd799439012",
    "staffId": "507f1f77bcf86cd799439013",
    "status": "in_progress",
    "items": [...],
    "totalAmount": 250,
    "statusHistory": [
      {
        "status": "ready_for_pickup",
        "changedAt": "2024-01-15T10:30:00.000Z",
        "changedBy": "507f1f77bcf86cd799439013",
        "notes": "Status changed to ready_for_pickup by staff"
      },
      {
        "status": "in_progress",
        "changedAt": "2024-01-15T10:31:00.000Z",
        "changedBy": "507f1f77bcf86cd799439013",
        "notes": "Reverted from ready_for_pickup by staff"
      }
    ],
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:31:00.000Z"
  }
}
```

### Response - Errors

**403 Forbidden - Not Staff/Admin**

```json
{
  "success": false,
  "message": "Only staff and admins can revert order status"
}
```

**403 Forbidden - Missing Approval**

```json
{
  "success": false,
  "message": "Staff member does not have approval to perform this action"
}
```

**400 Bad Request - Cannot Revert**

```json
{
  "success": false,
  "message": "Cannot revert this order status"
}
```

(Happens when order is pending, cancelled, or already at first step)

**400 Bad Request - Already at Start**

```json
{
  "success": false,
  "message": "Cannot revert further"
}
```

(Order is already at pending status)

**404 Not Found**

```json
{
  "success": false,
  "message": "Order not found"
}
```

**500 Server Error**

```json
{
  "success": false,
  "message": "Failed to revert order status",
  "error": "Error details here"
}
```

### Example cURL

```bash
curl -X POST http://localhost:3000/api/orders/507f1f77bcf86cd799439011/revert-status \
  -H "Authorization: Bearer staff_token"
```

---

## 4. Delete Order

### Endpoint

```
DELETE /api/orders/[id]
```

### Description

Permanently deletes an order from the system. Cannot be undone.

### Authorization

- Role: `staff` (requires approval) or `admin` (no approval needed)
- Cannot be done by customers

### Request Body

```json
{}
```

No request body needed.

### Response - Success (200)

```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

### Response - Errors

**403 Forbidden - Not Authorized**

```json
{
  "success": false,
  "message": "Only staff and admins can delete orders"
}
```

**403 Forbidden - Missing Approval** (Staff only)

```json
{
  "success": false,
  "message": "Staff member does not have approval to perform this action"
}
```

**404 Not Found**

```json
{
  "success": false,
  "message": "Order not found"
}
```

**500 Server Error**

```json
{
  "success": false,
  "message": "Failed to delete order",
  "error": "Error details here"
}
```

### Example cURL

```bash
# Staff deletion
curl -X DELETE http://localhost:3000/api/orders/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer staff_token"

# Admin deletion
curl -X DELETE http://localhost:3000/api/orders/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer admin_token"
```

---

## 5. Cancel Order (Update Status)

### Endpoint

```
PATCH /api/orders/[id]
```

### Description

Cancels an order. Can be done by customers (own orders) or staff/admin (any order).

### Authorization

- **Customers:** Can cancel their own pending/confirmed orders
- **Staff/Admin:** Can cancel any order (requires approval)

### Request Body - Customer

```json
{
  "status": "cancelled",
  "cancelReason": "Changed my mind"
}
```

### Request Body - Staff/Admin

```json
{
  "status": "cancelled",
  "cancelReason": "Duplicate order"
}
```

### Response - Success (200)

```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "CANCELLED",
    "dbStatus": "cancelled",
    "cancelledAt": "2024-01-15T10:31:00.000Z",
    "cancelledBy": "507f1f77bcf86cd799439012",
    "cancelReason": "Changed my mind",
    "statusHistory": [
      {
        "status": "cancelled",
        "changedAt": "2024-01-15T10:31:00.000Z",
        "changedBy": "507f1f77bcf86cd799439012",
        "notes": "Order cancelled by customer: Changed my mind"
      }
    ]
  }
}
```

### Response - Errors

**400 Bad Request - Not Cancellable**

```json
{
  "success": false,
  "message": "Only pending orders can be cancelled"
}
```

**403 Forbidden - Not Your Order**

```json
{
  "success": false,
  "message": "Access denied - not your order"
}
```

---

## Data Models

### Order Object

```typescript
interface Order {
  _id: string;
  trackingNumber: string;
  customerId: string;
  staffId?: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'in_progress'
    | 'ready_for_pickup'
    | 'picked_up'
    | 'delivered'
    | 'cancelled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  description?: string;
  notes?: string;
  pickupDate?: Date;
  deliveryDate?: Date;
  preferredDate?: Date;
  pickupAddress?: string;
  deliveryAddress?: string;
  fulfillmentType: 'pickup' | 'delivery';
  weight?: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
  serviceType: 'wash' | 'dry-clean' | 'iron' | 'combo';

  // Audit fields
  statusHistory: Array<{
    status: string;
    changedAt: Date;
    changedBy: string; // User ID
    notes?: string;
  }>;

  // Cancellation fields
  cancelledAt?: Date;
  cancelledBy?: string; // User ID
  cancelReason?: string;

  // System fields
  createdAt: Date;
  updatedAt: Date;
}
```

### Status History Entry

```typescript
interface StatusHistoryEntry {
  status: string;
  changedAt: Date;
  changedBy: string; // User ObjectId who made change
  notes?: string; // Description of what happened
}
```

---

## Error Handling

### Common HTTP Status Codes

| Code | Meaning      | When Used                               |
| ---- | ------------ | --------------------------------------- |
| 200  | OK           | Successful request                      |
| 400  | Bad Request  | Invalid input, order not in right state |
| 403  | Forbidden    | Unauthorized, insufficient permissions  |
| 404  | Not Found    | Order doesn't exist                     |
| 500  | Server Error | Unexpected server issue                 |

### Error Response Format

```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical error details (if available)"
}
```

---

## Authentication

### JWT Token

Include in all requests:

```
Authorization: Bearer <jwt_token>
```

Token contains user information:

```javascript
{
  id: string,          // User ID
  email: string,
  role: 'customer' | 'staff' | 'admin' | 'superadmin',
  status: 'pending' | 'approved' | 'rejected' | 'active',
  iat: number,         // Issued at
  exp: number          // Expiration
}
```

### No Token

```json
{
  "success": false,
  "message": "Authorization header missing"
}
```

### Invalid Token

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## Rate Limiting

No specific rate limiting implemented. Production deployments should add:

- Per-IP rate limits
- Per-user rate limits
- Burst protection

---

## Example Integration

### JavaScript/Fetch

```javascript
// Edit order
async function editOrder(orderId, updates) {
  const response = await fetch(`/api/orders/${orderId}/edit-details`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  return response.json();
}

// Undo cancellation
async function undoCancel(orderId) {
  const response = await fetch(`/api/orders/${orderId}/undo-cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

// Revert status
async function revertStatus(orderId) {
  const response = await fetch(`/api/orders/${orderId}/revert-status`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

// Delete order
async function deleteOrder(orderId) {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
```

### cURL Examples

```bash
# Set variables
TOKEN="your_jwt_token"
ORDER_ID="507f1f77bcf86cd799439011"

# Edit order
curl -X PATCH http://localhost:3000/api/orders/$ORDER_ID/edit-details \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"weight": 2.5}'

# Undo cancellation
curl -X POST http://localhost:3000/api/orders/$ORDER_ID/undo-cancel \
  -H "Authorization: Bearer $TOKEN"

# Revert status (staff only)
curl -X POST http://localhost:3000/api/orders/$ORDER_ID/revert-status \
  -H "Authorization: Bearer $TOKEN"

# Delete order (staff/admin only)
curl -X DELETE http://localhost:3000/api/orders/$ORDER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Testing Checklist

- [ ] Customer can edit pending order fields
- [ ] Customer cannot edit non-pending orders
- [ ] Customer cannot edit other customers' orders
- [ ] Customer can cancel pending order
- [ ] Customer can undo cancellation
- [ ] Staff can revert order status
- [ ] Staff cannot revert pending/cancelled/delivered
- [ ] Staff can delete any order
- [ ] Staff cannot perform actions without approval
- [ ] Admin can delete without approval
- [ ] Status history is properly recorded
- [ ] Cancellation metadata is properly recorded
- [ ] Error messages are clear and helpful
- [ ] Unauthorized access returns 403
- [ ] Invalid orders return 404
- [ ] Server errors return 500

---

**API Version:** 1.0
**Last Updated:** Current Session
**Status:** ✅ Complete
