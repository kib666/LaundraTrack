'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader } from 'lucide-react';
import EditOrderForm from '@/components/admin/EditOrderForm';

export default function EditOrderPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/orders/${id}`);
          if (response.ok) {
            const data = await response.json();
            setOrder(data);
          } else {
            setError('Failed to fetch order details.');
          }
        } catch (err) {
          setError('An error occurred while fetching order details.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id]);

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.refresh();
        router.push('/admin/orders');
      } else {
        const errorData = await response.json();
        console.error('Failed to update order:', errorData.error);
        alert(`Failed to update order: ${errorData.error}`);
      }
    } catch (err) {
      console.error('An error occurred while updating the order:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/admin/orders');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-8">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center mb-6">
        <button onClick={handleCancel} className="mr-4 p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Edit Order: {order.id}</h2>
      </div>
      <div className="max-w-xl mx-auto">
        <EditOrderForm order={order} onSubmit={handleFormSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
} 