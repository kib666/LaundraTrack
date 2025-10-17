# 👥 LaudraTrack - User Workflows & Automation

## Complete Automation Workflow

LaudraTrack automates the entire laundry management process from customer signup to delivery.

---

## 🧑‍💼 **Workflow 1: Customer Registration & Order**

### Step 1: Customer Registration
```
1. Customer visits https://yourapp.vercel.app
2. Clicks "Register" or "Sign Up"
3. Fills form:
   - Email: customer@example.com
   - Password: SecurePass123! (min 8 chars, 1 uppercase, 1 number, 1 special char)
   - Confirm Password: SecurePass123!
   - First Name: John
   - Last Name: Doe
   - Phone: +1234567890
   - Role: Customer (selected)

4. SYSTEM AUTOMATICALLY:
   ✓ Validates email format
   ✓ Validates password strength
   ✓ Hashes password with bcrypt
   ✓ Creates account in MongoDB
   ✓ Sets status: ACTIVE (no approval needed)
   ✓ Generates JWT token
   ✓ Logs customer in
   ✓ Redirects to dashboard
```

### Step 2: Customer Dashboard
```
Customer now sees:
- Welcome message
- "Create Order" button
- "View My Orders" section
- "Book Appointment" section
- Order history (empty initially)
```

### Step 3: Create Order
```
Customer clicks "Create Order":

Form:
- Service Type: Wash / Dry Clean / Iron / Combo
- Items:
  * Item 1: "T-Shirt" × 2 @ $5.00 = $10.00
  * Item 2: "Pants" × 1 @ $10.00 = $10.00
  * Item 3: "Jacket" × 1 @ $20.00 = $20.00
- Total: $40.00
- Description: "Regular laundry, gentle with colors"
- Pickup Address: 123 Main Street, Apt 4B
- Delivery Address: Same as pickup
- Preferred Pickup Date: Feb 15, 2024
- Preferred Delivery Date: Feb 17, 2024

SYSTEM AUTOMATICALLY:
✓ Validates all required fields
✓ Generates Tracking Number: ORD-1707900000000-ABC12345
✓ Creates order in MongoDB
✓ Sets status: PENDING (awaits admin confirmation)
✓ Sets payment status: PENDING
✓ Sends notification to admin
✓ Shows confirmation to customer
```

### Step 4: Book Appointment
```
Customer clicks "Book Appointment":

Form:
- Type: Pickup
- Date: Feb 15, 2024
- Time Slot: 10:00 AM - 12:00 PM
- Notes: "Ring doorbell twice"
- Order: [Select from dropdown]

SYSTEM AUTOMATICALLY:
✓ Checks if time slot is available
✓ Reserves time slot
✓ Creates appointment record
✓ Sends confirmation email
✓ Shows appointment in customer dashboard
```

### Step 5: Track Order
```
Customer can:
- View order status: PENDING
- See tracking number: ORD-1707900000000-ABC12345
- See appointment details
- Get notifications when status changes
```

---

## 🛡️ **Workflow 2: Staff Registration & Approval**

### Step 1: Staff Registration
```
1. Staff member visits https://yourapp.vercel.app
2. Clicks "Join as Staff"
3. Fills form (same as customer, but selects "Staff" role):
   - Email: staff@example.com
   - Password: StaffPass123!
   - Name: Jane Smith
   - Phone: +1234567891
   - Role: STAFF (selected)

4. SYSTEM AUTOMATICALLY:
   ✓ Validates all fields
   ✓ Hashes password
   ✓ Creates account in MongoDB
   ✓ Sets status: PENDING (awaits admin approval)
   ✓ NO JWT token generated
   ✓ Shows message: "Your application is pending admin approval"
   ✓ Cannot login yet
   ✓ Sends notification to admin
```

### Step 2: Admin Review (See Workflow 3)
```
Admin sees pending staff registration:
- Email: staff@example.com
- Name: Jane Smith
- Status: PENDING
- Applied: Feb 14, 2024

Admin can:
- Approve (activate account)
- Reject (deny access)
```

### Step 3: Admin Approves Staff
```
Admin clicks "Approve":

SYSTEM AUTOMATICALLY:
✓ Updates status: ACTIVE
✓ Records approver: Admin ID
✓ Records approval time: Feb 14, 2024 10:30 AM
✓ Sends approval email to staff
✓ Staff can now login
```

### Step 4: Staff Login
```
1. Staff visits app
2. Enters email: staff@example.com
3. Enters password: StaffPass123!
4. SYSTEM:
   ✓ Validates credentials
   ✓ Checks status: ACTIVE
   ✓ Generates JWT token
   ✓ Logs staff in
   ✓ Shows staff dashboard
```

### Step 5: Staff Dashboard
```
Staff sees:
- "My Assignments" (orders assigned to them)
- "Available Orders" (pending orders to pick up)
- "Appointments" (scheduled pickups/deliveries)
- "Order Status Updates"

Staff can:
- View pending orders
- Accept/Pickup order
- Update delivery status
- Mark as delivered
- See customer details
- Notes on special handling
```

