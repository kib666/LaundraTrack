'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu, Bell, User, Loader } from 'lucide-react';
import SuperAdminSidebar from '@/components/admin/SuperAdminSidebar';

const SuperAdminTopBar = ({ title, onMenuToggle, userName }) => {
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
        <div
          className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer"
          title={userName}
        >
          <User className="text-white" size={16} />
        </div>
      </div>
    </div>
  );
};

export default function SuperAdminLayout({ children }) {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();

  // Redirect if not authenticated or not superadmin
  useEffect(() => {
    // Wait for session to load
    if (status === 'loading') {
      setIsChecking(true);
      return;
    }

    setIsChecking(false);

    if (status === 'unauthenticated') {
      window.location.href = '/superadmin-login';
    } else if (status === 'authenticated') {
      // Double-check role is superadmin, wait a moment for session to fully load
      setTimeout(() => {
        if (!session?.user?.role || session.user.role !== 'superadmin') {
          console.log('Access denied. User role:', session?.user?.role);
          window.location.href = '/superadmin-login?error=unauthorized';
        }
      }, 100);
    }
  }, [status, session?.user?.role]);

  const getPageTitle = () => {
    return 'Admins';
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

  // If authenticated but not superadmin, the redirect will happen in useEffect
  if (status === 'authenticated' && (!session?.user?.role || session.user.role !== 'superadmin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen bg-gray-100">
        <div className="hidden md:block w-64 flex-shrink-0">
          <SuperAdminSidebar />
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 w-64 h-full bg-white">
              <SuperAdminSidebar />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-y-auto">
          <SuperAdminTopBar
            title={pageTitle}
            onMenuToggle={() => setIsMobileMenuOpen(true)}
            userName={session?.user?.name}
          />

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
