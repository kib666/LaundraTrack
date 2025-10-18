// Export all lib utilities for easy importing
// Usage: import { formatDate, isValidEmail, ROLES } from '@/lib';

// Constants
export * from './constants';

// Formatters
export {
  formatDate,
  formatDateTime,
  formatTime,
  formatCurrency,
  formatPhoneNumber,
  formatName,
  capitalize,
  toSlug,
} from './formatters';

// Validators
export {
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  isValidURL,
  isValidNumber,
  isValidPostalCode,
  isValidCreditCard,
  isRequired,
  minLength,
  maxLength,
} from './validators';

// API Services
export { default as apiClient } from './api/apiClient';
export * from './api/authService';
export * from './api/orderService';

// Auth
export * from './auth/jwt';
export * from './auth/middleware';

// Database
export * from './db/mongodb';
export * from './db/models';
