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
        pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
        in_wash: { color: 'bg-blue-100 text-blue-800', text: 'In Wash' },
        ready: { color: 'bg-green-100 text-green-800', text: 'Ready' },
        delivered: { color: 'bg-gray-100 text-gray-800', text: 'Delivered' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.text}
        </span>
    );
};

const OrderLookupForm = ({ onLookup }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('order');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onLookup(searchTerm.trim(), searchType);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Track Your Order</h2>
                <Package className="text-blue-500" size={24} />
            </div>
            <p className="text-gray-600 mb-4">Enter your order ID or phone number to track your laundry</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search by:</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="searchType"
                                value="order"
                                checked={searchType === 'order'}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="mr-2"
                            />
                            Order ID
                        </label>
                        <label className="flex items-center">
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
                        placeholder={searchType === 'order' ? 'Enter order ID (e.g., LD001)' : 'Enter phone number'}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                    Track Order
                </button>
            </form>
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
        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Order Information</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-medium">{order.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Customer:</span>
                                <span className="font-medium">{order.customer}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium">{order.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Weight:</span>
                                <span className="font-medium">{order.weight}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-medium">${order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Status & Timeline</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                {getStatusIcon(order.status)}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Current Status</span>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {order.status === 'pending' && 'Your order has been received and is being processed'}
                                        {order.status === 'in_wash' && 'Your laundry is currently being washed'}
                                        {order.status === 'ready' && 'Your order is ready for pickup or delivery'}
                                        {order.status === 'delivered' && 'Your order has been delivered'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Estimated Delivery:</span>
                                    <span className="font-medium">
                                        {new Date(order.eta).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <LiveCountdown targetDate={order.eta} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Phone size={16} />
                    <span>Need help? Call us at (555) 123-4567</span>
                </div>
            </div>
        </div>
    );
};

const AppointmentForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        service: 'Wash & Fold',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date & Time</label>
                <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>Wash & Fold</option>
                    <option>Dry Clean</option>
                    <option>Wash & Iron</option>
                    <option>Express Service</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
                <textarea
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special instructions or requests..."
                />
            </div>
            <div className="flex space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Book Appointment
                </button>
            </div>
        </form>
    );
};

// Main Customer Portal Component
const CustomerPortal = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [appointmentSuccess, setAppointmentSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleOrderLookup = async (searchTerm, type) => {
        try {
            setLoading(true);
            setError('');
            
            // Fetch all orders and filter client-side for now
            // In a real app, you'd have a specific API endpoint for order lookup
            const response = await fetch('/api/orders');
            const orders = await response.json();
            
            const order = orders.find(o =>
                type === 'order'
                    ? o.id.toLowerCase() === searchTerm.toLowerCase()
                    : o.phone.includes(searchTerm)
            );
            
            if (order) {
                setSelectedOrder(order);
            } else {
                setError('Order not found. Please check your order ID or phone number.');
            }
        } catch (error) {
            console.error('Error looking up order:', error);
            setError('Failed to look up order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = async (formData) => {
        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer: formData.name,
                    phone: formData.phone,
                    date: formData.date,
                    service: formData.service,
                    notes: formData.notes,
                    status: 'pending'
                }),
            });

            if (response.ok) {
                setIsAppointmentModalOpen(false);
                setAppointmentSuccess(true);
            } else {
                setError('Failed to book appointment. Please try again.');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            setError('Failed to book appointment. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Laundry Services</h1>
                    <p className="text-gray-600">Track your order or book an appointment</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto">
                        {error}
                    </div>
                )}

                {!selectedOrder ? (
                    <div className="space-y-6">
                        <OrderLookupForm onLookup={handleOrderLookup} />

                        {loading && (
                            <div className="text-center py-8">
                                <Loader className="mx-auto animate-spin text-blue-500 mb-4" size={32} />
                                <p className="text-gray-600">Looking up your order...</p>
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Book Appointment</h2>
                                <CalendarDays className="text-blue-500" size={24} />
                            </div>
                            <p className="text-gray-600 mb-4">Schedule a pickup time that works for you</p>
                            <button
                                onClick={() => setIsAppointmentModalOpen(true)}
                                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <CalendarCheck size={18} />
                                Book Now
                            </button>
                        </div>
                    </div>
                ) : (
                    <OrderDetails order={selectedOrder} onBack={() => setSelectedOrder(null)} />
                )}

                {/* Appointment Modal */}
                {isAppointmentModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Book Appointment</h2>
                                <button
                                    onClick={() => setIsAppointmentModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <AppointmentForm
                                onSubmit={handleBookAppointment}
                                onCancel={() => setIsAppointmentModalOpen(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {appointmentSuccess && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
                            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                            <p className="text-gray-600 mb-6">Your appointment has been successfully booked. We'll contact you to confirm the details.</p>
                            <button
                                onClick={() => setAppointmentSuccess(false)}
                                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerPortal;