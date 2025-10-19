# Timestamp Display - Visual Guide

## Customer Portal - Order History View

### Header with Live Clock

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  Welcome, John!                  🕐 Philippines: Dec 15, 2024, 3:45:30 PM│
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Order Card (Collapsed)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         ▶│
│  ₱850.00                                                   [DELIVERED]  │
│  Order #ORD-2024-12345                                                  │
│                                                                          │
│  📦 5kg - Wash Service                                                  │
│  🚚 123 Main Street, Manila                                            │
│  📅 December 20, 2024                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Order Card (Expanded - Timeline Section)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ▼                                             │
│  ₱850.00                                                  [DELIVERED]   │
│  Order #ORD-2024-12345                                                  │
│                                                                          │
│  ╔══════════════════════════════════════════════════════════════════╗  │
│  ║ 🕐 Order Timeline                                            ▲  ║  │
│  ╠══════════════════════════════════════════════════════════════════╣  │
│  ║                                                                  ║  │
│  ║  ORDER PLACED         │  PREFERRED DELIVERY                    ║  │
│  ║  ├─ Dec 15, 2024     │  ├─ 📅 December 20, 2024              ║  │
│  ║  └─ 2:30:45 PM       │  └─ ⏰ Afternoon                        ║  │
│  ║                       │                                         ║  │
│  ╚══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
│  [Progress Tracker - Delivery Status]                                  │
│  ━━━━●━━━●━━━●━━━●━━━●    [DELIVERED]                                  │
│   Pending Confirmed Processing Ready Delivered                          │
│                                                                          │
│  ...Additional options...                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Staff Portal - Order Card

### Top Bar with Live Clock

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ☰  Orders Dashboard    🕐 Philippines: Dec 15, 2024, 3:45:30 PM  🔔 👤│
└─────────────────────────────────────────────────────────────────────────┘
```

### Order Card (Pending)

```
┌──────────────────────────────────────┐
│ John Doe                [PENDING]   ✕ │
│ +63917123456                         │
│                                      │
│ Tracking: ORD-2024-12345            │
│ Items: 3                            │
│ Service: Wash                       │
│                                      │
│ ╔════════════════════════════════╗  │
│ ║ ORDER PLACED                   ║  │
│ ║ Dec 15, 2024, 2:30:45 PM      ║  │
│ ╚════════════════════════════════╝  │
│                                      │
│ ╔════════════════════════════════╗  │
│ ║ PREFERRED DELIVERY             ║  │
│ ║ 📅 December 20, 2024           ║  │
│ ║ ⏰ Afternoon                    ║  │
│ ╚════════════════════════════════╝  │
│                                      │
│ Address: 123 Main Street           │
│ ₱850.00                            │
│                                      │
│ [Start Wash]  [Cancel Order]       │
└──────────────────────────────────────┘
```

### Order Card (In Progress)

```
┌──────────────────────────────────────┐
│ Maria Santos            [IN PROGRESS]│
│ +63987654321                    ✕    │
│                                      │
│ Tracking: ORD-2024-12346            │
│ Items: 2                            │
│ Service: Dry-clean                 │
│                                      │
│ ╔════════════════════════════════╗  │
│ ║ ORDER PLACED                   ║  │
│ ║ Dec 14, 2024, 10:15:22 AM     ║  │
│ ╚════════════════════════════════╝  │
│                                      │
│ ╔════════════════════════════════╗  │
│ ║ PREFERRED DELIVERY             ║  │
│ ║ 📅 December 18, 2024           ║  │
│ ║ ⏰ Morning                      ║  │
│ ╚════════════════════════════════╝  │
│                                      │
│ Address: 456 Oak Avenue            │
│ ₱1,200.00                          │
│                                      │
│ [Ready for Pickup]                 │
└──────────────────────────────────────┘
```

---

## Timeline Information Display

### What Gets Shown

**ORDER PLACED (Blue section)**

```
When:    When the customer submitted the order
Format:  Month DD, YYYY, H:MM:SS AM/PM
Example: Dec 15, 2024, 2:30:45 PM
Zone:    Always Manila timezone (Asia/Manila)
```

**PREFERRED DELIVERY (Green section)**

```
Date:    What date customer wants delivery/pickup
Format:  Full Month name DD, YYYY
Example: December 20, 2024
Options:
  ⏰ Morning   (e.g., 7 AM - 12 PM)
  ⏰ Afternoon (e.g., 12 PM - 5 PM)
  ⏰ Night     (e.g., 5 PM - 10 PM)
