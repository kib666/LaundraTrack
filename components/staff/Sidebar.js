import React from 'react';
import {
    Clipboard,
    Truck,
    User,
    Package,
    Clock,
    CheckCircle,
    Home,
    Calendar
} from 'lucide-react';

const StaffSidebar = ({ activeTab, onTabChange }) => {
    const staffItems = [
        { key: 'dashboard', label: 'Dashboard', icon: Home },
        { key: 'tasks', label: 'My Tasks', icon: Clipboard },
        { key: 'deliveries', label: 'Deliveries', icon: Truck },
        { key: 'schedule', label: 'My Schedule', icon: Calendar },
        { key: 'completed', label: 'Completed', icon: CheckCircle },
        { key: 'profile', label: 'Profile', icon: User }
    ];

    return (
        <div className="bg-white shadow-sm border-r h-full">
            <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">Laundry Tracker</h2>
                <p className="text-sm text-gray-600">Staff Portal</p>
            </div>

            <nav className="p-2">
                {staffItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => onTabChange(item.key)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${activeTab === item.key
                            ? 'bg-blue-50 text-blue-600'
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
};

export default StaffSidebar;