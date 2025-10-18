'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader, AlertTriangle, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Modal from '@/components/common/Modal';
import UserForm from '@/components/admin/UserForm';

export default function UsersManagementPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Redirect to customer login page
      window.location.href = '/customer?error=admin_access_required';
    }
  }, [status]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const usersList = data.users || data;
        setUsers(Array.isArray(usersList) ? usersList : []);
      } else if (response.status === 401 || response.status === 403) {
        console.error('Unauthorized - admin access required');
        window.location.href = '/customer?error=unauthorized';
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
    if (session?.user?.token) {
      fetchUsers();
    }
  }, [session?.user?.token]);

  const handleFormSubmit = async (userData) => {
    const isEditing = !!selectedUser;
    const url = isEditing ? `/api/admin/users/${selectedUser._id}` : '/api/admin/users';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setSelectedUser(null);
        await fetchUsers();
      } else {
        const errorData = await response.json();
        console.error('Failed to save user:', errorData.error || errorData.message);
        alert(`Error: ${errorData.error || errorData.message}`);
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
      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      if (response.ok) {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        await fetchUsers();
      } else {
        console.error('Failed to delete user');
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('An error occurred while deleting user');
    }
  };

  const handleApprove = async (user) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/admin/users/${user._id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify({ action: 'approve' }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}`);
        await fetchUsers();
      } else {
        const errorData = await response.json();
        console.error('Failed to approve user:', errorData);
        alert(`Error: ${errorData.message || 'Failed to approve user'}`);
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('An error occurred while approving user');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center p-8 h-full">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  // Check if user is admin
  if (status === 'authenticated' && session?.user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center p-8 h-full">
        <div className="text-center">
          <Lock className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddNew}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : user.role === 'staff'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : user.status === 'approved'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2 items-center">
                        {user.status === 'pending' && user.role === 'staff' && (
                          <button
                            onClick={() => handleApprove(user)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-medium"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? 'Edit User' : 'Add New User'}
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="text-center">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
          <p className="text-gray-600 mb-6">
            You are about to delete the user{' '}
            <span className="font-bold">
              {selectedUser?.firstName} {selectedUser?.lastName}
            </span>
            . This action cannot be undone.
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
