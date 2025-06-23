'use client';

import React, { useState, useEffect } from 'react';
import {
  Package, Plus, CheckCircle, Loader
} from 'lucide-react';

// Import components
import DashboardStats from '@/components/admin/DashboardStats';
import OrdersTable from '@/components/admin/OrdersTable';
import Modal from '@/components/common/Modal';
import OrderForm from '@/components/admin/OrderForm';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersRes = await fetch('/api/orders');

      if (!ordersRes.ok) {
        console.error('Failed to fetch orders:', await ordersRes.text());
      }
      
      const ordersData = ordersRes.ok ? await ordersRes.json() : [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
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
        setIsOrderModalOpen(false);
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
      <div>
        <DashboardStats orders={orders} />
        <div className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Order</span>
            </button>
          </div>
          <OrdersTable orders={orders} onStatusUpdate={handleStatusUpdate} />
        </div>
      </div>

      <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title="Add New Order">
        <OrderForm onSubmit={handleCreateOrder} onCancel={() => setIsOrderModalOpen(false)} />
      </Modal>
      
      {orderSuccess && (
        <Modal isOpen={orderSuccess} onClose={() => setOrderSuccess(false)} title="Success">
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold mb-2">Order Created Successfully!</h3>
            <p className="text-gray-600 mb-4">The order has been added to the system.</p>
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
