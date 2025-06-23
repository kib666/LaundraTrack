'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserForm from '@/components/admin/UserForm';
import { ArrowLeft, Loader } from 'lucide-react';

export default function EditUserPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          console.log('Fetching user with ID:', id);
          const response = await fetch(`/api/users/${id}`);
          console.log('Response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Fetched user data:', data);
            setUser(data);
          } else {
            console.error('Failed to fetch user');
            router.push('/admin/users');
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          router.push('/admin/users');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, router]);

  const handleFormSubmit = async (userData) => {
    console.log('Submitting user update:', userData);
    // If password is blank, don't include it in the update
    const { password, ...dataToUpdate } = userData;
    if (password) {
      dataToUpdate.password = password;
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate),
      });

      if (response.ok) {
        router.push('/admin/users');
      } else {
        console.error('Failed to update user:', await response.text());
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleCancel = () => {
    router.push('/admin/users');
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center mb-6">
        <button onClick={handleCancel} className="mr-4 p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Edit User: {user.name}</h2>
      </div>
      <div className="max-w-md mx-auto">
        <UserForm user={user} onSubmit={handleFormSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
} 