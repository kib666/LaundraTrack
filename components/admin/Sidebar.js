'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, CalendarDays, BarChart3, Users } from 'lucide-react';

const Sidebar = () => {
    const pathname = usePathname();
    
    const menuItems = [
        { key: 'dashboard', label: 'Dashboard', icon: Home, href: '/admin' },
        { key: 'orders', label: 'Orders', icon: Package, href: '/admin/orders' },
        { key: 'appointments', label: 'Appointments', icon: CalendarDays, href: '/admin/appointments' },
        { key: 'reports', label: 'Reports', icon: BarChart3, href: '/admin/reports' },
        { key: 'users', label: 'Users Management', icon: Users, href: '/admin/users' }
    ];

    const isActive = (href) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="bg-white shadow-sm border-r h-full">
            <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">Laundry Tracker</h2>
                <p className="text-sm text-gray-600">Admin Portal</p>
            </div>

            <nav className="p-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.key}
                        href={item.href}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                            isActive(item.href)
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;