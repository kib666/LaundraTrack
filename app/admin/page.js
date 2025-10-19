'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Package,
  Plus,
  CheckCircle,
  Loader,
  Clock,
  Truck,
  TrendingUp,
  CheckSquare,
  Calendar as CalendarIcon,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Modal from '@/components/common/Modal';
import OrderForm from '@/components/admin/OrderForm';

const RechartsResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const RechartsBarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), {
  ssr: false,
});
const RechartsBar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const RechartsPieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), {
  ssr: false,
});
const RechartsPie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false });
const RechartsCell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false });
const RechartsCartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), {
  ssr: false,
});
const RechartsXAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const RechartsYAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const RechartsTooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), {
  ssr: false,
});

const DashboardCard = ({ title, value, icon: IconComponent, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
    <div className={`${color} p-3 rounded-lg`}>
      <IconComponent className="text-white" size={24} />
    </div>
  </div>
);

const RecentOrdersTable = ({ orders }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
        <p className="text-sm text-gray-500">Latest 6 orders from your operation</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pickup Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery ETA
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const customer = order.customerId || {};
              const orderId = order.trackingNumber || order.id || order._id;
              const pickupDate = order.pickupDate || order.createdAt;
              const etaDate = order.deliveryDate || order.eta;

              return (
                <tr key={orderId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{orderId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {typeof customer === 'string'
                      ? 'Walk-in Customer'
                      : `${customer.firstName || ''} ${customer.lastName || ''}`.trim() ||
                        'Walk-in Customer'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {pickupDate ? new Date(pickupDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {etaDate ? new Date(etaDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    ₱{Number(order.totalAmount || order.total || 0).toFixed(2)}
                  </td>
                </tr>
              );
            })}
            {!orders.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                  No recent orders to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TaskBucketList = ({ data }) => {
  const buckets = [
    {
      title: 'Pending Tasks',
      count: data.pending,
      description: 'Orders awaiting processing or assignment',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
    },
    {
      title: 'In Progress',
      count: data.inProgress,
      description: 'Currently being serviced by staff',
      color: 'bg-blue-100 text-blue-800',
      icon: Package,
    },
    {
      title: 'Ready for Delivery',
      count: data.ready,
      description: 'Completed and awaiting delivery or pickup',
      color: 'bg-green-100 text-green-800',
      icon: Truck,
    },
    {
      title: 'Delivered Today',
      count: data.deliveredToday,
      description: 'Orders delivered within the last 24 hours',
      color: 'bg-purple-100 text-purple-800',
      icon: CheckSquare,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Operations Snapshot</h3>
          <p className="text-sm text-gray-500">Monitor the lifecycle of each order bucket</p>
        </div>
        <CalendarIcon className="text-gray-400" size={20} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {buckets.map((bucket) => (
          <div key={bucket.title} className="flex items-start space-x-3">
            <div className={`${bucket.color} rounded-lg p-2`} aria-label={`${bucket.title} icon}`}>
              <bucket.icon size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">{bucket.title}</h4>
              <p className="text-2xl font-bold text-gray-900">{bucket.count}</p>
              <p className="text-xs text-gray-500 mt-1">{bucket.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RevenueBreakdown = ({ weeklyData, monthlyTotal }) => {
  const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#a855f7'];

  const pieData = weeklyData.map((entry) => ({ name: entry.name, value: entry.total }));

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Breakdown</h3>
      <p className="text-sm text-gray-500 mb-6">
        Weekly contribution to the current monthly total of ₱{monthlyTotal.toFixed(2)}
      </p>
      <div className="h-64">
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <RechartsPie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={4}
            >
              {pieData.map((entry, index) => (
                <RechartsCell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </RechartsPie>
            <RechartsTooltip
              formatter={(value) => `₱${Number(value).toFixed(2)}`}
              labelFormatter={(label) => `${label}`}
            />
          </RechartsPieChart>
        </RechartsResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {pieData.map((entry, index) => (
          <div key={entry.name} className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{entry.name}</span>
            </div>
            <span className="font-semibold text-gray-900">₱{Number(entry.value).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrendBarChart = ({ data }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Weekly Order Volume</h3>
        <p className="text-sm text-gray-500">Track how busy your operation is week over week</p>
      </div>
      <Package className="text-gray-400" size={20} />
    </div>
    <div className="h-64">
      <RechartsResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <RechartsCartesianGrid strokeDasharray="3 3" />
          <RechartsXAxis dataKey="name" />
          <RechartsYAxis />
          <RechartsTooltip />
          <RechartsBar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </RechartsResponsiveContainer>
    </div>
  </div>
);

const computeDashboardMetrics = (orders) => {
  const now = new Date();
  const todayMetrics = {
    revenue: 0,
    pending: 0,
    inProgress: 0,
    ready: 0,
    deliveredToday: 0,
  };

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const weeklyBuckets = new Map();

  orders.forEach((order) => {
    const createdDate = new Date(order.createdAt);
    const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate) : null;
    const status = order.status;

    if (
      createdDate.getDate() === now.getDate() &&
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    ) {
      todayMetrics.revenue += Number(order.totalAmount || order.total || 0);
    }

    if (status === 'PENDING') todayMetrics.pending += 1;
    if (status === 'IN_PROGRESS') todayMetrics.inProgress += 1;
    if (status === 'COMPLETED') todayMetrics.ready += 1;
    if (status === 'DELIVERED' && deliveryDate) {
      const diffMs = now - deliveryDate;
      if (diffMs >= 0 && diffMs <= 1000 * 60 * 60 * 24) {
        todayMetrics.deliveredToday += 1;
      }
    }

    const startOfWeek = new Date(createdDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekKey = startOfWeek.getTime();

    if (!weeklyBuckets.has(weekKey)) {
      weeklyBuckets.set(weekKey, {
        name: `${new Intl.DateTimeFormat('en', {
          month: 'short',
          day: 'numeric',
        }).format(startOfWeek)}-${new Intl.DateTimeFormat('en', {
          month: 'short',
          day: 'numeric',
        }).format(new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000))}`,
        timestamp: weekKey,
        total: 0,
      });
    }

    const bucket = weeklyBuckets.get(weekKey);
    bucket.total += Number(order.totalAmount || order.total || 0);
    weeklyBuckets.set(weekKey, bucket);
  });

  const weeklyData = Array.from(weeklyBuckets.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-4);

  const statsCards = [
    {
      title: 'Pending Tasks',
      value: todayMetrics.pending,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'In Progress',
      value: todayMetrics.inProgress,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Ready for Delivery',
      value: todayMetrics.ready,
      icon: Truck,
      color: 'bg-green-500',
    },
    {
      title: 'Today’s Revenue',
      value: `₱${todayMetrics.revenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  const taskBuckets = {
    pending: todayMetrics.pending,
    inProgress: todayMetrics.inProgress,
    ready: todayMetrics.ready,
    deliveredToday: todayMetrics.deliveredToday,
  };

  const monthlyTotal = weeklyData.reduce((sum, item) => sum + item.total, 0);

  return {
    statsCards,
    recentOrders,
    taskBuckets,
    weeklyData,
    monthlyTotal,
  };
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);

  console.log('[ADMIN PAGE] Session loaded:', {
    hasSession: !!session,
    userRole: session?.user?.role,
    hasToken: !!session?.user?.token,
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = session?.user?.token;
      console.log('[ADMIN] Fetching orders with token:', token ? '✓' : '✗');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch('/api/orders?limit=100', { headers });

      console.log('[ADMIN] Orders API response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ADMIN] Failed to fetch orders:', response.status, errorText);
        setOrders([]);
        return;
      }

      const data = await response.json();
      console.log('[ADMIN] Received orders data:', data);
      const ordersList = data.orders || data;
      setOrders(Array.isArray(ordersList) ? ordersList : []);
      console.log(
        '[ADMIN] Set orders to:',
        Array.isArray(ordersList) ? ordersList.length : 0,
        'items'
      );
    } catch (error) {
      console.error('[ADMIN] Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.token]);

  useEffect(() => {
    if (!session?.user?.token) {
      console.log('[ADMIN] useEffect - No token yet, skipping fetch');
      return;
    }

    console.log('[ADMIN] useEffect - Token available, calling fetchOrders');
    fetchOrders();
  }, [fetchOrders, session?.user?.token]);

  const handleCreateOrder = async (formData) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (session?.user?.token) {
        headers.Authorization = `Bearer ${session.user.token}`;
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers,
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

  const metrics = useMemo(() => computeDashboardMetrics(orders), [orders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.statsCards.map((card) => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Order</span>
              </button>
            </div>
            <RecentOrdersTable orders={metrics.recentOrders} />
            <TrendBarChart data={metrics.weeklyData} />
          </div>

          <div className="space-y-6">
            <TaskBucketList data={metrics.taskBuckets} />
            <RevenueBreakdown weeklyData={metrics.weeklyData} monthlyTotal={metrics.monthlyTotal} />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Add New Order"
      >
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
