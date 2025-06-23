'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Loader } from 'lucide-react';
import OrdersTable from '@/components/admin/OrdersTable';
import Modal from '@/components/common/Modal';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <Package className="mr-2" /> All Orders
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Order</span>
          </button>
        </div>
        <OrdersTable orders={orders} onStatusUpdate={handleStatusUpdate} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Order">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input type="text" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input type="number" step="0.1" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Wash & Fold</option>
              <option>Dry Clean</option>
              <option>Wash & Iron</option>
              <option>Express Service</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
            <input type="datetime-local" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <textarea rows="2" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter full delivery address..." />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Create Order
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
} 