import React from 'react';
import { Package, Clock, Truck, DollarSign } from 'lucide-react';

const DashboardStats = ({ orders, appointments }) => {
    const stats = [
        {
            title: 'Total Orders',
            value: orders.length.toString(),
            icon: Package,
            color: 'bg-blue-500'
        },
        {
            title: 'Pending Appointments',
            value: appointments.filter(a => a.status === 'pending').length.toString(),
            icon: Clock,
            color: 'bg-yellow-500'
        },
        {
            title: 'Ready for Delivery',
            value: orders.filter(o => o.status === 'ready').length.toString(),
            icon: Truck,
            color: 'bg-green-500'
        },
        {
            title: 'Today\'s Revenue',
            value: `$${orders.reduce((sum, order) => sum + order.total, 0)}`,
            icon: DollarSign,
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-900 mb-1">{stat.title}</p>
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

export default DashboardStats;