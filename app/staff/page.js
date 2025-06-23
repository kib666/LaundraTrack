'use client';

import React, { useState, useEffect } from 'react';
import {
    Clock,
    Package,
    Truck,
    User,
    CheckCircle,
    AlertCircle,
    Bell,
    Menu,
    X,
    Clipboard,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Weight,
    TrendingUp,
    Loader
} from 'lucide-react';
import Sidebar from '@/components/staff/Sidebar';
import StatusBadge from '@/components/common/StatusBadge';

// Utility Components
const TopBar = ({ onMenuToggle }) => {
    return (
        <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <button onClick={onMenuToggle} className="md:hidden">
                    <Menu size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Staff Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
                <Bell className="text-gray-600 hover:text-gray-800 cursor-pointer" size={20} />
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="text-white" size={16} />
                    </div>
                    <span className="text-sm font-medium">Staff Member</span>
                </div>
            </div>
        </div>
    );
};

// Staff Stats Component
const StaffStats = ({ orders }) => {
    const stats = [
        { title: 'Pending Tasks', value: orders.filter(o => o.status === 'PENDING').length, icon: Clock, color: 'bg-yellow-500' },
        { title: 'In Progress', value: orders.filter(o => o.status === 'IN_PROGRESS').length, icon: Package, color: 'bg-blue-500' },
        { title: 'Ready for Delivery', value: orders.filter(o => o.status === 'COMPLETED').length, icon: Truck, color: 'bg-green-500' },
        { title: "Today's Revenue", value: `₱${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`, icon: TrendingUp, color: 'bg-purple-500' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

// Order Card Component
const OrderCard = ({ order, onStatusUpdate }) => {
    const getNextAction = (status) => {
        switch (status) {
            case 'PENDING': return { text: 'Start Wash', color: 'bg-blue-500 hover:bg-blue-600', nextStatus: 'IN_PROGRESS' };
            case 'IN_PROGRESS': return { text: 'Mark Ready', color: 'bg-green-500 hover:bg-green-600', nextStatus: 'COMPLETED' };
            case 'COMPLETED': return { text: 'Mark Delivered', color: 'bg-purple-500 hover:bg-purple-600', nextStatus: 'DELIVERED' };
            default: return null;
        }
    };

    const nextAction = getNextAction(order.status);

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{order.user?.name || 'Walk-in Customer'}</h3>
                        <p className="text-xs text-gray-500">{order.user?.phoneNumber}</p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>
                <div className="text-sm space-y-2 text-gray-700">
                    <p><span className="font-medium">ID:</span> <span className="font-mono text-xs">{order.id}</span></p>
                    <p><span className="font-medium">Weight:</span> {order.weight} kg</p>
                    <p><span className="font-medium">Service:</span> {order.service}</p>
                    <p className="text-lg font-bold">₱{order.total.toFixed(2)}</p>
                </div>
            </div>
            {nextAction && (
                <button
                    onClick={() => onStatusUpdate(order.id, nextAction.nextStatus)}
                    className={`w-full mt-4 px-4 py-2 text-white text-sm rounded-lg font-medium transition-colors ${nextAction.color}`}
                >
                    {nextAction.text}
                </button>
            )}
        </div>
    );
};

// Order List View - Updated to include a "Delivered" section
const OrderListView = ({ orders, onStatusUpdate }) => {
    const groupedOrders = {
        PENDING: orders.filter(order => order.status === 'PENDING'),
        IN_PROGRESS: orders.filter(order => order.status === 'IN_PROGRESS'),
        COMPLETED: orders.filter(order => order.status === 'COMPLETED'),
        DELIVERED: orders.filter(order => order.status === 'DELIVERED'),
    };

    const statusHeadings = {
        PENDING: "Pending",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Ready for Delivery / Pickup",
        DELIVERED: "Completed & Delivered"
    };

    return (
        <div className="space-y-8">
            {Object.entries(groupedOrders).map(([status, statusOrders]) => (
                <div key={status}>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
                        {statusHeadings[status]} ({statusOrders.length})
                    </h2>
                    {statusOrders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {statusOrders.map((order) => (
                                <OrderCard key={order.id} order={order} onStatusUpdate={onStatusUpdate} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                            <Clipboard size={40} className="mx-auto mb-2 text-gray-300" />
                            <p>No {statusHeadings[status]} orders</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const DeliveriesView = ({ orders, onStatusUpdate }) => {
    const deliveryOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'DELIVERED');

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Deliveries</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                            <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                            <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">ETA</th>
                            <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deliveryOrders.length > 0 ? deliveryOrders.map(order => (
                            <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-3">
                                    <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">{order.user?.phoneNumber}</p>
                                </td>
                                <td className="p-3 text-sm text-gray-700">{order.deliveryAddress}</td>
                                <td className="p-3 text-sm text-gray-700">{new Date(order.eta).toLocaleDateString()}</td>
                                <td className="p-3"><StatusBadge status={order.status} /></td>
                                <td className="p-3">
                                    {order.status === 'COMPLETED' && (
                                        <button onClick={() => onStatusUpdate(order.id, 'DELIVERED')} className="bg-purple-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-purple-600">
                                            Mark Delivered
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-12 text-gray-500">
                                    No orders ready for delivery.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ProfileView = () => {
    // This is a placeholder until we have real staff authentication
    const mockStaff = {
        name: 'John Doe',
        email: 'john.doe@laundry.com',
        phone: '09123456789',
        role: 'STAFF'
    };

    return (
         <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Staff Profile</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <input type="text" value={mockStaff.name} disabled className="w-full p-2 border rounded-lg bg-gray-100 text-gray-800" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <input type="email" value={mockStaff.email} disabled className="w-full p-2 border rounded-lg bg-gray-100 text-gray-800" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <input type="tel" value={mockStaff.phone} disabled className="w-full p-2 border rounded-lg bg-gray-100 text-gray-800" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                    <input type="text" value={mockStaff.role} disabled className="w-full p-2 border rounded-lg bg-gray-100 text-gray-800" />
                </div>
                 <div className="pt-4 border-t mt-6">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300" disabled>Edit Profile (Coming Soon)</button>
                </div>
            </div>
        </div>
    );
};

// Main Staff Page Component
export default function StaffPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tasks');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
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
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                fetchOrders(); // Re-fetch orders to update the UI
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const renderContent = () => {
        if (loading) {
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
                        <OrderListView orders={orders} onStatusUpdate={handleStatusUpdate} />
                    </>
                );
            case 'deliveries':
                return <DeliveriesView orders={orders} onStatusUpdate={handleStatusUpdate} />;
            case 'profile':
                return <ProfileView />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white shadow-sm border-b p-4">
                    <h1 className="text-2xl font-bold text-gray-800">Staff Dashboard</h1>
                </div>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}