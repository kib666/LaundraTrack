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
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 p-3 rounded-lg">
        {icon}
      </div>
    </div>
    {change && (
      <div
        className={`mt-3 text-sm flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}
      >
        <span className="font-semibold">{change}</span>
        <span className="ml-1 text-gray-500">vs last month</span>
      </div>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-gray-900 mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium text-sm">
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
  const [timeFilter, setTimeFilter] = useState('month'); // 'day', 'week', 'month'

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
          } catch {
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
    if (!orders.length) return { chartData: [], totalRevenue: 0, totalOrders: 0, newCustomers: 0 };

    const chartDataMap = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      let key;

      if (timeFilter === 'day') {
        // Format: "Mon, Jan 15"
        key = orderDate.toLocaleString('default', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
      } else if (timeFilter === 'week') {
        // Get week number and year
        const weekStart = new Date(orderDate);
        weekStart.setDate(orderDate.getDate() - orderDate.getDay());
        key = `Week ${Math.ceil((orderDate.getDate() - orderDate.getDay() + 1) / 7)}, ${orderDate.toLocaleString('default', { month: 'short' })}`;
      } else {
        // Month view
        key = orderDate.toLocaleString('default', {
          month: 'short',
          year: '2-digit',
        });
      }

      if (!chartDataMap[key]) {
        chartDataMap[key] = { name: key, Revenue: 0, Orders: 0 };
      }
      chartDataMap[key].Revenue += order.total;
      chartDataMap[key].Orders += 1;
    });

    const chartData = Object.values(chartDataMap).sort((a, b) => {
      if (timeFilter === 'day') {
        return new Date(a.name) - new Date(b.name);
      }
      return 0;
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;

    const thisMonth = new Date().getMonth();
    const newCustomers = users.filter(
      (user) => new Date(user.createdAt).getMonth() === thisMonth
    ).length;

    return { chartData, totalRevenue, totalOrders, newCustomers };
  };

  const { chartData, totalRevenue, totalOrders, newCustomers } = processData();

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your business metrics and performance</p>
      </div>
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
        <div className="bg-white p-8 rounded-lg shadow-sm border col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Revenue & Orders Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Track your business performance</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeFilter('day')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeFilter === 'day'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setTimeFilter('week')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeFilter === 'week'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeFilter('month')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeFilter === 'month'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#3b82f6"
                style={{ fontSize: '12px' }}
                label={{ value: 'Revenue (₱)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#10b981"
                style={{ fontSize: '12px' }}
                label={{ value: 'Orders', angle: 90, position: 'insideRight' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar
                yAxisId="left"
                dataKey="Revenue"
                fill="#3b82f6"
                name="Revenue (₱)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="Orders"
                fill="#10b981"
                name="Number of Orders"
                radius={[8, 8, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