Zone:    Always Manila timezone
```

---

## Live Clock Behavior

### Real-time Updates

```
Initial:   Dec 15, 2024, 3:45:30 PM
+1 sec:    Dec 15, 2024, 3:45:31 PM
+1 sec:    Dec 15, 2024, 3:45:32 PM
+1 sec:    Dec 15, 2024, 3:45:33 PM
```

### Styling

```
🕐 Philippines: Dec 15, 2024, 3:45:30 PM
├─ Blue background
├─ Pulsing clock icon
├─ Right-aligned in header
└─ Updates automatically every second
```

---

## Color Coding Explanation

### Blue (Order Submission)

- Represents: When the order was created
- Significance: Reference point for all future status updates
- Action: No action needed, informational only

### Green (Preferred Delivery)

- Represents: When customer wants delivery/pickup
- Significance: Target date/time for staff planning
- Action: Staff should aim to meet this deadline

### Gray (Secondary Info)

- Items, service type, address
- Supporting information
- Context for the order

---

## Mobile Responsiveness

### Small Screens (Mobile)

```
┌─────────────────────────────┐
│ Welcome, John!              │
│ 🕐 Philippines: Dec 15, ..│
│                             │
│ [Order Card]                │
│ ₱850.00      [DELIVERED]   │
│ Order #12345                │
│ ...                         │
└─────────────────────────────┘
```

### Tablet

```
┌─────────────────────────────────────────┐
│ Welcome, John!      🕐 Philippines: ..  │
│                                         │
│ [Order Card showing timeline]           │
│ Timeline displays in 2 columns:         │
│ LEFT: Order Placed                      │
│ RIGHT: Preferred Delivery               │
└─────────────────────────────────────────┘
```

### Desktop

```
┌──────────────────────────────────────────────────────────┐
│ Welcome, John!         🕐 Philippines: Dec 15, 2:30 PM  │
│                                                          │
│ [Full Order Details with expanded timeline section]     │
│ Timeline displays in grid:                              │
│ LEFT: Order Placed  |  RIGHT: Preferred Delivery        │
└──────────────────────────────────────────────────────────┘
```

---

## Timezone Example

### Real-World Example

```
Customer in Manila orders laundry at 2:30:15 PM (local time)

UTC Time stored in DB:  2024-12-15T06:30:15.000Z
Display in Manila TZ:   Dec 15, 2024, 2:30:15 PM

(UTC+8 = Manila timezone, so 06:30 UTC = 14:30 Manila = 2:30 PM)
```

### Why This Matters

```
✓ Accurate tracking: Know exactly when order was placed
✓ Staff coordination: Preferred times help with scheduling
✓ Customer confidence: See system timestamp matches their time
✓ Transparency: No confusion about timezones
```

---

## Feature Benefits

| Feature              | Customer Benefit                       | Staff Benefit              |
| -------------------- | -------------------------------------- | -------------------------- |
| Live Clock           | Know current time in their timezone    | Reference for scheduling   |
| Order Placement Time | Transparency on when order was created | Verify order age/priority  |
| Preferred Date       | See their requested delivery date      | Plan fulfillment schedule  |
| Preferred Time       | Know delivery time window              | Assign delivery time slots |
| Visual Grouping      | Easy to scan                           | Quick information lookup   |
| Color Coding         | Intuitive understanding                | Faster decision making     |
