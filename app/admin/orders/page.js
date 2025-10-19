'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Loader, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import OrdersTable from '@/components/admin/OrdersTable';
import Modal from '@/components/common/Modal';
import OrderForm from '@/components/admin/OrderForm';

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const fetchOrders = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        const headers = session?.user?.token
          ? { Authorization: `Bearer ${session.user.token}` }
          : {};

        const response = await fetch('/api/orders', { headers });

        if (!response.ok) {
          console.error('Failed to fetch orders:', response.status);
          setOrders([]);
          return;
        }

        const data = await response.json();
        const ordersList = data.orders || data;
        setOrders(Array.isArray(ordersList) ? ordersList : []);
      } catch (error) {
        console.error('An error occurred while fetching orders:', error);
        setOrders([]);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [session?.user?.token]
  );

  useEffect(() => {
    if (session?.user?.token) {
      fetchOrders();

      // Auto-refresh orders every 15 seconds for real-time updates (silent, no loading state)
      const POLL_INTERVAL_MS = 15000;
      const pollingInterval = setInterval(() => {
        fetchOrders(false);
      }, POLL_INTERVAL_MS);

      return () => clearInterval(pollingInterval);
    }
  }, [fetchOrders, session?.user?.token]);

  const handleDateUpdate = async (orderId, newEta) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify({ deliveryDate: newEta }),
      });

      if (response.ok) {
        await fetchOrders();
      } else {
        console.error('Failed to update order delivery date');
        alert('Failed to update order delivery date');
      }
    } catch (error) {
      console.error('Error updating order delivery date:', error);
      alert('Error updating order delivery date');
    }
  };

  const handleCreateOrder = async (formData) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setOrderSuccess(true);
        setTimeout(() => setOrderSuccess(false), 3000);
        await fetchOrders();
      } else {
        const errorData = await response.json();
        console.error('Failed to create order:', errorData.error || response.statusText);
        alert(`Error: ${errorData.message || 'Failed to create order'}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
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
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Order</span>
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border">
        <OrdersTable orders={orders} onDateUpdate={handleDateUpdate} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Order">
        <OrderForm onSubmit={handleCreateOrder} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      {orderSuccess && (
        <Modal isOpen={orderSuccess} onClose={() => setOrderSuccess(false)} title="Success">
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold mb-2">Order Created Successfully!</h3>
            <p className="text-gray-600 mb-4">The new order has been added to the system.</p>
            <button
              onClick={() => setOrderSuccess(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
