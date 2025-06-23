'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/common/TopBar';

export default function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    // Extract the current path to determine the active tab
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/users')) return 'Users Management';
      if (path.includes('/orders')) return 'Order Management';
      if (path.includes('/appointments')) return 'Appointments';
      if (path.includes('/reports')) return 'Reports';
    }
    return 'Admin Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen bg-gray-50">
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 w-64 h-full">
              <Sidebar />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div className="md:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
            <button onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold">Laundry Admin</h1>
            <div className="w-6" />
          </div>

          <TopBar title={getPageTitle()} />

          <div className="flex-1 p-6 overflow-y-auto relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 