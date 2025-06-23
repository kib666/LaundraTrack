'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Package,
    Truck,
    User,
    CheckCircle,
    Phone,
    Mail,
    CalendarCheck,
    CalendarDays,
    X,
    Loader
} from 'lucide-react';
import StatusProgressTracker from '@/components/customer/StatusProgressTracker';

// Utility Components
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

const StatusBadge = ({ status }) => {
    const statusConfig = {
        PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
        IN_PROGRESS: { color: 'bg-blue-100 text-blue-800', text: 'In Wash' },
        COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Ready' },
        DELIVERED: { color: 'bg-gray-100 text-gray-800', text: 'Delivered' },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.text}
        </span>
    );
};

const OrderLookupForm = ({ onLookup, onSchedule }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('phone');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onLookup(searchTerm.trim(), searchType);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Track Your Order</h2>
                <Package className="text-blue-500" size={24} />
            </div>
            <p className="text-gray-600 mb-4">
                Enter your order ID or phone number to track your laundry.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search by:
                    </label>
                    <div className="flex space-x-4">
                        <label className="flex items-center text-gray-800">
                            <input
                                type="radio"
                                name="searchType"
                                value="email"
                                checked={searchType === 'email'}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="mr-2"
                            />
                            Email
                        </label>
                        <label className="flex items-center text-gray-800">
                            <input
                                type="radio"
                                name="searchType"
                                value="phone"
                                checked={searchType === 'phone'}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="mr-2"
                            />
                            Phone Number
                        </label>
                    </div>
                </div>
                
                <div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={
                            searchType === 'email'
                                ? 'Enter your email address'
                                : 'Enter your phone number'
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                    Track Order
                </button>
            </form>
            <div className="mt-4 text-center">
                <p className="text-gray-600">or</p>
                <button
                    onClick={onSchedule}
                    className="w-full mt-2 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                    <CalendarCheck size={20} />
                    <span>Schedule a Pickup</span>
                </button>
            </div>
        </div>
    );
};

const OrderDetails = ({ order, onBack }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="text-yellow-500" size={20} />;
            case 'in_wash': return <Package className="text-blue-500" size={20} />;
            case 'ready': return <CheckCircle className="text-green-500" size={20} />;
            case 'delivered': return <Truck className="text-gray-500" size={20} />;
            default: return <Clock className="text-gray-500" size={20} />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="mb-8">
                <StatusProgressTracker status={order.status} eta={order.eta}>
                    <p className="text-sm text-gray-600 mb-2">Estimated delivery time:</p>
                    <div className="text-lg font-semibold text-blue-600">
                        <span>{new Date(order.eta).toLocaleDateString()}</span>
                        {new Date(order.eta) > new Date() && (
                            <span className="block text-xs font-normal">
                                <LiveCountdown targetDate={order.eta} />
                            </span>
                        )}
                    </div>
                </StatusProgressTracker>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Order Information
                </h3>
                <div className="space-y-4 text-gray-800">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {order.id}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">{order.customerName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{order.customerPhone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{order.weight} lbs</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-lg text-green-600">
                            ₱{order.total ? order.total.toFixed(2) : '0.00'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Phone size={16} />
                    <span>Need help? Call us at (555) 123-4567</span>
                </div>
            </div>
        </div>
    );
};

const SchedulePickupForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Schedule a Pickup</h2>
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
            </div>
            <p className="text-gray-600 mb-4">
                Fill in your details, and we'll create an order for you.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes (optional)
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                        }
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="e.g., special instructions for pickup"
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    );
};

const CustomerPortal = () => {
    const [view, setView] = useState('lookup'); // 'lookup', 'details', 'schedule'
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);

    useEffect(() => {
        if (view === 'details' && order && order.status !== 'DELIVERED') {
            const pollOrderStatus = async (orderId) => {
                try {
                    const response = await fetch(`/api/orders/lookup?type=order&q=${orderId}`);
                    if (response.ok) {
                        const updatedOrder = await response.json();
                        setOrder(updatedOrder);
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            };

            const intervalId = setInterval(() => {
                pollOrderStatus(order.id);
            }, 10000); // Poll every 10 seconds

            return () => clearInterval(intervalId);
        }
    }, [view, order]);

    const handleOrderLookup = async (searchTerm, type) => {
        setIsLoading(true);
        setError('');
        setOrder(null);
        try {
            const response = await fetch(
                `/api/orders/lookup?type=${type}&q=${searchTerm}`
            );
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Order not found');
            }
            const data = await response.json();
            setOrder(data);
            setView('details');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScheduleSubmit = async (formData) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    customerPhone: formData.phone,
                    customerEmail: formData.email,
                    notes: formData.notes,
                    // customerType is 'new' by default when scheduling from this form
                    customerType: 'new',
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to schedule pickup');
            }

            const newOrder = await response.json();
            setLastOrder(newOrder);
            setView('lookup'); // Go back to lookup view after scheduling
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const backToLookup = () => {
        setOrder(null);
        setError('');
        setView('lookup');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
                    <Loader className="animate-spin text-blue-500" size={48} />
                </div>
            )}

            {view === 'lookup' && (
                <div className="w-full max-w-md">
                    <OrderLookupForm
                        onLookup={handleOrderLookup}
                        onSchedule={() => setView('schedule')}
                    />
                    {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                    {lastOrder && (
                        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                            Pickup scheduled successfully! Your new Order ID is{' '}
                            <span className="font-bold">{lastOrder.id}</span>.
                        </div>
                    )}
                </div>
            )}

            {view === 'details' && order && (
                <OrderDetails order={order} onBack={backToLookup} />
            )}

            {view === 'schedule' && (
                <SchedulePickupForm
                    onSubmit={handleScheduleSubmit}
                    onCancel={backToLookup}
                />
            )}
        </div>
    );
};

export default CustomerPortal;