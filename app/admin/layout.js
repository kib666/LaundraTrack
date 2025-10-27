'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu, Bell, Loader, X } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import UserProfileDropdown from '@/components/common/UserProfileDropdown';

const AdminTopBar = ({ title, onMenuToggle }) => {
  return (
    <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <button
          onClick={onMenuToggle}
          className="mr-4 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="text-gray-600 hover:text-gray-800 cursor-pointer" size={20} />
        <UserProfileDropdown />
      </div>
    </div>
  );
};

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    // Wait for session to load
    if (status === 'loading') {
      setIsChecking(true);
      return;
    }

    setIsChecking(false);

    if (status === 'unauthenticated') {
      window.location.href = '/';
    } else if (status === 'authenticated') {
      // Double-check role is admin, wait a moment for session to fully load
      setTimeout(() => {
        if (!session?.user?.role || session.user.role !== 'admin') {
          console.log('Access denied. User role:', session?.user?.role);
          window.location.href = '/';
        }
      }, 100);
    }
  }, [status, session?.user?.role]);

  const getPageTitle = () => {
    if (pathname.startsWith('/admin/users')) return 'Users Management';
    if (pathname.startsWith('/admin/orders')) return 'Order Management';
    if (pathname.startsWith('/admin/calendar')) return 'Calendar';
    if (pathname.startsWith('/admin/reports')) return 'Analytics Dashboard';
    return 'Admin Dashboard';
  };

  const pageTitle = getPageTitle();

  // Show loading while checking authentication
  if (isChecking || status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  // Show nothing while redirecting (redirects are handled in useEffect)
  if (status === 'unauthenticated') {
    return null;
  }

  // If authenticated but not admin, the redirect will happen in useEffect
  if (status === 'authenticated' && (!session?.user?.role || session.user.role !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen bg-gray-100">
        {/* Desktop Sidebar - Always visible */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-out">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-y-auto">
          <AdminTopBar
            title={pageTitle}
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
