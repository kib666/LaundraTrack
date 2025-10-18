'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Clock,
  Package,
  Truck,
  User,
  Bell,
  Menu,
  Clipboard,
  TrendingUp,
  Loader,
} from 'lucide-react';
import Sidebar from '@/components/staff/Sidebar';
import StatusBadge from '@/components/common/StatusBadge';
import OrderCalendarView from '@/components/admin/OrderCalendarView';

const StaffTopBar = ({ title, onMenuToggle, staffName }) => {
  return (
    <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={onMenuToggle} className="md:hidden mr-4">
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="text-gray-600 hover:text-gray-800 cursor-pointer" size={20} />
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <User className="text-white" size={16} />
          </div>
          <span className="text-sm font-medium text-gray-800">{staffName || 'Staff Member'}</span>
        </div>
      </div>
    </div>
  );
};

// Staff Stats Component
const StaffStats = ({ orders }) => {
  const pendingCount = orders.filter(
    (o) => o.dbStatus === 'pending' || o.dbStatus === 'confirmed'
  ).length;
  const inProgressCount = orders.filter((o) => o.dbStatus === 'in_progress').length;
  const readyForPickupCount = orders.filter(
    (o) => o.dbStatus === 'ready_for_pickup' && (o.fulfillmentType || 'pickup') !== 'delivery'
  ).length;
  const readyForDeliveryCount = orders.filter(
    (o) =>
      (o.dbStatus === 'ready_for_pickup' || o.dbStatus === 'picked_up') &&
      (o.fulfillmentType || 'pickup') === 'delivery'
  ).length;
  const revenueTotal = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const stats = [
    {
      title: 'Pending Tasks',
      value: pendingCount,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'In Progress',
      value: inProgressCount,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Ready for Pickup',
      value: readyForPickupCount,
      icon: Clipboard,
      color: 'bg-emerald-500',
    },
    {
      title: 'Ready for Delivery',
      value: readyForDeliveryCount,
      icon: Truck,
      color: 'bg-green-500',
    },
    {
      title: "Today's Revenue",
      value: `₱${revenueTotal.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm p-6 border flex items-center justify-between"
        >
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

// Order Card Component
const OrderCard = ({ order, onStatusUpdate, onCancel }) => {
  const getNextAction = (dbStatus, fulfillmentType) => {
    const isDelivery = (fulfillmentType || 'pickup') === 'delivery';

    switch (dbStatus) {
      case 'pending':
      case 'confirmed':
        return {
          text: 'Start Wash',
          color: 'bg-blue-500 hover:bg-blue-600',
          nextStatus: 'in_progress',
        };
      case 'in_progress':
        return {
          text: isDelivery ? 'Mark Ready for Delivery' : 'Mark Ready for Pickup',
          color: 'bg-green-500 hover:bg-green-600',
          nextStatus: 'ready_for_pickup',
        };
      case 'ready_for_pickup':
        return {
          text: isDelivery ? 'Mark Out for Delivery' : 'Confirm Pickup',
          color: 'bg-purple-500 hover:bg-purple-600',
          nextStatus: isDelivery ? 'picked_up' : 'delivered',
        };
      case 'picked_up':
        return isDelivery
          ? {
              text: 'Confirm Delivered',
              color: 'bg-indigo-500 hover:bg-indigo-600',
              nextStatus: 'delivered',
            }
          : null;
      default:
        return null;
    }
  };

  const nextAction = getNextAction(order.dbStatus, order.fulfillmentType);
  const customerName =
    order.customerId?.firstName && order.customerId?.lastName
      ? `${order.customerId.firstName} ${order.customerId.lastName}`
      : 'Walk-in Customer';
  const customerPhone = order.customerId?.phone || 'N/A';
  const itemsCount = order.items?.length || 0;
  const canCancel = order.dbStatus === 'pending' || order.dbStatus === 'confirmed';

  const isDelivery = (order.fulfillmentType || 'pickup') === 'delivery';

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{customerName}</h3>
            <p className="text-xs text-gray-500">{customerPhone}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="text-sm space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Tracking:</span>{' '}
            <span className="font-mono text-xs">{order.trackingNumber}</span>
          </p>
          <p>
            <span className="font-medium">Items:</span> {itemsCount}
          </p>
          <p>
            <span className="font-medium">Service:</span> {order.serviceType || 'wash'}
          </p>
          {isDelivery && order.deliveryAddress && (
            <p>
              <span className="font-medium">Address:</span>{' '}
              <span className="text-xs">{order.deliveryAddress}</span>
            </p>
          )}
          <p className="text-lg font-bold">₱{(order.totalAmount || 0).toFixed(2)}</p>
        </div>
      </div>
      <div className="space-y-2 mt-4">
        {nextAction && (
          <button
            onClick={() => onStatusUpdate(order._id, nextAction.nextStatus)}
            className={`w-full px-4 py-2 text-white text-sm rounded-lg font-medium transition-colors ${nextAction.color}`}
          >
            {nextAction.text}
          </button>
        )}
        {canCancel && (
          <button
            onClick={() => onCancel(order._id)}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg font-medium transition-colors"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

// Order List View - Updated to include a "Delivered" section
const OrderListView = ({ orders, onStatusUpdate, onCancel }) => {
  const groupedOrders = {
    pending: orders.filter(
      (order) => order.dbStatus === 'pending' || order.dbStatus === 'confirmed'
    ),
    in_progress: orders.filter((order) => order.dbStatus === 'in_progress'),
    ready_for_pickup: orders.filter(
      (order) =>
        order.dbStatus === 'ready_for_pickup' && (order.fulfillmentType || 'pickup') !== 'delivery'
    ),
    ready_for_delivery: orders.filter(
      (order) =>
        (order.dbStatus === 'ready_for_pickup' || order.dbStatus === 'picked_up') &&
        (order.fulfillmentType || 'pickup') === 'delivery'
    ),
    delivered: orders.filter((order) => order.dbStatus === 'delivered'),
  };

  const statusHeadings = {
    pending: 'Pending Orders',
    in_progress: 'In Progress',
    ready_for_pickup: 'Ready for Pickup',
    ready_for_delivery: 'Ready for Delivery',
    delivered: 'Completed & Delivered',
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedOrders).map(([status, statusOrders]) => (
        <div key={status}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {statusHeadings[status]} ({statusOrders.length})
          </h2>
          {statusOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {statusOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusUpdate={onStatusUpdate}
                  onCancel={onCancel}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <Clipboard size={40} className="mx-auto mb-2 text-gray-300" />
              <p>No {statusHeadings[status].toLowerCase()} orders</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ProfileView = ({ session }) => {
  const staffMember = session?.user || {};
  const fullName =
    staffMember.name ||
    `${staffMember.firstName || ''} ${staffMember.lastName || ''}`.trim() ||
    'Staff Member';

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            disabled
            className="w-full p-2 border rounded-lg bg-gray-100 text-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
          <input
            type="email"
            value={staffMember.email || 'N/A'}
            disabled
            className="w-full p-2 border rounded-lg bg-gray-100 text-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
          <input
            type="tel"
            value={staffMember.phone || 'N/A'}
            disabled
            className="w-full p-2 border rounded-lg bg-gray-100 text-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
          <input
            type="text"
            value={(staffMember.role || 'STAFF').toUpperCase()}
            disabled
            className="w-full p-2 border rounded-lg bg-gray-100 text-gray-800"
          />
        </div>
        <div className="pt-4 border-t mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            disabled
          >
            Edit Profile (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Staff Page Component
export default function StaffPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect if not authenticated or not staff/admin
  useEffect(() => {
    // Wait for session to load
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      window.location.href = '/customer?error=staff_access_required';
    } else if (status === 'authenticated') {
      // Check if user is staff or admin
      const userRole = session?.user?.role;
      if (userRole !== 'staff' && userRole !== 'admin') {
        console.log('Access denied. User role:', userRole);
        window.location.href = '/customer?error=unauthorized';
      }
    }
  }, [status, session?.user?.role]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const headers = session?.user?.token ? { Authorization: `Bearer ${session.user.token}` } : {};
      const res = await fetch('/api/orders', { headers });
      if (res.ok) {
        const data = await res.json();
        const ordersList = data.orders || data;
        setOrders(Array.isArray(ordersList) ? ordersList : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      fetchOrders();
    }
  }, [session?.user?.token]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchOrders(); // Re-fetch orders to update the UI
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (response.ok) {
        fetchOrders(); // Re-fetch orders to update the UI
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Error canceling order');
    }
  };

  const pageTitle = {
    tasks: 'My Tasks',
    calendar: 'Calendar',
    profile: 'My Profile',
  }[activeTab];

  const renderContent = () => {
    if (loading && activeTab !== 'calendar' && activeTab !== 'profile') {
      return (
        <div className="flex justify-center items-center h-full">
          <Loader className="animate-spin" size={48} />
        </div>
      );
    }

    switch (activeTab) {
      case 'tasks':
        return (
          <>
            <StaffStats orders={orders} />
            <OrderListView
              orders={orders}
              onStatusUpdate={handleStatusUpdate}
              onCancel={handleCancelOrder}
            />
          </>
        );
      case 'calendar':
        return <OrderCalendarView orders={orders} />;
      case 'profile':
        return <ProfileView session={session} />;
      default:
        return null;
    }
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  // Show nothing while redirecting (redirects are handled in useEffect)
  if (
    status === 'unauthenticated' ||
    (status === 'authenticated' &&
      session?.user?.role !== 'staff' &&
      session?.user?.role !== 'admin')
  ) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 h-full bg-white">
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-y-auto">
        <StaffTopBar
          title={pageTitle}
          onMenuToggle={() => setIsMobileMenuOpen(true)}
          staffName={session?.user?.name || session?.user?.firstName}
        />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
