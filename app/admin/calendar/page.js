'use client';

import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import OrderCalendarView from '@/components/admin/OrderCalendarView';

export default function CalendarPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch orders');
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrderCalendarView orders={orders} />
    </div>
  );
} 