import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

// Login
export const login = (email, password) =>
  apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });

// Register
export const register = (userData) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);

// Logout
export const logout = () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);

// Get current user
export const getCurrentUser = () => apiClient.get('/api/auth/me');

// Refresh token
export const refreshToken = () => apiClient.post('/api/auth/refresh');
