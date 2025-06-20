import React from 'react';
import { Home, Package, CalendarDays, BarChart3, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
    const menuItems = [
        { key: 'dashboard', label: 'Dashboard', icon: Home },
        { key: 'orders', label: 'Orders', icon: Package },
        { key: 'appointments', label: 'Appointments', icon: CalendarDays },
        { key: 'reports', label: 'Reports', icon: BarChart3 },
        { key: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
        <div className="bg-white shadow-sm border-r h-full">
            <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">Laundry Tracker</h2>
                <p className="text-sm text-gray-600">Admin Portal</p>
            </div>

            <nav className="p-2">
                {menuItems.map((item) => (
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

export default Sidebar;