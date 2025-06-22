'use client';

import React, { useState, useEffect } from 'react';

export default function UserForm({ user, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STAFF',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
      });
    } else {
      setFormData({ name: '', email: '', role: 'STAFF', password: '' });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
          <option value="CUSTOMER">Customer</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password {user ? '(leave blank to keep current password)' : ''}
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required={!user}
        />
      </div>
      <div className="flex space-x-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 text-gray-600 border rounded-lg">
          Cancel
        </button>
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg">
          {user ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
} 