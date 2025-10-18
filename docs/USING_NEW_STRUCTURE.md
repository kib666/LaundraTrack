# 🚀 Using the New File Structure

## Quick Start Guide

### 1. **Making API Calls** (BEFORE ❌ vs AFTER ✅)

#### BEFORE - Wrong Way
```javascript
// Inside component ❌
'use client';
import axios from 'axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:3001/api/orders')
      .then(res => setOrders(res.data));
  }, []);
}
```

#### AFTER - Correct Way ✅
```javascript
'use client';
import { useApi } from '@/hooks/useApi';
import { getOrders } from '@/services/orderService';

export default function Orders() {
  const { data: orders, loading } = useApi(getOrders);
}
```

**Why?** Services are centralized, reusable, and easier to maintain.

---

### 2. **Using Constants** (BEFORE ❌ vs AFTER ✅)

#### BEFORE - Hardcoded ❌
```javascript
{status === 'delivered' && <Badge color="green">Delivered</Badge>}
{status === 'pending' && <Badge color="yellow">Pending</Badge>}
{user?.role === 'admin' && <AdminPanel />}
```

#### AFTER - Using Constants ✅
```javascript
import { ORDER_STATUS, ROLES } from '@/constants';

{status === ORDER_STATUS.DELIVERED && <Badge color="green">Delivered</Badge>}
{status === ORDER_STATUS.PENDING && <Badge color="yellow">Pending</Badge>}
{user?.role === ROLES.ADMIN && <AdminPanel />}
```

**Why?** Constants are single source of truth, easy to update globally.

---

### 3. **Form Management** (BEFORE ❌ vs AFTER ✅)

#### BEFORE - Manual State ❌
```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});
const [touched, setTouched] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === 'email') setEmail(value);
  if (name === 'password') setPassword(value);
};
// ... lots of boilerplate
```

#### AFTER - Using Hook ✅
```javascript
import { useForm } from '@/hooks/useForm';

const { values, errors, touched, handleChange, handleSubmit } = useForm(
  { email: '', password: '' },
  onSubmitHandler
);

return (
  <form onSubmit={handleSubmit}>
    <input name="email" value={values.email} onChange={handleChange} />
    {errors.email && <span>{errors.email}</span>}
  </form>
);
```

**Why?** Cleaner code, reusable across all forms.

---

### 4. **Data Formatting**

#### Example: Format a Date and Currency
```javascript
import { formatDate, formatCurrency } from '@/utils/formatters';

const order = {
  createdAt: '2024-01-15T10:30:00Z',
  totalAmount: 149.99
};

console.log(formatDate(order.createdAt)); // "January 15, 2024"
console.log(formatCurrency(order.totalAmount)); // "$149.99"
```

---

### 5. **Input Validation**

#### Example: Validate Form Inputs
```javascript
import { isValidEmail, isStrongPassword } from '@/utils/validators';

const handleRegister = (formData) => {
  if (!isValidEmail(formData.email)) {
    setError('Invalid email format');
    return;
  }
  
  if (!isStrongPassword(formData.password)) {
    setError('Password must be at least 8 chars with uppercase, number, and special character');
    return;
  }
  
  // Proceed with registration
};
```

---

### 6. **Creating a New Feature**

#### Step 1: Add to Constants
```javascript
// File: /constants/index.js - Add this:
export const API_ENDPOINTS = {
  PRODUCTS: {
    LIST: '/api/products',
    GET: (id) => `/api/products/${id}`,
    CREATE: '/api/products',
  },
};
```

#### Step 2: Create Service
```javascript
// File: /services/productService.js
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants';

export const getProducts = () => 
  apiClient.get(API_ENDPOINTS.PRODUCTS.LIST);

export const getProduct = (id) => 
  apiClient.get(API_ENDPOINTS.PRODUCTS.GET(id));

export const createProduct = (data) => 
  apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, data);
```

#### Step 3: Create Hook (Optional)
```javascript
// File: /hooks/useProducts.js
'use client';
import { useApi } from './useApi';
import { getProducts } from '@/services/productService';

export const useProducts = () => {
  return useApi(getProducts);
};
```

#### Step 4: Use in Component
```javascript
'use client';
import { useProducts } from '@/hooks/useProducts';

export default function ProductsList() {
  const { data: products, loading, error, execute } = useProducts();
  
  useEffect(() => {
    execute();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {products?.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

---

### 7. **File Import Best Practices**

#### Use Aliases (`@/`)
```javascript
// ✅ GOOD - Clear and readable
import { useForm } from '@/hooks/useForm';
import { formatDate } from '@/utils/formatters';
import { ROLES } from '@/constants';

