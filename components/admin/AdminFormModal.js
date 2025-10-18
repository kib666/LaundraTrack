'use client';

import React, { useState, useEffect } from 'react';

export default function AdminFormModal({ admin, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        firstName: admin.firstName || admin.name?.split(' ')[0] || '',
        lastName: admin.lastName || admin.name?.split(' ').slice(1).join(' ') || '',
        email: admin.email || '',
        phone: admin.phone || admin.phoneNumber || '',
        password: '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-gray-900"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-gray-900"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number {!admin && '(optional)'}
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password {admin ? '(leave blank to keep current password)' : ''}
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg text-gray-900"
          required={!admin}
        />
      </div>
      <div className="flex space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          {admin ? 'Update Admin' : 'Create Admin'}
        </button>
      </div>
    </form>
  );
}
