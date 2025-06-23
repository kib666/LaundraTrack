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

// Utility Components
const StatusBadge = ({ status }) => {
    const statusConfig = {
        'Received': { color: 'bg-yellow-100 text-yellow-800', text: 'Received' },
        'In Wash': { color: 'bg-blue-100 text-blue-800', text: 'In Wash' },
        'Ready': { color: 'bg-green-100 text-green-800', text: 'Ready' },
        'Delivered': { color: 'bg-gray-100 text-gray-800', text: 'Delivered' },
        'Cancelled': { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.text}
        </span>
    );
};

const LiveCountdown = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference > 0) {
                const hours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours}h ${minutes}m`);
            } else {
                setTimeLeft('Ready!');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return <span className="text-sm text-gray-600">{timeLeft}</span>;
};

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
        {
            title: 'Pending Tasks',
            value: orders.filter(o => o.status === 'Received').length.toString(),
            icon: Clock,
            color: 'bg-yellow-500'
        },
        {
            title: 'In Progress',
            value: orders.filter(o => o.status === 'In Wash').length.toString(),
            icon: Package,
            color: 'bg-blue-500'
        },
        {
            title: 'Ready for Delivery',
            value: orders.filter(o => o.status === 'Ready').length.toString(),
            icon: Truck,
            color: 'bg-green-500'
        },
        {
            title: "Today's Revenue",
            value: `₱${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`,
            icon: TrendingUp,
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`${stat.color} p-3 rounded-lg`}>
                            <stat.icon className="text-white" size={24} />
                        </div>
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
            case 'Received':
                return { text: 'Start Wash', color: 'bg-blue-500 hover:bg-blue-600', nextStatus: 'In Wash' };
            case 'In Wash':
                return { text: 'Mark Ready', color: 'bg-green-500 hover:bg-green-600', nextStatus: 'Ready' };
            case 'Ready':
                return { text: 'Mark Delivered', color: 'bg-purple-500 hover:bg-purple-600', nextStatus: 'Delivered' };
            default:
                return null;
        }
    };

    const nextAction = getNextAction(order.status);

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{order.customer}</h3>
                        <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-600 mb-1">Weight: {order.weight} kg</p>
                    <p className="text-sm text-gray-600 mb-1">Total: ₱{order.total.toFixed(2)}</p>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone size={16} />
                    <span>{order.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{order.deliveryAddress}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>ETA: <LiveCountdown targetDate={order.eta} /></span>
                </div>
            </div>

            {nextAction && (
                <button
                    onClick={() => onStatusUpdate(order.id, nextAction.nextStatus)}
                    className={`w-full px-4 py-2 text-white text-sm rounded-lg font-medium transition-colors ${nextAction.color}`}
                >
                    {nextAction.text}
                </button>
            )}
        </div>
    );
};

// Order List Component
const OrderListView = ({ orders, onStatusUpdate }) => {
    const groupedOrders = {
        Received: orders.filter(order => order.status === 'Received'),
        'In Wash': orders.filter(order => order.status === 'In Wash'),
        Ready: orders.filter(order => order.status === 'Ready')
    };

    return (
        <div className="space-y-8">
            {Object.entries(groupedOrders).map(([status, statusOrders]) => (
                <div key={status}>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
                        {status} ({statusOrders.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {statusOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onStatusUpdate={onStatusUpdate}
                            />
                        ))}
                    </div>
                    {statusOrders.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Clipboard size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No {status.toLowerCase()} orders</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Sidebar Component
const Sidebar = ({ activeTab, onTabChange, isMobileMenuOpen, onMobileMenuClose }) => {
    const menuItems = [
        { key: 'tasks', label: 'My Tasks', icon: Clipboard },
        { key: 'deliveries', label: 'Deliveries', icon: Truck },
        { key: 'profile', label: 'Profile', icon: User }
    ];

    const sidebarContent = (
        <div className="bg-white shadow-sm border-r h-full">
            <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">Laundry Tracker</h2>
                <p className="text-sm text-gray-600">Staff Portal</p>
            </div>

            <nav className="p-2">
                {menuItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => {
                            onTabChange(item.key);
                            onMobileMenuClose();
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${activeTab === item.key
                            ? 'bg-green-50 text-green-600'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64">
                {sidebarContent}
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={onMobileMenuClose}
                    />
                    <div className="absolute left-0 top-0 w-64 h-full">
                        <div className="relative h-full">
                            <button
                                onClick={onMobileMenuClose}
                                className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                            {sidebarContent}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Profile Component
const ProfileView = () => {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6">Staff Profile</h2>

                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="text-white" size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">Staff Member</h3>
                        <p className="text-gray-600">Laundry Specialist</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            defaultValue="Staff Member"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                        <input
                            type="text"
                            defaultValue="ST001"
                            className="w-full p-2 border rounded-lg bg-gray-50"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            defaultValue="staff@laundrytracker.com"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            defaultValue="+1234567890"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

// Deliveries Component
const DeliveriesView = ({ orders, onStatusUpdate }) => {
    const readyForDelivery = orders.filter(o => o.status === 'Ready');
    
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Ready for Delivery ({readyForDelivery.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {readyForDelivery.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onStatusUpdate={onStatusUpdate}
                    />
                ))}
            </div>
            {readyForDelivery.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Truck size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No orders ready for delivery.</p>
                </div>
            )}
        </div>
    );
};

// Main Staff Page Component
export default function StaffPage() {
    const [activeTab, setActiveTab] = useState('tasks');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/orders');
            if (response.ok) {
                const data = await response.json();
                setOrders(Array.isArray(data) ? data : []);
            } else {
                console.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
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
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchOrders();
            } else {
                console.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-full">
                    <Loader className="animate-spin text-blue-500" size={48} />
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
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-screen">
                <Sidebar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    isMobileMenuOpen={isMobileMenuOpen}
                    onMobileMenuClose={() => setIsMobileMenuOpen(false)}
                />

                <div className="flex-1 flex flex-col">
                    <TopBar onMenuToggle={() => setIsMobileMenuOpen(true)} />

                    <div className="flex-1 p-6 overflow-y-auto">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}