// ❌ BAD - Confusing relative paths
import { useForm } from '../../../hooks/useForm';
import { formatDate } from '../../../utils/formatters';
```

---

## 📂 File Organization Reference

### When to put code in each location:

| Location | What Goes Here | Examples |
|----------|---|---|
| `/constants` | Static values, config, enums | `ROLES`, `ORDER_STATUS`, `API_ENDPOINTS` |
| `/services` | API calls, external service integration | `orderService.js`, `authService.js` |
| `/hooks` | Custom React hooks | `useForm.js`, `useApi.js`, `useAuth.js` |
| `/utils` | Pure functions, formatters, validators | `formatDate()`, `isValidEmail()` |
| `/types` | Type definitions, interfaces | JSDoc type definitions |
| `/styles` | CSS modules, global styles | Button styles, form styles |
| `/components` | React components | UI components, page components |
| `/lib` | Infrastructure, auth setup | Database config, auth middleware |
| `/public` | Static assets | Images, icons, fonts |

---

## 🎯 Common Patterns

### Pattern 1: Fetch Data on Component Mount
```javascript
'use client';
import { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { getOrders } from '@/services/orderService';

export default function OrdersPage() {
  const { data: orders, loading, execute } = useApi(getOrders);
  
  useEffect(() => {
    execute();
  }, [execute]);
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {orders?.map(order => <OrderCard key={order.id} order={order} />)}
    </div>
  );
}
```

### Pattern 2: Form with Submission
```javascript
'use client';
import { useForm } from '@/hooks/useForm';
import { createOrder } from '@/services/orderService';
import styles from '@/styles/components.module.css';

export default function CreateOrderForm() {
  const { values, handleChange, handleSubmit } = useForm(
    { customerName: '', amount: '' },
    async (values) => {
      await createOrder(values);
      // Handle success
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="customerName" 
        value={values.customerName} 
        onChange={handleChange}
        className={styles.input}
      />
      <button type="submit" className={styles.buttonPrimary}>
        Create Order
      </button>
    </form>
  );
}
```

### Pattern 3: Conditional Rendering Based on Role
```javascript
'use client';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/constants';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      
      {user?.role === ROLES.ADMIN && (
        <AdminPanel />
      )}
      
      {user?.role === ROLES.STAFF && (
        <StaffPanel />
      )}
      
      {user?.role === ROLES.CUSTOMER && (
        <CustomerPanel />
      )}
    </div>
  );
}
```

---

## ✅ Checklist for New Components

- [ ] Place component in correct folder (`/components/admin`, `/components/customer`, etc.)
- [ ] Use `'use client'` if component needs interactivity
- [ ] Import from `/constants` instead of hardcoding values
- [ ] Use services from `/services` for API calls
- [ ] Use custom hooks from `/hooks`
- [ ] Use utilities from `/utils` for formatting/validation
- [ ] Use styles from `/styles/components.module.css` if needed
- [ ] Add proper TypeScript/JSDoc types
- [ ] Export as default: `export default ComponentName`
- [ ] Use `@/` imports, not relative paths

---

## 🆘 Troubleshooting

### Issue: `Cannot find module '@/...'`
**Solution:** Make sure `tsconfig.json` or `jsconfig.json` has the path alias configured.

### Issue: API calls not working
**Solution:** Check that the service is using the correct `apiClient` and endpoint.

### Issue: Form state not updating
**Solution:** Make sure you're using the `useForm` hook and passing the right initial values.

### Issue: Formatting function returning undefined
**Solution:** Check that the input is valid (e.g., valid date object for `formatDate`).

---

## 📚 Documentation Files

- **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** - Complete directory structure overview
- **[STRUCTURE_IMPROVEMENTS.md](./STRUCTURE_IMPROVEMENTS.md)** - Details of all improvements made
- **[README.md](./README.md)** - Project overview
- **[SETUP.md](./SETUP.md)** - Initial setup instructions

---

## 🎓 Next Steps

1. ✅ Review this structure
2. ✅ Start using services instead of direct API calls
3. ✅ Move existing utilities to `/utils`
4. ✅ Create additional services as needed
5. ✅ Create hooks for complex stateful logic
6. ✅ Add unit tests for utilities and services

---

**Happy Coding! 🚀**