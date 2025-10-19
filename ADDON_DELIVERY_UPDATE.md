# Add-ons & Delivery Fee Update

## Changes Implemented ✅

### 1. **Add-ons Dropdown (Collapsible)**

- **Before:** All 3 add-ons displayed as separate cards
- **After:** Single collapsible dropdown button that opens/closes to show all 3 add-ons

**Features:**

- Click "Add-ons (Optional)" button to toggle open/close
- Shows `+` icon when closed, `−` when open
- All 3 items visible when expanded:
  - Liquid Detergent — ₱20
  - Downy — ₱10
  - Plastic — ₱5
- Quantity controls remain the same (+/− buttons and number input)

---

### 2. **Delivery Fee — ₱20**

**Automatic Calculation:**

- When "Will be Delivered" checkbox is checked → adds ₱20 to total
- When unchecked → removes ₱20 from total
- Delivery fee shown separately in pricing breakdown

**UI Updates:**

- Checkbox label now displays "+₱20" in blue text
- Delivery box has blue background for emphasis
- Warning note added: _"Maximum delivery distance: 2km from location"_

---

### 3. **Enhanced Price Breakdown**

**New total display format:**

```
Service:      ₱XXX
Add-ons:      ₱XX   (only if add-ons selected)
Delivery:     ₱20   (only if delivery checked)
─────────────────────
Total Amount: ₱XXXX
```

**Examples:**
| Scenario | Total |
|----------|-------|
| 8kg Wash (Pickup) | ₱60 |
| 8kg Wash (Delivery) | ₱80 (₱60 + ₱20) |
| 12kg Full + 1 Detergent (Pickup) | ₱200 (₱180 + ₱20) |
| 12kg Full + 1 Detergent (Delivery) | ₱220 (₱180 + ₱20 + ₱20) |

---

## Code Changes

### State Addition

```javascript
const [isAddOnsOpen, setIsAddOnsOpen] = useState(false);
```

### Price Calculation Update

```javascript
// Add delivery fee if delivery is selected
const deliveryFee = fulfillmentType === 'delivery' ? 20 : 0;
setEstimatedPrice(servicePrice + inclusionsCost + deliveryFee);
```

### Dependency Update

```javascript
// Updated useEffect dependencies to include fulfillmentType
useEffect(() => {
  calculatePrice();
}, [weight, serviceType, inclusions, fulfillmentType]);
```

---

## File Modified

- `app/customer/page.js` — NewOrderForm component

---

## Testing Checklist

### Add-ons Dropdown

- [ ] Click "Add-ons (Optional)" → dropdown opens with + icon
- [ ] Click again → dropdown closes with − icon
- [ ] Add-ons display correctly when dropdown is open
- [ ] Quantity controls work (+/−/input)
- [ ] Price updates when quantities change

### Delivery Fee

- [ ] Check "Will be Delivered" → total increases by ₱20
- [ ] Uncheck "Will be Delivered" → total decreases by ₱20
- [ ] Label shows "+₱20" in blue
- [ ] Distance note displays (2km maximum)
- [ ] Delivery address field appears when checked

### Price Breakdown

- [ ] Service cost shows correctly
- [ ] Add-ons line appears only when add-ons selected
- [ ] Delivery line appears only when delivery checked
- [ ] Total calculation is correct

### Example Test Cases

```
Test 1: 8kg Wash, Pickup, No Add-ons
Expected: ₱60 ✓

Test 2: 8kg Wash, Delivery, No Add-ons
Expected: ₱80 (₱60 + ₱20) ✓

Test 3: 12kg Full Service, Pickup, 1 Detergent
Expected: ₱200 (₱180 + ₱20) ✓

Test 4: 12kg Full Service, Delivery, 1 Detergent + 1 Downy
Expected: ₱225 (₱180 + ₱20 + ₱10 + ₱20) ✓
```

---

## Status: ✅ Ready for Testing

The form is fully updated with:

- Collapsible add-ons dropdown
- ₱20 delivery fee
- Enhanced pricing display
- Distance requirement note

All changes are backward compatible with existing order data structure.
