'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader, AlertTriangle, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Modal from '@/components/common/Modal';
import AdminFormModal from '@/components/admin/AdminFormModal';

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Check if user is authenticated and is superadmin
  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/superadmin-login?error=superadmin_access_required';
    }
  }, [status]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/superadmin/admins', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const adminsList = data.admins || data;
        setAdmins(Array.isArray(adminsList) ? adminsList : []);
      } else if (response.status === 401 || response.status === 403) {
        console.error('Unauthorized - superadmin access required');
        window.location.href = '/superadmin-login?error=unauthorized';
      } else {
        console.error('Failed to fetch admins');
        setAdmins([]);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      fetchAdmins();
    }
  }, [session?.user?.token]);

  const handleFormSubmit = async (adminData) => {
    const isEditing = !!selectedAdmin;
    const url = isEditing
      ? `/api/superadmin/admins/${selectedAdmin._id}`
      : '/api/superadmin/admins';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify(adminData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setSelectedAdmin(null);
        await fetchAdmins();
      } else {
        const errorData = await response.json();
        console.error('Failed to save admin:', errorData.error || errorData.message);
        alert(`Error: ${errorData.error || errorData.message}`);
      }
    } catch (error) {
      console.error('Failed to save admin:', error);
      alert('An unexpected error occurred.');
    }
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAdmin(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAdmin) return;
    try {
      const response = await fetch(`/api/superadmin/admins/${selectedAdmin._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      if (response.ok) {
        setIsDeleteModalOpen(false);
        setSelectedAdmin(null);
        await fetchAdmins();
      } else {
        console.error('Failed to delete admin');
        alert('Failed to delete admin');
      }
    } catch (error) {
      console.error('Failed to delete admin:', error);
      alert('An error occurred while deleting admin');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center p-8 h-full">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  // Check if user is superadmin
  if (status === 'authenticated' && session?.user?.role !== 'superadmin') {
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
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Admin</span>
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
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created Date
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
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {admin.firstName} {admin.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2 items-center">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(admin)}
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
                    No admins found
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
          setSelectedAdmin(null);
        }}
        title={selectedAdmin ? 'Edit Admin' : 'Add New Admin'}
      >
        <AdminFormModal
          admin={selectedAdmin}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedAdmin(null);
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
            You are about to delete the admin{' '}
            <span className="font-bold">
              {selectedAdmin?.firstName} {selectedAdmin?.lastName}
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
