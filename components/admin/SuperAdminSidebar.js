'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

const SuperAdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [{ key: 'dashboard', label: 'Dashboard', icon: Home, href: '/superadmin' }];

  const isActive = (href) => {
    if (href === '/superadmin') {
      return pathname === '/superadmin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="bg-white shadow-sm border-r h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-gray-800">Laundry Tracker</h2>
        <p className="text-sm text-gray-600">Super Admin Portal</p>
      </div>

      <nav className="p-2">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-indigo-50 text-indigo-600'
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

export default SuperAdminSidebar;
