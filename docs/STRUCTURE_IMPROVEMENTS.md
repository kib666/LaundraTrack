# 🎯 LaudraTrack - File Structure Improvements

## What Was Done

A comprehensive file structure reorganization was completed to follow Next.js and React best practices. Below is a summary of all improvements.

---

## ✅ New Directories Created

### Core Organization
- ✓ `/constants` - Central configuration and constants
- ✓ `/services` - API layer with Axios setup
- ✓ `/hooks` - Custom React hooks
- ✓ `/types` - Type definitions
- ✓ `/utils` - Utility and helper functions
- ✓ `/styles` - CSS modules and styling
- ✓ `/public` - Static assets (images, icons)

### Library Organization
- ✓ `/lib/api` - API utilities and handlers
- ✓ `/lib/db` - Database utilities and models
- ✓ `/lib/auth` - Authentication configuration

---

## 📦 New Files Created

### Constants (`/constants/index.js`)
Central location for all application constants:
- App configuration
- API base URL and timeout
- User roles (admin, staff, customer)
- Order statuses
- Appointment statuses
- Application routes
- API endpoints

**Usage:**
```javascript
import { ROLES, ORDER_STATUS, API_ENDPOINTS } from '@/constants';
```

### Services (`/services/`)

#### `apiClient.js`
Centralized Axios instance with:
- Interceptors for auth tokens
- Error handling
- Automatic 401 redirect

**Usage:**
```javascript
import apiClient from '@/services/apiClient';
```

#### `authService.js`
Authentication API calls:
- `login(email, password)`
- `register(userData)`
- `logout()`
- `getCurrentUser()`
- `refreshToken()`

**Usage:**
```javascript
import { login, register } from '@/services/authService';
```

#### `orderService.js`
Order management API calls:
- `getOrders(params)`
- `getOrder(id)`
- `createOrder(data)`
- `updateOrder(id, data)`
- `deleteOrder(id)`
- `getOrderByTracking(trackingNumber)`

**Usage:**
```javascript
import { getOrders, createOrder } from '@/services/orderService';
```

### Hooks (`/hooks/`)

#### `useApi.js`
Generic hook for API calls:
- Manages loading, error, data states
- Executes async API functions

**Usage:**
```javascript
const { data, loading, error, execute } = useApi(getOrders);
await execute();
```

#### `useAuth.js`
Authentication management:
- Access current user
- Check authentication status
- Login/logout functions

**Usage:**
```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

#### `useForm.js`
Form state management:
- Form values, errors, touched state
- Handlers for input, blur, submit
- Field-level setters
- Form reset capability

**Usage:**
```javascript
const { values, errors, handleChange, handleSubmit } = useForm(
  { email: '', password: '' },
  onSubmit
);
```

### Utilities (`/utils/`)

#### `formatters.js`
- `formatDate(date)` - Date formatting
- `formatDateTime(date)` - Date and time formatting
- `formatTime(date)` - Time only formatting
- `formatCurrency(amount)` - Currency formatting
- `formatPhoneNumber(phone)` - Phone formatting
- `formatName(firstName, lastName)` - Name formatting
- `capitalize(str)` - String capitalization
- `toSlug(str)` - URL slug generation

**Usage:**
```javascript
import { formatDate, formatCurrency } from '@/utils/formatters';
```

#### `validators.js`
- `isValidEmail(email)` - Email validation
- `isValidPhone(phone)` - Phone validation
- `isStrongPassword(password)` - Password strength check
- `isValidURL(url)` - URL validation
- `isValidNumber(value)` - Number validation
- `isValidPostalCode(code)` - Postal code validation
- `isValidCreditCard(cardNumber)` - Credit card validation
- `isRequired(value)` - Required field validation
- `minLength(value, min)` - Minimum length validation
- `maxLength(value, max)` - Maximum length validation

**Usage:**
```javascript
import { isValidEmail, isStrongPassword } from '@/utils/validators';
```

### Types (`/types/index.js`)
JSDoc type definitions for:
- `User` - User model
- `Order` - Order model
- `Appointment` - Appointment model
- `APIResponse` - API response format
- `LoginRequest` - Login request
- `RegisterRequest` - Registration request

**Usage:**
```javascript
/**
 * @param {User} user
 * @returns {void}
 */
