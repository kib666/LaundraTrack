// Application Constants
export const APP_NAME = 'LaudraTrack';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const API_TIMEOUT = 30000;

// Role Constants
export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  READY_FOR_PICKUP: 'ready_for_pickup',
  PICKED_UP: 'picked_up',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Routes
export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_CALENDAR: '/admin/calendar',
  ADMIN_REPORTS: '/admin/reports',
  CUSTOMER: '/customer',
  STAFF: '/staff',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  ORDERS: {
    LIST: '/api/orders',
    CREATE: '/api/orders',
    GET: (id) => `/api/orders/${id}`,
    UPDATE: (id) => `/api/orders/${id}`,
    DELETE: (id) => `/api/orders/${id}`,
  },
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    GET: (id) => `/api/users/${id}`,
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`,
  },
};