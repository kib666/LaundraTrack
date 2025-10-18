# 🤝 Contributing Guidelines

Standards, conventions, and best practices for LaudraTrack development.

---

## 📝 Code Style

### JavaScript/React

- Use functional components, not class components
- Use React hooks for state management
- Use arrow functions
- Use destructuring
- Use const/let, avoid var

### Example

```javascript
// ✅ Good
const MyComponent = ({ title, items }) => {
  const [data, setData] = useState([]);

  const handleClick = () => {
    // Action
  };

  return <div>{/* JSX */}</div>;
};

// ❌ Bad
class MyComponent extends React.Component {
  state = { data: [] };
  handleClick() {}
  render() {
    return <div />;
  }
}
```

### Naming Conventions

| Type        | Convention                    | Example             |
| ----------- | ----------------------------- | ------------------- |
| Components  | PascalCase                    | `OrderForm.js`      |
| Functions   | camelCase                     | `formatDate()`      |
| Constants   | UPPER_SNAKE_CASE              | `ORDER_STATUS`      |
| Hooks       | camelCase starting with "use" | `useAuth()`         |
| Directories | kebab-case or lowercase       | `admin/`, `common/` |

### Comments

```javascript
// Use meaningful comments
const QUERY_TIMEOUT = 30000; // 30 seconds

// ❌ Bad
const x = 30000; // timeout

// ✅ Good
// Calculate delivery estimate based on order size
const estimateDelivery = (orderSize) => {
  return Math.ceil(orderSize / 5) * 24; // hours
};
```

---

## 🗂️ File Organization

### Component Files

```
/components/admin/OrderForm.js
├── Imports
├── Component logic
├── JSX return
└── Export default
```

### Service Files

```
/lib/api/orderService.js
├── Imports
├── Function definitions
├── Export named exports
└── Export default (if main export)
```

### Utilities

```
/lib/formatters.js
├── Import dependencies
├── Define functions
└── Export each function
```

---

## 📦 Imports & Exports

### Using Centralized Exports

```javascript
// ✅ Preferred - from @/lib central hub
import { formatDate, ROLES, apiClient } from '@/lib';

// ✅ Also good - specific file
import { formatDate } from '@/lib/formatters';
import { ROLES } from '@/lib/constants';

// ❌ Avoid - scattered imports
import formatDate from '@/lib/formatters';
import ROLES from '@/lib/constants';
```

### Exporting from Services

```javascript
// ✅ Named exports for utilities
export const formatDate = (date) => {
  /* ... */
};
export const formatCurrency = (amount) => {
  /* ... */
};

// ✅ Default export for services/components
export default OrderService;

// In /lib/index.js, re-export everything
export * from './formatters';
```

---

## 🎨 Component Structure

### Functional Component Template

```javascript
'use client'; // if using hooks

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib';

/**
 * OrderForm Component
 * Handles creation and editing of orders
 * @param {Object} props - Component props
 * @param {string} props.orderId - Order ID (if editing)
 * @param {Function} props.onSave - Callback on save
 */
const OrderForm = ({ orderId, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load data on mount
  }, []);

  const handleSubmit = async (data) => {
    // Handle form submission
  };

  return <form onSubmit={handleSubmit}>{/* Form JSX */}</form>;
};

export default OrderForm;
```

### Hook Pattern

```javascript
// /hooks/useOrderData.js
'use client';

import { useState, useEffect } from 'react';
import { getOrders } from '@/lib';

export const useOrderData = (filters) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrders(filters);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filters]);

  return { orders, loading, error };
};
```

---

## 🧪 Testing Requirements

### Before Committing

```bash
# Lint check
npm run lint

# Type check
npm run type-check

# Manual testing
npm run dev
# Test in browser
```

### Linting Rules

- No unused variables
- No unused imports
- Consistent spacing
- No console.log in production
- Follow ESLint config

---

## 📥 Git Workflow

### Branch Naming

```
feature/order-tracking
bugfix/auth-token-refresh
refactor/component-optimization
docs/update-readme
```

