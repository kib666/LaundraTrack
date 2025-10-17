'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Loader, CheckCircle } from 'lucide-react';
import OrdersTable from '@/components/admin/OrdersTable';
import Modal from '@/components/common/Modal';
import OrderForm from '@/components/admin/OrderForm';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        console.error('Failed to fetch orders:', await response.text());
        setOrders([]);
        return;
      }
      
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('An error occurred while fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchOrders();
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDateUpdate = async (orderId, newEta) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eta: newEta }),
      });

      if (response.ok) {
        await fetchOrders();
      } else {
        console.error('Failed to update order ETA');
      }
    } catch (error) {
      console.error('Error updating order ETA:', error);
    }
  };

  const handleCreateOrder = async (formData) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setOrderSuccess(true);
        await fetchOrders();
      } else {
        const errorData = await response.json();
        console.error('Failed to create order:', errorData.error || response.statusText);
      }
    } catch (error) {
      console.error('Error creating order:', error);
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
        <OrdersTable orders={orders} onStatusUpdate={handleStatusUpdate} onDateUpdate={handleDateUpdate}/>
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