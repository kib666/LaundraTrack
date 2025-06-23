'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
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
    Loader,
    Tag,
    LogIn,
    UserPlus,
    LogOut,
    History,
    PlusCircle
} from 'lucide-react';
import StatusProgressTracker from '@/components/customer/StatusProgressTracker';
import StatusBadge from '@/components/common/StatusBadge';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

const ServicesAndPricing = () => {
    const services = [
        { name: 'Wash & Fold', price: '₱40.00', unit: 'per kg', description: 'Standard washing and folding service for everyday laundry.' },
        { name: 'Dry Cleaning', price: '₱150.00', unit: 'per item', description: 'For delicate items like suits, dresses, and coats.' },
        { name: 'Wash & Iron', price: '₱80.00', unit: 'per kg', description: 'Includes washing, drying, and professional ironing.' },
        { name: 'Express Service', price: '+₱100.00', unit: 'add-on', description: 'Get your laundry done in half the time.' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto mt-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Our Services & Pricing</h2>
                <Tag className="text-blue-500" size={24} />
            </div>
            <div className="space-y-4">
                {services.map((service) => (
                    <div key={service.name} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                            <p className="text-gray-800 font-medium">
                                {service.price} <span className="text-sm text-gray-500">/{service.unit}</span>
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

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

const AuthForm = ({ isRegister = false }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (isRegister) {
            // Handle registration
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Registration successful! Please log in.');
            } else {
                setError(data.error || 'Registration failed.');
            }
        } else {
            // Handle login
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result.error) {
                setError('Invalid email or password.');
            }
            // On successful login, the session will update and the view will change automatically
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3 border rounded-lg text-gray-900" />
                )}
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-lg text-gray-900" />
                {isRegister && (
                    <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full p-3 border rounded-lg text-gray-900" />
                )}
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border rounded-lg text-gray-900" />
                <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-blue-300">
                    {isLoading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
            </form>
        </div>
    );
};

const NewOrderForm = ({ userId, onOrderCreated }) => {
    const [weight, setWeight] = useState('');
    const [service, setService] = useState('Wash & Fold');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [eta, setEta] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [estimatedPrice, setEstimatedPrice] = useState(0);

    const serviceOptions = [
        { name: 'Wash & Fold', price: 40, unit: 'kg' },
        { name: 'Dry Cleaning', price: 150, unit: 'item' },
        { name: 'Wash & Iron', price: 80, unit: 'kg' },
        { name: 'Express Service', price: 100, unit: 'add-on' },
    ];

    useEffect(() => {
        const calculatePrice = () => {
            if (!weight) {
                setEstimatedPrice(0);
                return;
            }

            const selectedService = serviceOptions.find(s => s.name === service);
            if (!selectedService) return;
            
            let price = parseFloat(weight) * selectedService.price;

            if(service === 'Express Service') {
                // Assuming express is an add-on to a base service, let's take wash & fold for calculation
                const baseService = serviceOptions.find(s => s.name === 'Wash & Fold');
                price = (parseFloat(weight) * baseService.price) + selectedService.price;
            }

            setEstimatedPrice(price);
        };
        calculatePrice();
    }, [weight, service]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerType: 'existing',
                    userId: userId,
                    weight: parseFloat(weight),
                    service,
                    deliveryAddress,
                    eta: eta ? new Date(eta) : null,
                    notes,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create order.');
            }
            
            // Clear form
            setWeight('');
            setNotes('');
            setService('Wash & Fold');
            setDeliveryAddress('');
            setEta('');
            onOrderCreated();

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select value={service} onChange={(e) => setService(e.target.value)} className="w-full p-3 border rounded-lg text-gray-900 bg-white">
                    {serviceOptions.map(s => <option key={s.name}>{s.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input type="number" step="0.1" placeholder="e.g., 5.5" value={weight} onChange={(e) => setWeight(e.target.value)} required className="w-full p-3 border rounded-lg text-gray-900" />
            </div>
             {estimatedPrice > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Estimated Price</p>
                    <p className="text-xl font-bold text-blue-600">₱{estimatedPrice.toFixed(2)}</p>
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <input type="text" placeholder="Your full address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} required className="w-full p-3 border rounded-lg text-gray-900" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Delivery Date</label>
                <input type="date" value={eta} onChange={(e) => setEta(e.target.value)} required className="w-full p-3 border rounded-lg text-gray-900" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea placeholder="e.g., Special instructions for delicate items" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" className="w-full p-3 border rounded-lg text-gray-900" />
            </div>
            <button type="submit" disabled={isLoading || !weight} className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed">
                {isLoading ? 'Submitting...' : 'Submit Order'}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
    );
};

const LoggedInDashboard = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        // Don't set loading to true here to avoid flicker on re-fetch
        const res = await fetch(`/api/orders/user/${user.id}`);
        if (res.ok) {
            const data = await res.json();
            setOrders(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [user.id]);
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Welcome, {user.name}!</h1>
                    <button onClick={() => signOut({ callbackUrl: '/customer' })} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 font-medium p-2 rounded-lg hover:bg-red-100 transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800"><PlusCircle size={22} className="mr-2 text-green-600"/>Create New Order</h3>
                        <NewOrderForm userId={user.id} onOrderCreated={fetchOrders} />
                    </div>

                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800"><History size={22} className="mr-2 text-blue-600"/>Your Order History</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {isLoading ? (
                                <p className="text-gray-500">Loading your orders...</p>
                            ) : orders.length > 0 ? (
                                orders.map(order => (
                                    <div key={order.id} className="border-b border-gray-200 pb-4 last:border-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-lg text-gray-800">₱{order.total.toFixed(2)}</p>
                                                <p className="font-mono text-xs text-gray-400 mt-1">{order.id}</p>
                                            </div>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div className="text-sm text-gray-600 mt-2 flex justify-between items-center">
                                           <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                           <span className="font-medium text-gray-700">{order.weight}kg - {order.service}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-600">You haven't placed any orders yet.</p>
                                    <p className="text-sm text-gray-400 mt-1">Use the form on the left to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CustomerPortal = () => {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState('track'); // track, login, register
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

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader className="animate-spin text-blue-500" size={48} />
            </div>
        )
    }

    if (session) {
        return (
            <div className="min-h-screen bg-gray-50">
                <LoggedInDashboard user={session.user} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
                    <Loader className="animate-spin text-blue-500" size={48} />
                </div>
            )}
            
            <div className="w-full max-w-md">
                <div className="flex border-b mb-4">
                    <button onClick={() => setActiveTab('track')} className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'track' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}><Package size={18}/><span>Track</span></button>
                    <button onClick={() => setActiveTab('login')} className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'login' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}><LogIn size={18}/><span>Login</span></button>
                    <button onClick={() => setActiveTab('register')} className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'register' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}><UserPlus size={18}/><span>Register</span></button>
                </div>

                {activeTab === 'track' && (
                    <div>
                        <OrderLookupForm onLookup={handleOrderLookup} onSchedule={() => setView('schedule')} />
                        <ServicesAndPricing />
                        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                    </div>
                )}
                {activeTab === 'login' && <AuthForm />}
                {activeTab === 'register' && <AuthForm isRegister />}
            </div>

            {view === 'details' && order && <OrderDetails order={order} onBack={backToLookup} />}
            {view === 'schedule' && <SchedulePickupForm onSubmit={handleScheduleSubmit} onCancel={backToLookup} />}
        </div>
    );
};

export default CustomerPortal;