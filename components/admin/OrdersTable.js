import React, { useState } from 'react';
import { Search, Edit, Calendar } from 'lucide-react';
import Link from 'next/link';

// New EditableDate component
const EditableDate = ({ order, onDateUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newDate, setNewDate] = useState(new Date(order.eta).toISOString().split('T')[0]);

    const handleSave = () => {
        onDateUpdate(order.id, newDate);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    onBlur={handleSave}
                    autoFocus
                    className="p-1 border rounded-md text-sm text-gray-900"
                />
            </div>
        );
    }

    return (
        <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsEditing(true)}
        >
            <Calendar size={14} className="text-gray-500" />
            <span className="text-sm text-gray-900">
                {new Date(order.eta).toLocaleDateString()}
            </span>
        </div>
    );
};

const OrdersTable = ({ orders, onStatusUpdate, onDateUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = orders.filter(order => {
        const customerName = order.user?.name || '';
        const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by customer name or Order ID..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Ready</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{order.user?.name || 'Walk-in Customer'}</div>
                                        <div className="text-sm text-gray-500">{order.user?.phoneNumber || ''}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.weight} kg</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <select
                                        className="text-sm border-none bg-transparent focus:outline-none text-gray-900"
                                        value={order.status}
                                        onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Ready</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <EditableDate order={order} onDateUpdate={onDateUpdate} />
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ₱{order.total.toFixed(2)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                                        <Edit size={16} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;