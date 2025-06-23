'use client';

import React, { useState, useEffect } from 'react';

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export default function EditOrderForm({ order, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    customer: '',
    phone: '',
    service: 'Wash & Fold',
    weight: '',
    deliveryAddress: '',
    status: 'Received',
    eta: '',
    total: '',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        customer: order.customer || '',
        phone: order.phone || '',
        service: order.service || 'Wash & Fold',
        weight: order.weight?.toString() || '',
        deliveryAddress: order.deliveryAddress || '',
        status: order.status || 'Received',
        eta: formatDateForInput(order.eta),
        total: order.total?.toString() || '',
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
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
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-gray-900 bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
          <select name="service" value={formData.service} onChange={handleChange} className="w-full p-2 border rounded-lg text-gray-900">
            <option>Wash & Fold</option>
            <option>Dry Clean</option>
            <option>Wash & Iron</option>
            <option>Express Service</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-lg text-gray-900">
            <option>Received</option>
            <option>In Wash</option>
            <option>Ready</option>
            <option>Delivered</option>
            <option>Cancelled</option>
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
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Update Order
        </button>
      </div>
    </form>
  );
} 