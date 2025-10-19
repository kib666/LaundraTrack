'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Loader } from 'lucide-react';
import OrderCalendarView from '@/components/admin/OrderCalendarView';

export default function CalendarPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollerRef = useRef(null);

  const fetchOrders = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        const headers = session?.user?.token
          ? { Authorization: `Bearer ${session.user.token}` }
          : {};
        const response = await fetch('/api/orders?limit=200', { headers });

        if (!response.ok) {
          console.error('Failed to fetch orders:', await response.text());
          setOrders([]);
          return;
        }

        const data = await response.json();
        const ordersList = data.orders || data;
        setOrders(Array.isArray(ordersList) ? ordersList : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [session?.user?.token]
  );

  useEffect(() => {
    if (!session?.user?.token) {
      return;
    }

    fetchOrders();
  }, [fetchOrders, session?.user?.token]);

  // Auto-polling for calendar updates (silent, no loading state)
  useEffect(() => {
    if (!session?.user?.token) {
      return;
    }

    const POLL_INTERVAL_MS = 15000;

    pollerRef.current = setInterval(() => {
      fetchOrders(false);
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
    };
  }, [fetchOrders, session?.user?.token]);

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
