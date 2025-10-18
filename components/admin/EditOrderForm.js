'use client';

import React, { useState, useEffect } from 'react';

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export default function EditOrderForm({ order, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    service: 'Wash & Fold',
    weight: '',
    deliveryAddress: '',
    status: 'PENDING',
    eta: '',
    total: '',
  });

  useEffect(() => {
    if (order) {
      // Map database status (lowercase) to UI status (uppercase)
      const statusMap = {
        pending: 'PENDING',
        confirmed: 'PENDING', // Treat confirmed as PENDING for UI
        in_progress: 'IN_PROGRESS',
        ready_for_pickup: 'COMPLETED',
        picked_up: 'COMPLETED',
        delivered: 'DELIVERED',
        cancelled: 'CANCELLED',
      };
      const uiStatus = statusMap[order.status] || 'PENDING';
      setFormData({
        customerName: order.user?.name || 'Walk-in Customer',
        customerPhone: order.user?.phoneNumber || '',
        service: order.service || 'Wash & Fold',
        weight: order.weight?.toString() || '',
        deliveryAddress: order.deliveryAddress || '',
        status: uiStatus,
        eta: formatDateForInput(order.eta),
        total: order.total?.toString() || '',
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normalize status to lowercase for database
    const statusMap = {
      PENDING: 'pending',
      IN_PROGRESS: 'in_progress',
      COMPLETED: 'ready_for_pickup',
      DELIVERED: 'delivered',
      CANCELLED: 'cancelled',
    };
    const submissionData = {
      ...formData,
      status: statusMap[formData.status] || formData.status.toLowerCase(),
      weight: parseFloat(formData.weight) || 0,
      total: parseFloat(formData.total) || 0,
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            className="w-full p-2 border rounded-lg text-gray-900 bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            name="customerPhone"
            value={formData.customerPhone}
            className="w-full p-2 border rounded-lg text-gray-900 bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-gray-900"
          >
            <option>Wash & Fold</option>
            <option>Dry Clean</option>
            <option>Wash & Iron</option>
            <option>Express Service</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-gray-900"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Ready</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-gray-900"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total (₱)</label>
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-gray-900"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Finish Date</label>
          <input
            type="date"
            name="eta"
            value={formData.eta}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-gray-900"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
        <textarea
          name="deliveryAddress"
          value={formData.deliveryAddress}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border rounded-lg text-gray-900"
        />
      </div>
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Update Order
        </button>
      </div>
    </form>
  );
}
