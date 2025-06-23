'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Bell, User } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';

const AdminTopBar = ({ title, onMenuToggle }) => {
    return (
        <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
                 <button onClick={onMenuToggle} className="md:hidden mr-4">
                    <Menu size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <Bell className="text-gray-600 hover:text-gray-800 cursor-pointer" size={20} />
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="text-white" size={16} />
                </div>
            </div>
        </div>
    );
};


export default function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith('/admin/users')) return 'Users Management';
    if (pathname.startsWith('/admin/orders')) return 'Order Management';
    if (pathname.startsWith('/admin/calendar')) return 'Calendar';
    if (pathname.startsWith('/admin/reports')) return 'Analytics Dashboard';
    return 'Admin Dashboard';
  };

  const pageTitle = getPageTitle();

  return (
    <div className="min-h-screen bg-gray-100">
        <div className="flex h-screen bg-gray-100">
            <div className="hidden md:block w-64 flex-shrink-0">
                <Sidebar />
            </div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute left-0 top-0 w-64 h-full bg-white">
                        <Sidebar />
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col overflow-y-auto">
                <AdminTopBar title={pageTitle} onMenuToggle={() => setIsMobileMenuOpen(true)} />

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    </div>
  );
} 