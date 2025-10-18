'use client';

import Link from 'next/link';
import { Clipboard, Calendar, User } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { key: 'tasks', label: 'My Tasks', icon: Clipboard },
    { key: 'calendar', label: 'Calendar', icon: Calendar },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-screen">
      <div className="p-4 border-b">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Laundry Tracker
        </Link>
        <p className="text-sm text-gray-500">Staff Portal</p>
      </div>
      <nav className="p-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
              activeTab === item.key
                ? 'bg-green-100 text-green-700'
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
