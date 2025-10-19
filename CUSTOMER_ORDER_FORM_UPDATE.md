# Customer Order Form - Complete Update

## Overview

The Customer Order Form (`app/customer/page.js` - `NewOrderForm` component) has been completely redesigned with a new pricing structure, inclusions system, and improved UX.

---

## Form Sections

### 1. **Service Type Selection**

- **Radio button options:**
  - Wash (only wash service)
  - Wash and Dry (wash + dry)
  - Full Service (wash + dry + fold)

### 2. **Weight Selection**

- **Button-style selection** (8kg or 12kg only)
- Selected weight shows blue highlighting
- Buttons are mutually exclusive

### 3. **Pricing Breakdown**

- **Dynamic display** shows pricing breakdown based on selected service and weight
- **For 8kg:**
  - Wash: ₱60
  - Dry: ₱60
  - Fold: ₱25
- **For 12kg:**
  - Wash: ₱75
  - Dry: ₱75
  - Fold: ₱30
- Shown in blue info box

### 4. **Add-ons Section (Inclusions)**

Each add-on has:

- Name and unit price displayed
- **Quantity selector** with +/− buttons
- Direct number input field (if customers want to type)

**Available Add-ons:**
| Item | Price |
|------|-------|
| Liquid Detergent | ₱20 each |
| Downy | ₱10 each |
| Plastic | ₱5 each |

### 5. **Total Amount Display**

- Automatically calculated based on:
  - Selected service type
  - Selected weight
  - Quantity of each inclusion
- Shown in green box with large font
- Updates in real-time

### 6. **Fulfillment Type**

- Checkbox toggle: "Will be Delivered"
- Shows delivery address input if delivery is selected

### 7. **Additional Fields**

- Preferred Date (required)
- Delivery Address (shown if delivery selected)
- Notes (optional)

### 8. **Submit Button**

- Disabled until weight is selected
- Shows loading state while submitting

---

## State Management

### Form State Variables:

```javascript
- weight: string (empty, '8', or '12')
- serviceType: 'wash' | 'washAndDry' | 'fullService'
- inclusions: { liquidDetergent: 0, downy: 0, plastic: 0 }
- deliveryAddress: string
- fulfillmentType: 'pickup' | 'delivery'
- preferredDate: string (ISO date)
- notes: string
- estimatedPrice: number (calculated automatically)
- error: string
- isLoading: boolean
```

---

## Pricing Calculation Logic

```javascript
1. Get base service price for selected weight:
   - Wash: ₱60/75
   - Wash + Dry: ₱120/150
   - Full Service: ₱145/180

2. Add inclusions cost:
   - Liquid Detergent × quantity × ₱20
   - Downy × quantity × ₱10
   - Plastic × quantity × ₱5

3. Total = Service Price + Inclusions Cost
```

---

## Form Data Sent to API

When the form is submitted, the following data is sent to `/api/orders`:

```json
{
  "items": [
    {
      "name": "Full Service (Wash, Dry, and Fold) - 12kg",
      "quantity": 1,
      "price": 180
    }
  ],
  "totalAmount": 215,
  "weight": 12,
  "serviceType": "fullService",
  "fulfillmentType": "delivery",
  "deliveryAddress": "123 Main St, City",
  "preferredDate": "2024-10-25",
  "description": "Full Service (Wash, Dry, and Fold) service for 12kg",
  "inclusions": {
    "liquidDetergent": 1,
    "downy": 0,
    "plastic": 2
  },
  "notes": "Handle delicately"
}
```

---

## UI/UX Improvements

✅ **Cleaner Layout:**

- Organized in logical sections with clear separation

✅ **Visual Feedback:**

- Service type options highlight when selected (blue border)
- Weight buttons show visual state (blue when active)
- Pricing breakdown in colored info boxes

✅ **Real-time Calculation:**

- Total price updates immediately as selections change
- Pricing breakdown shows only relevant components

✅ **Ease of Use:**

- Simple weight selection with buttons (no typing)
- +/− buttons for inclusions (no need to select from dropdown)
- Direct number input for advanced users

✅ **Clear Pricing:**

- All prices visible at a glance
- No hidden charges
- Clear breakdown before submission

---

## Testing Checklist

### Test 1: Service Type Selection

```
□ Click "Wash" - only wash cost shown
□ Click "Wash and Dry" - wash + dry costs shown
□ Click "Full Service" - wash + dry + fold costs shown
□ Service type radio buttons work correctly
```

### Test 2: Weight Selection

```
□ Click 8kg button - turns blue, weight selected
□ Click 12kg button - turns blue, weight selected
□ Only one weight can be selected at a time
□ Pricing updates based on weight
```

### Test 3: Pricing Accuracy

```
Test: 8kg + Wash
□ Expected price: ₱60

Test: 8kg + Wash and Dry
□ Expected price: ₱120

Test: 8kg + Full Service
□ Expected price: ₱145

Test: 12kg + Wash
□ Expected price: ₱75

Test: 12kg + Wash and Dry
□ Expected price: ₱150

Test: 12kg + Full Service
□ Expected price: ₱180
```

### Test 4: Inclusions Calculation

```
Test: 8kg + Wash + 1 Liquid Detergent
□ Expected: ₱60 + ₱20 = ₱80

Test: 12kg + Full Service + 1 Downy + 2 Plastic
□ Expected: ₱180 + ₱10 + (₱5 × 2) = ₱200

Test: 8kg + Wash and Dry + 1 Liquid Detergent + 1 Downy + 1 Plastic
□ Expected: ₱120 + ₱20 + ₱10 + ₱5 = ₱155
```

### Test 5: Inclusion Quantity Controls

```
□ Click + button - quantity increases
□ Click − button - quantity decreases
□ Direct typing in number field works
□ Can't set quantity below 0
□ Total updates automatically
```

### Test 6: Form Validation

```
□ Submit button disabled until weight selected
□ Error shown if no weight selected
□ Error shown if no preferred date selected
□ Error shown if delivery address missing (when delivery selected)
□ Successful submission shows loading state
```

### Test 7: Form Reset

```
□ After successful submission, all fields reset
□ Service type resets to "Wash"
□ Weight resets to empty
□ Inclusions reset to 0
□ Price resets to 0
```

---

## Database/API Considerations

**Note:** The Order API endpoint (`/api/orders`) may need to be updated to handle:

- New `serviceType` values: `'wash'`, `'washAndDry'`, `'fullService'`
- New `inclusions` object with quantities
- New weight options: only `8` or `12`

Ensure the API endpoint properly stores and retrieves these fields.

---

## Future Enhancements

- Add quantity discount tiers
- Pre-calculate rush delivery fees
- Show estimated completion time
- Add progress indicator for form completion
- Save cart for later functionality

---

## Files Modified

| File                   | Changes                                                                          |
| ---------------------- | -------------------------------------------------------------------------------- |
| `app/customer/page.js` | Updated `NewOrderForm` component with new pricing, service types, and inclusions |

---

## Status: ✅ Ready for Testing

The form is fully implemented and ready for:

1. Visual testing in browser
2. Calculation accuracy verification
3. Form submission testing
4. API integration testing