---

## 👨‍💼 **Workflow 3: Admin Management**

### Step 1: Admin Dashboard
```
Admin sees:
1. Dashboard Stats:
   - Total Orders: 42
   - Pending Approvals: 5 (staff registrations)
   - Active Staff: 8
   - Total Customers: 150
   - Revenue This Month: $5,240

2. Pending Users Tab:
   Shows all pending staff registrations

3. Orders Tab:
   Shows all orders across system

4. Users Tab:
   Shows all users by role
```

### Step 2: Approve/Reject Staff
```
APPROVE:
1. Admin views pending staff: Jane Smith
2. Clicks "Approve"
3. SYSTEM:
   ✓ Sets status: ACTIVE
   ✓ Records approval
   ✓ Sends email to staff
   ✓ Staff can now login

REJECT:
1. Admin clicks "Reject"
2. Admin enters reason: "Experience requirements not met"
3. SYSTEM:
   ✓ Sets status: REJECTED
   ✓ Records reason
   ✓ Sends rejection email to staff
   ✓ Staff cannot login
```

### Step 3: Manage Orders
```
Admin can:
- View all orders
- Filter by status: PENDING, CONFIRMED, IN_PROGRESS, DELIVERED
- Assign staff to orders
- Update order status
- Delete orders if needed
- See payment status
- Modify order details
```

### Step 4: Assign Orders to Staff
```
Order: ORD-1707900000000-ABC12345
Status: PENDING

Admin:
1. Clicks "Assign Staff"
2. Selects: Jane Smith (staff)
3. Clicks "Confirm"

SYSTEM:
✓ Updates staffId in order
✓ Changes status: CONFIRMED
✓ Notifies customer: "Your order is confirmed"
✓ Notifies staff: "New order assigned to you"
✓ Moves order to staff dashboard
```

---

## 📋 **Workflow 4: Complete Order Flow**

### Timeline:

```
DAY 1 - CUSTOMER CREATES ORDER
└─ Customer: Submits order (Status: PENDING)
└─ Admin: Receives notification
└─ Admin: Approves order (Status: CONFIRMED)
└─ Customer: Receives confirmation email
└─ Staff: Sees order in dashboard

DAY 1 - SCHEDULED PICKUP
└─ 10:00 AM: Staff arrives at customer address
└─ Staff: Updates status to PICKED_UP
└─ Customer: Gets notification "Your order has been picked up"
└─ System: Records pickup time

DAY 1-2 - IN TRANSIT
└─ Staff: Updates status to IN_PROGRESS
└─ Customer: Notification "We're washing your items"
└─ System: Shows estimated delivery date

DAY 2 - ORDER READY
└─ Staff: Updates status to READY_FOR_PICKUP
└─ Customer: Notification "Your order is ready"
└─ System: Shows ready location/delivery info

DAY 3 - DELIVERY
└─ Staff: Arrives at delivery address
└─ Staff: Updates status to DELIVERED
└─ Customer: Notification "Your order delivered!"
└─ System: Marks order complete
└─ Customer: Can leave rating/review
```

### Real-Time Status Updates (in order):

```
1. PENDING → Created, awaiting admin confirmation
2. CONFIRMED → Admin approved, staff assigned
3. PICKED_UP → Staff picked up order
4. IN_PROGRESS → Being washed/processed
5. READY_FOR_PICKUP → Ready for customer
6. DELIVERED → Successfully delivered
```

---

## 🔔 **Automated Notifications**

### Customer Notifications:
```
✓ Order Created: "Your order #ORD-123 has been created"
✓ Order Confirmed: "Your order has been confirmed"
✓ Picked Up: "Staff picked up your order at 10:15 AM"
✓ In Progress: "We're washing your items"
✓ Ready: "Your order is ready for delivery"
✓ Delivered: "Your order delivered at 2:30 PM"
✓ Staff Changed: "Your order assigned to Jane Smith"
```

### Staff Notifications:
```
✓ Order Assigned: "New order assigned: ORD-123"
✓ Appointment Reminder: "Pickup scheduled in 2 hours"
✓ Status Confirmation: "Order marked as delivered"
```

### Admin Notifications:
```
✓ Staff Applied: "New staff application: John Smith"
✓ New Order: "New order created: ORD-123"
✓ Order Status: "Order delivered: ORD-123"
✓ Revenue Update: "Total orders this month: 42"
```

---

## 🔐 **Role-Based Access Control**

### Customer Access:
```
Can DO:
✓ Register
✓ Login
✓ View own profile
✓ Create orders
✓ View own orders
✓ Update pending orders
✓ Book appointments
✓ Track order status
✓ Logout

Cannot DO:
✗ View other users' orders
✗ Approve staff
✗ Assign orders
✗ Delete orders
✗ Access admin panel
✗ Modify staff
```

### Staff Access:
```
Can DO:
✓ Login (after approval)
✓ View assigned orders
✓ View available orders
✓ Update order status
✓ View appointments
✓ See customer details
✓ Update delivery status
✓ Logout

Cannot DO:
✗ Create orders
✗ Delete orders
✗ Approve users
✗ View other staff orders
✗ Change pricing
✗ Access admin panel
```

