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
    X
} from 'lucide-react';

// Mock data for demo
const mockOrders = [
    { id: 'LD001', customer: 'John Doe', phone: '+1234567890', weight: '5kg', status: 'pending', eta: '2024-06-19T10:00:00Z', total: 45.00 },
    { id: 'LD002', customer: 'Jane Smith', phone: '+1234567891', weight: '3kg', status: 'in_wash', eta: '2024-06-19T14:00:00Z', total: 35.00 },
    { id: 'LD003', customer: 'Bob Wilson', phone: '+1234567892', weight: '7kg', status: 'ready', eta: '2024-06-19T16:00:00Z', total: 65.00 },
    { id: 'LD004', customer: 'Alice Johnson', phone: '+1234567893', weight: '4kg', status: 'delivered', eta: '2024-06-18T18:00:00Z', total: 40.00 }
];

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

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

const OrderLookupForm = ({ onLookup }) => {
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [lookupType, setLookupType] = useState('order');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLookup(lookupType === 'order' ? orderId : phone, lookupType);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-center mb-6">Track Your Order</h2>

            <div className="space-y-4">
                <div className="flex space-x-4 mb-4">
                    <button
                        type="button"
                        onClick={() => setLookupType('order')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${lookupType === 'order'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Order ID
                    </button>
                    <button
                        type="button"
                        onClick={() => setLookupType('phone')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${lookupType === 'phone'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Phone Number
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {lookupType === 'order' ? (
                        <input
                            type="text"
                            placeholder="Enter order ID (e.g., LD001)"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            required
                        />
                    ) : (
                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                        Track Order
                    </button>
                </form>
            </div>
        </div>
    );
};

const StatusProgressTracker = ({ status, eta }) => {
    const steps = [
        { key: 'pending', label: 'Order Received', icon: Package },
        { key: 'in_wash', label: 'In Wash', icon: Clock },
        { key: 'ready', label: 'Ready', icon: CheckCircle },
        { key: 'delivered', label: 'Delivered', icon: Truck }
    ];

    const getCurrentStep = () => {
        const stepIndex = steps.findIndex(step => step.key === status);
        return stepIndex !== -1 ? stepIndex : 0;
    };

    const currentStep = getCurrentStep();

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-6 text-center">Order Status</h3>

            <div className="relative">
                <div className="flex justify-between items-center mb-8">
                    {steps.map((step, index) => {
                        const isActive = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={step.key} className="flex flex-col items-center flex-1">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                                    } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}>
                                    <step.icon size={20} />
                                </div>
                                <span className={`text-sm text-center ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-10">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {status !== 'delivered' && (
                <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Estimated delivery time:</p>
                    <p className="text-lg font-semibold text-blue-600">
                        <LiveCountdown targetDate={eta} />
                    </p>
                </div>
            )}
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date & Time</label>
                <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>Wash & Fold</option>
                    <option>Dry Clean</option>
                    <option>Wash & Iron</option>
                    <option>Express Service</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requirements..."
                />
            </div>
            <div className="flex space-x-3 pt-2">
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

    const handleOrderLookup = (searchTerm, type) => {
        const order = mockOrders.find(o =>
            type === 'order'
                ? o.id.toLowerCase() === searchTerm.toLowerCase()
                : o.phone.includes(searchTerm)
        );
        setSelectedOrder(order);
    };

    const handleBookAppointment = (formData) => {
        // In a real app, you'd send this to your backend
        console.log('Booking appointment:', formData);
        setIsAppointmentModalOpen(false);
        setAppointmentSuccess(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Laundry Services</h1>
                    <p className="text-gray-600">Track your order or book an appointment</p>
                </div>

                {!selectedOrder ? (
                    <div className="space-y-6">
                        <OrderLookupForm onLookup={handleOrderLookup} />

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
                    <div className="space-y-6">
                        <div className="text-center">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                            >
                                ← Back to Services
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
                            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order ID:</span>
                                    <span className="font-medium">{selectedOrder.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Customer:</span>
                                    <span className="font-medium">{selectedOrder.customer}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Weight:</span>
                                    <span className="font-medium">{selectedOrder.weight}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="font-medium">${selectedOrder.total}</span>
                                </div>
                            </div>
                        </div>

                        <StatusProgressTracker status={selectedOrder.status} eta={selectedOrder.eta} />

                        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
                            <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Phone size={16} className="text-gray-500" />
                                    <span className="text-sm">Call us: (555) 123-4567</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail size={16} className="text-gray-500" />
                                    <span className="text-sm">Email: support@laundrytracker.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Book Appointment Modal */}
            <Modal
                isOpen={isAppointmentModalOpen}
                onClose={() => setIsAppointmentModalOpen(false)}
                title="Book Appointment"
            >
                <AppointmentForm
                    onSubmit={handleBookAppointment}
                    onCancel={() => setIsAppointmentModalOpen(false)}
                />
            </Modal>

            {/* Appointment Success Modal */}
            <Modal
                isOpen={appointmentSuccess}
                onClose={() => setAppointmentSuccess(false)}
                title="Appointment Booked!"
            >
                <div className="text-center p-6">
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
            </Modal>
        </div>
    );
};

export default CustomerPortal;