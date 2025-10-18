'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Loader, AlertCircle, BarChart, Users, ShoppingBag, DollarSign } from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const StatCard = ({ title, value, icon, change, changeType }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">{icon}</div>
    </div>
    {change && (
      <div
        className={`mt-2 text-xs flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}
      >
        {change} vs last month
      </div>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded-lg shadow-sm">
        <p className="font-semibold">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {`${p.name}: ${p.name === 'Revenue' ? `₱${Number(p.value || 0).toFixed(2)}` : p.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (status === 'loading') {
      return;
    }

    if (status !== 'authenticated') {
      setLoading(false);
      setOrders([]);
      setUsers([]);
      setError(status === 'unauthenticated' ? 'You must be logged in to view reports.' : null);
      return;
    }

    if (!session?.user?.token) {
      setLoading(false);
      setError('Missing authentication token. Please sign out and back in.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const headers = { Authorization: `Bearer ${session.user.token}` };
      const requestOptions = { headers, credentials: 'include', cache: 'no-store' };

      const [ordersRes, usersRes] = await Promise.all([
        fetch('/api/orders?limit=200', requestOptions),
        fetch('/api/admin/users?limit=200', requestOptions),
      ]);

      if (!ordersRes.ok || !usersRes.ok) {
        const rawOrdersError = !ordersRes.ok ? await ordersRes.text() : '';
        const rawUsersError = !usersRes.ok ? await usersRes.text() : '';

        const interpretError = (rawMessage, fallback) => {
          if (!rawMessage) return '';
          const trimmed = rawMessage.trim();
          if (!trimmed) return '';
          if (trimmed.startsWith('<!DOCTYPE html')) return fallback;
          try {
            const parsed = JSON.parse(trimmed);
            return parsed?.message || parsed?.error || trimmed;
          } catch (parseErr) {
            return trimmed;
          }
        };

        const ordersError = interpretError(
          rawOrdersError,
          'Orders endpoint returned an unexpected response.'
        );
        const usersError = interpretError(
          rawUsersError,
          'Users endpoint returned an unexpected response.'
        );

        throw new Error(ordersError || usersError || 'Failed to fetch data');
      }

      const ordersPayload = await ordersRes.json();
      const usersPayload = await usersRes.json();

      const parsedOrders = Array.isArray(ordersPayload)
        ? ordersPayload
        : Array.isArray(ordersPayload.orders)
          ? ordersPayload.orders
          : Array.isArray(ordersPayload.data)
            ? ordersPayload.data
            : Array.isArray(ordersPayload.results)
              ? ordersPayload.results
              : [];
      const parsedUsers = Array.isArray(usersPayload?.users)
        ? usersPayload.users
        : Array.isArray(usersPayload?.data)
          ? usersPayload.data
          : Array.isArray(usersPayload)
            ? usersPayload
            : [];

      setOrders(parsedOrders);
      setUsers(parsedUsers);
    } catch (err) {
      console.error('Reports fetch error:', err);
      setError(err.message || 'Failed to fetch data');
      setOrders([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.token, status]);

  useEffect(() => {
    if (status === 'loading') return;
    fetchData();
  }, [fetchData, status]);

  // Process data for charts and stats
  const processData = () => {
    if (!orders.length)
      return { monthlyData: [], totalRevenue: 0, totalOrders: 0, newCustomers: 0 };

    const monthlyData = {};

    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString('default', {
        month: 'short',
        year: '2-digit',
      });
      if (!monthlyData[month]) {
        monthlyData[month] = { name: month, Revenue: 0, Orders: 0 };
      }
      monthlyData[month].Revenue += order.total;
      monthlyData[month].Orders += 1;
    });

    const sortedMonthlyData = Object.values(monthlyData).sort(
      (a, b) => new Date(a.name) - new Date(b.name)
    );

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;

    const thisMonth = new Date().getMonth();
    const newCustomers = users.filter(
      (user) => new Date(user.createdAt).getMonth() === thisMonth
    ).length;

    return { monthlyData: sortedMonthlyData, totalRevenue, totalOrders, newCustomers };
  };

  const { monthlyData, totalRevenue, totalOrders, newCustomers } = processData();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 h-full">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center p-8 h-full bg-red-50 text-red-700 rounded-lg">
        <AlertCircle className="mb-2" size={48} />
        <p className="font-semibold">Error loading reports</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₱${totalRevenue.toFixed(2)}`}
          icon={<DollarSign size={24} />}
        />
        <StatCard title="Total Orders" value={totalOrders} icon={<ShoppingBag size={24} />} />
        <StatCard
          title="New Customers (This Month)"
          value={newCustomers}
          icon={<Users size={24} />}
        />
        <StatCard
          title="Avg. Order Value"
          value={`₱${(totalRevenue / totalOrders || 0).toFixed(2)}`}
          icon={<BarChart size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border col-span-1 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Revenue & Orders Overview</h2>
          <ResponsiveContainer width="100%" height={350}>
            <RechartsBarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#8884d8"
                label={{ value: 'Revenue (₱)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#82ca9d"
                label={{ value: 'Orders', angle: -90, position: 'insideRight' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="Revenue" fill="#8884d8" name="Revenue (₱)" />
              <Bar yAxisId="right" dataKey="Orders" fill="#82ca9d" name="Number of Orders" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
