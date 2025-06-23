import React from 'react';
import { Package, Clock, Truck, TrendingUp } from 'lucide-react';

const DashboardStats = ({ orders }) => {
    const stats = [
        {
            title: 'Total Orders',
            value: orders.length.toString(),
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