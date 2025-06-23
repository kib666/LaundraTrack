'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, Edit, Trash2, Loader } from 'lucide-react';
import Modal from '@/components/common/Modal';
import UserForm from '@/components/admin/UserForm';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch users:', errorData.error || response.statusText);
        setUsers([]); // Ensure users is always an array, even on error
        return;
      }
      
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('An error occurred while fetching users:', error);
      setUsers([]); // Also protect against network errors or other exceptions
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormSubmit = async (userData) => {
    // This form is now only for creating users
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchUsers();
      } else {
        console.error('Failed to save user:', await response.text());
      }
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleEdit = (user) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        if (response.ok) {
          fetchUsers();
        } else {
          console.error('Failed to delete user:', await response.text());
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="mr-2" /> Users List
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-4">
                      <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New User">
        <UserForm user={null} onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
} 