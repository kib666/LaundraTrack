import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

// Get all orders
export const getOrders = (params = {}) => apiClient.get(API_ENDPOINTS.ORDERS.LIST, { params });

// Get single order
export const getOrder = (id) => apiClient.get(API_ENDPOINTS.ORDERS.GET(id));

// Create order
export const createOrder = (data) => apiClient.post(API_ENDPOINTS.ORDERS.CREATE, data);

// Update order
export const updateOrder = (id, data) => apiClient.patch(API_ENDPOINTS.ORDERS.UPDATE(id), data);

// Delete order
export const deleteOrder = (id) => apiClient.delete(API_ENDPOINTS.ORDERS.DELETE(id));

// Get order by tracking number
export const getOrderByTracking = (trackingNumber) =>
  apiClient.get(`${API_ENDPOINTS.ORDERS.LIST}/track/${trackingNumber}`);