function displayUser(user) {}
```

### Styles (`/styles/components.module.css`)
CSS modules for:
- Button styles (primary, secondary, danger)
- Card styles
- Form styles (inputs, labels, validation)
- Table styles
- Alert styles (success, error, warning, info)

**Usage:**
```javascript
import styles from '@/styles/components.module.css';
<button className={styles.buttonPrimary}>Click me</button>
```

---

## 🔧 How to Use This Structure

### Example: Adding a New Feature

#### 1. Create API Service
**File:** `/services/productService.js`
```javascript
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants';

export const getProducts = () => 
  apiClient.get('/api/products');
```

#### 2. Update Constants
**File:** `/constants/index.js`
```javascript
export const API_ENDPOINTS = {
  PRODUCTS: {
    LIST: '/api/products',
    GET: (id) => `/api/products/${id}`,
  },
};
```

#### 3. Create Custom Hook
**File:** `/hooks/useProducts.js`
```javascript
'use client';
import { useApi } from './useApi';
import { getProducts } from '@/services/productService';

export const useProducts = () => {
  return useApi(getProducts);
};
```

#### 4. Use in Component
```javascript
'use client';
import { useProducts } from '@/hooks/useProducts';

export default function ProductsList() {
  const { data: products, loading, error, execute } = useProducts();

  return (
    <div>
      {/* Render products */}
    </div>
  );
}
```

---

## 📊 File Import Patterns

### Import from Root (`@/`)
```javascript
import { ROLES } from '@/constants';
import { useForm } from '@/hooks/useForm';
import { formatDate } from '@/utils/formatters';
import apiClient from '@/services/apiClient';
import styles from '@/styles/components.module.css';
```

### Next.js Configuration
The `@/` alias is configured in `jsconfig.json` or `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 🎨 Component Organization Checklist

When creating new components, follow this pattern:

```javascript
'use client'; // If using client-side features

// External imports
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Project imports
import { useForm } from '@/hooks/useForm';
import { getOrders } from '@/services/orderService';
import { formatDate } from '@/utils/formatters';
import { ORDER_STATUS } from '@/constants';
import styles from '@/styles/components.module.css';

export default function MyComponent() {
  // Component logic
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

---

## 🔄 Migration Guide

### For Existing Components
1. Move components to proper folders in `/components`
2. Replace hardcoded values with constants from `/constants`
3. Extract data fetching to `/services`
4. Move validation logic to `/utils/validators.js`
5. Move formatting logic to `/utils/formatters.js`

### For API Integration
1. Create service files in `/services`
2. Update `.env.local` with API URLs
3. Use service functions in components via hooks
4. Handle errors and loading states with `useApi` hook

---

## ✨ Benefits of This Structure

| Benefit | Description |
|---------|-------------|
| **Scalability** | Easy to add new features without cluttering existing code |
| **Maintainability** | Clear organization makes code easier to find and modify |
| **Reusability** | Shared services, hooks, and utilities prevent code duplication |
| **Testability** | Separated concerns (services, utils, components) are easier to test |
| **Type Safety** | JSDoc types provide IDE autocomplete and type checking |
| **Performance** | Proper code organization enables better code splitting |
| **Collaboration** | Team members can work on features independently |
| **Best Practices** | Follows industry standards and Next.js recommendations |

---

## 📝 Next Tasks

1. **Populate Services** - Create services for all API endpoints
2. **Create Tests** - Add unit and integration tests
3. **Add More Hooks** - Create `useFetch`, `useLocalStorage`, etc.
4. **Backend Integration** - Connect frontend to backend API
5. **Setup CI/CD** - Configure automated testing and deployment
6. **Documentation** - Add API documentation
7. **Error Handling** - Implement global error boundary

---

## 🆘 Quick Reference

| Need | Location |
|------|----------|
| **Constants & Config** | `/constants/index.js` |
| **API Calls** | `/services/*.js` |
| **Custom Hooks** | `/hooks/use*.js` |
| **Formatting Functions** | `/utils/formatters.js` |
| **Validation Functions** | `/utils/validators.js` |
| **Type Definitions** | `/types/index.js` |
| **Component Styles** | `/styles/components.module.css` |
| **Reusable Components** | `/components/common/*.js` |
| **Role-based Components** | `/components/{admin,customer,staff}/*.js` |

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Best Practices](https://react.dev/learn)
- [Project Structure Guide](./FILE_STRUCTURE.md)
- [API Documentation](./API.md) (To be created)

---

**Last Updated:** 2024  
**Status:** ✅ Structure Ready for Development