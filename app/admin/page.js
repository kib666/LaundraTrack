'use client';

import React, { useState, useEffect } from 'react';
import {
  Package, Plus, CheckCircle, Loader, Clock, Truck, TrendingUp
} from 'lucide-react';

// Import components
import OrdersTable from '@/components/admin/OrdersTable';
import Modal from '@/components/common/Modal';
import OrderForm from '@/components/admin/OrderForm';

const DashboardStats = ({ orders }) => {
    const stats = [
        { title: 'Pending Tasks', value: orders.filter(o => o.status === 'PENDING').length, icon: Clock, color: 'bg-yellow-500' },
        { title: 'In Progress', value: orders.filter(o => o.status === 'IN_PROGRESS').length, icon: Package, color: 'bg-blue-500' },
        { title: 'Ready for Delivery', value: orders.filter(o => o.status === 'COMPLETED').length, icon: Truck, color: 'bg-green-500' },
        { title: "Today's Revenue", value: `₱${orders.reduce((sum, order) => {
            const orderDate = new Date(order.createdAt);
            const today = new Date();
            if (orderDate.getDate() === today.getDate() && orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear()) {
                return sum + order.total;
            }
            return sum;
        }, 0).toFixed(2)}`, icon: TrendingUp, color: 'bg-purple-500' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                        <stat.icon className="text-white" size={24} />
                    </div>
                </div>
            ))}
        </div>
    );
};

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