### Commit Messages

```
# ✅ Good
git commit -m "feat: add order filtering to admin dashboard"
git commit -m "fix: resolve JWT token expiration bug"
git commit -m "refactor: consolidate sidebar components"
git commit -m "docs: update deployment guide"

# ❌ Bad
git commit -m "stuff"
git commit -m "fix bug"
git commit -m "changes"
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `perf`

---

## 🔄 Pull Request Process

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Changes**
   - Follow code style
   - Write clear commit messages
   - Run linting: `npm run lint:fix`

3. **Push & Create PR**

   ```bash
   git push origin feature/my-feature
   # Create PR on GitHub
   ```

4. **PR Description**

   ```markdown
   ## Description

   Brief description of changes

   ## Type

   - [ ] Bug fix
   - [ ] Feature
   - [ ] Documentation
   - [ ] Refactoring

   ## Testing

   How was this tested?

   ## Screenshots (if UI change)

   Attach before/after screenshots
   ```

5. **Code Review**
   - Address review comments
   - Re-request review after changes

6. **Merge**
   - Squash commits if needed
   - Delete branch after merge

---

## ✅ Checklist Before Submitting PR

- [ ] Code follows style guide
- [ ] Linting passes: `npm run lint`
- [ ] Type checking passes: `npm run type-check`
- [ ] No console.logs left behind
- [ ] Component tested in dev: `npm run dev`
- [ ] Commit messages are clear
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or documented)

---

## 🚫 Common Mistakes to Avoid

### 1. Don't Hardcode Values

```javascript
// ❌ Bad
const API_URL = 'https://api.example.com';
const JWT_SECRET = 'secret123';

// ✅ Good
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const JWT_SECRET = process.env.JWT_SECRET;
```

### 2. Don't Fetch in Render

```javascript
// ❌ Bad
const Component = () => {
  const [data, setData] = useState(null);
  // Fetching here causes infinite loops
  fetch('/api/data').then((res) => setData(res.data));
  return <div>{data}</div>;
};

// ✅ Good
const Component = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then((res) => setData(res.data));
  }, []);
  return <div>{data}</div>;
};
```

### 3. Don't Props Drill

```javascript
// ❌ Bad - passing props through multiple levels
<Grandparent user={user}>
  <Parent user={user}>
    <Child user={user} />
  </Parent>
</Grandparent>

// ✅ Good - use Context API
<UserContext.Provider value={user}>
  <Grandparent>
    <Parent>
      <Child /> {/* Access via useContext */}
    </Parent>
  </Grandparent>
</UserContext.Provider>
```

### 4. Don't Create Components in Render

```javascript
// ❌ Bad
const MyComponent = () => {
  const Button = () => <button>Click</button>;
  return <Button />;
};

// ✅ Good
const Button = () => <button>Click</button>;
const MyComponent = () => {
  return <Button />;
};
```

### 5. Don't Mutate State Directly

```javascript
// ❌ Bad
state.orders.push(newOrder);
setState(state);

// ✅ Good
setState([...state.orders, newOrder]);
// or
setState((prev) => [...prev, newOrder]);
```

---

## 🎯 Development Workflow

### Starting New Feature

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-feature

# Make changes and test
npm run dev

# Commit changes
git add .
git commit -m "feat: implement my feature"

# Push to GitHub
git push origin feature/my-feature

# Create PR on GitHub
```

### Updating from Main

```bash
# While on feature branch
git fetch origin
git rebase origin/main

# If conflicts
# Resolve manually, then:
git add .
git rebase --continue
git push origin feature/my-branch --force-with-lease
```

---

## 📚 Resources

- [Next.js Best Practices](https://nextjs.org/docs/basic-features/best-practices)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/utility-first)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

## 🆘 Need Help?

- Check existing documentation
- Search GitHub issues
- Ask in team discussions
- Reference ARCHITECTURE.md for system design

---

**Last Updated**: 2024  
**Status**: ✅ Current
