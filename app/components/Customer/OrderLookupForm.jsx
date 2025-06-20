import React, { useState } from 'react';

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

            <form onSubmit={handleSubmit} className="space-y-4">
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
    );
};

export default OrderLookupForm;