### Admin Access:
```
Can DO:
✓ All user actions
✓ View all orders
✓ View all users
✓ Approve/Reject staff
✓ Assign orders
✓ Update order status
✓ Delete orders/users
✓ View analytics
✓ Manage system

Admin Only:
✓ Approve staff
✓ Reject applications
✓ Delete records
✓ View all data
✓ Assign orders
```

---

## 📊 **Data Flow Diagram**

```
┌─────────────┐
│  Customer   │
└──────┬──────┘
       │ Registers
       ▼
┌──────────────────┐      ┌──────────┐
│  User DB         │◄────►│ MongoDB  │
│  - Email         │      └──────────┘
│  - Password      │
│  - Name          │
│  - Phone         │
│  - Status        │
└──────┬───────────┘
       │
       ├─ Status: ACTIVE
       │ (Customer)
       │
       ├─ Status: PENDING
       │ (Staff) ──► Admin Reviews ──► APPROVED ──► Status: ACTIVE
       │                            ──► REJECTED ──► Status: REJECTED
       │
       ▼
   ┌─────────────┐
   │  Orders DB  │
   │  - ID       │
   │  - Customer │
   │  - Items    │
   │  - Status   │
   │  - Staff    │
   └──────┬──────┘
          │
          ├─ PENDING ──► Admin Confirms
          │
          ├─ CONFIRMED ──► Staff Assigned
          │
          ├─ PICKED_UP ──► In Transit
          │
          ├─ IN_PROGRESS ──► Processing
          │
          ├─ READY ──► Awaiting Delivery
          │
          └─ DELIVERED ──► Complete
```

---

## ⚙️ **Automated Tasks**

The system automatically:

1. **Validates Inputs**: All form data validated before saving
2. **Hashes Passwords**: Using bcryptjs (never stored plaintext)
3. **Generates Tokens**: JWT tokens for secure sessions
4. **Creates Tracking Numbers**: Unique IDs for each order
5. **Sends Notifications**: Email alerts for status changes
6. **Manages Appointments**: Prevents double-booking time slots
7. **Enforces Permissions**: Only authorized users can access data
8. **Records Approvals**: Tracks who approved staff and when
9. **Updates Status**: Changes reflected in real-time
10. **Maintains Audit Trail**: All actions logged with timestamps

---

## 🧪 **Test Scenarios**

### Scenario 1: Complete Happy Path
```
1. Customer registers ✓
2. Customer creates order ✓
3. Admin approves order ✓
4. Staff registers ✓
5. Admin approves staff ✓
6. Staff logs in ✓
7. Order assigned to staff ✓
8. Staff updates status ✓
9. Order delivered ✓
10. Customer sees completion ✓
```

### Scenario 2: Staff Rejection
```
1. Staff applies ✓
2. Admin reviews ✓
3. Admin rejects ✓
4. Staff cannot login ✗
5. Rejection email sent ✓
```

### Scenario 3: Order Modification
```
1. Customer creates order ✓
2. Order is PENDING ✓
3. Customer updates items ✓
4. Admin confirms ✓
5. Order becomes CONFIRMED ✓
6. Customer cannot modify ✗
```

---

## 📱 **User Journey Map**

### Customer Journey:
```
Browse Site
    ↓
Register Account
    ↓
Login
    ↓
Create Order
    ↓
Book Appointment
    ↓
Wait for Pickup
    ↓
Receive Updates
    ↓
Order Delivered
    ↓
Happy Customer
```

### Staff Journey:
```
Visit Site
    ↓
Apply as Staff
    ↓
Await Approval
    ↓
Approval Email
    ↓
Login
    ↓
View Orders
    ↓
Accept Assignment
    ↓
Pickup Order
    ↓
Process & Deliver
    ↓
Update Status
```

### Admin Journey:
```
Login to Dashboard
    ↓
Review Stats
    ↓
Review Applications
    ↓
Approve/Reject Staff
    ↓
Manage Orders
    ↓
Monitor Operations
    ↓
View Analytics
    ↓
Make Decisions
```

---

## ✅ **Success Metrics**

- Registration Success Rate
- Order Fulfillment Time
- Customer Satisfaction
- Staff Utilization
- Revenue Tracking
- Appointment Adherence
- Delivery Accuracy

---

## 🚀 **Automation Benefits**

✓ **No Manual Intervention**: Automatic approvals & notifications
✓ **Scalability**: Handle hundreds of orders simultaneously
✓ **Real-Time Updates**: Customers see status instantly
✓ **Security**: Password hashing, JWT tokens, role-based access
✓ **Data Integrity**: MongoDB ensures reliable storage
✓ **Audit Trail**: All actions recorded with timestamps
✓ **Error Prevention**: Validation at every step
✓ **24/7 Availability**: Always accessible online

---

**This complete automation means your business runs smoothly with minimal manual work!** 🎉
