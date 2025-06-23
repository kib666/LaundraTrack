'use client';

import React, { useState, useEffect } from 'react';

export default function OrderForm({ onSubmit, onCancel }) {
  const [customerType, setCustomerType] = useState('new');
  const [existingCustomers, setExistingCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    service: 'Wash & Fold',
    weight: '',
    deliveryAddress: '',
    finishDate: '',
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/users?role=CUSTOMER');
        if (response.ok) {
          const data = await response.json();
          setExistingCustomers(data);
        } else {
          console.error('Failed to fetch customers');
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      customerType,
      userId: selectedCustomer,
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-gray-800">
            <input
              type="radio"
              name="customerType"
              value="new"
              checked={customerType === 'new'}
              onChange={(e) => setCustomerType(e.target.value)}
              className="mr-2"
            />
            New Customer
          </label>
          <label className="flex items-center text-gray-800">
            <input
              type="radio"
              name="customerType"
              value="existing"
              checked={customerType === 'existing'}
              onChange={(e) => setCustomerType(e.target.value)}
              className="mr-2"
            />
            Existing Customer
          </label>
        </div>
      </div>

      {customerType === 'new' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-gray-900"
              required={customerType === 'new'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-gray-900"
              required={customerType === 'new'}
            />
          </div>
        </>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
          <select
            name="customer"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full p-2 border rounded-lg text-gray-900"
            required={customerType === 'existing'}
          >
            <option value="">-- Select a customer --</option>
            {existingCustomers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.email}
              </option>
            ))}
          </select>
        </div>
      )}

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
        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-gray-900"
          step="0.1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Finish Date</label>
        <input
          type="date"
          name="finishDate"
          value={formData.finishDate}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-gray-900"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
        <textarea
          name="deliveryAddress"
          value={formData.deliveryAddress}
          onChange={handleChange}
          rows="2"
          className="w-full p-2 border rounded-lg text-gray-900"
          placeholder="Enter full delivery address..."
        />
      </div>
      <div className="flex space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Create Order
        </button>
      </div>
    </form>
  );
} 