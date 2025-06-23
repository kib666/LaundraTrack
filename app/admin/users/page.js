'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Loader, AlertTriangle } from 'lucide-react';
import Modal from '@/components/common/Modal';
import UserForm from '@/components/admin/UserForm';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch users');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormSubmit = async (userData) => {
    const isEditing = !!selectedUser;
    const url = isEditing ? `/api/users/${selectedUser.id}` : '/api/users';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setSelectedUser(null);
        await fetchUsers();
      } else {
        const errorData = await response.json();
        console.error('Failed to save user:', errorData.error);
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to save user:', error);
      alert('An unexpected error occurred.');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, { method: 'DELETE' });
      if (response.ok) {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        await fetchUsers();
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 h-full">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="mr-2" /> Users Management
          </h2>
          <button
            onClick={handleAddNew}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add User</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-4">
                      <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => openDeleteModal(user)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedUser(null); }} title={selectedUser ? 'Edit User' : 'Add New User'}>
        <UserForm user={selectedUser} onSubmit={handleFormSubmit} onCancel={() => { setIsModalOpen(false); setSelectedUser(null); }} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
            <p className="text-gray-600 mb-6">
                You are about to delete the user <span className="font-bold">{selectedUser?.name}</span>. This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-6 py-2 text-gray-700 border rounded-lg hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDeleteConfirm}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Delete
                </button>
            </div>
        </div>
      </Modal>
    </>
  );
} 