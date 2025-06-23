'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
    Package,
    Truck,
    LogOut,
    History,
    PlusCircle,
    Loader,
    CalendarDays
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';

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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 p-2 rounded-full">
                    <PlusCircle className="text-green-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Create New Order</h2>
            </div>
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
        </div>
    );
};


const LoggedInDashboard = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
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
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome, <span className="text-blue-600">{user.name.split(' ')[0]}</span>!
                    </h1>
                    <button
                        onClick={() => signOut({ callbackUrl: '/customer' })}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </header>

            <main className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-2">
                    <NewOrderForm userId={user.id} onOrderCreated={fetchOrders} />
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <History className="text-blue-600" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Your Order History</h2>
                        </div>
                        {isLoading ? (
                            <div className="text-center py-10">
                                <Loader className="animate-spin text-blue-500 mx-auto" size={32} />
                                <p className="mt-2 text-gray-600">Loading orders...</p>
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
                                    <div key={order.id} className="bg-gray-50 border rounded-lg p-4 transition-all hover:shadow-md hover:border-blue-200">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-lg text-gray-800">₱{order.total.toFixed(2)}</p>
                                                <p className="text-xs text-gray-400 font-mono mt-1">{order.id}</p>
                                            </div>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div className="mt-3 border-t pt-3 space-y-2">
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Package size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                                                <span>{order.weight}kg - {order.service}</span>
                                            </div>
                                            {order.deliveryAddress && (
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <Truck size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                                                    <span>{order.deliveryAddress}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center text-sm text-gray-700">
                                                <CalendarDays size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                                                <span>
                                                    {new Date(order.eta).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                <Package className="mx-auto text-gray-400" size={40} />
                                <p className="mt-2 text-gray-600">You have no orders yet.</p>
                                <p className="text-sm text-gray-500">Create a new one to get started!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

// Remove all other components below this line as they are not needed in the logged-in view
// and were part of the previous public-facing implementation.

export default function CustomerPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <Loader className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (status === "authenticated") {
        return <LoggedInDashboard user={session.user} />;
    }

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = '/'; 
        }
    }, [status]);

    return null;
}