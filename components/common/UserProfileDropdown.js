'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, ChevronDown } from 'lucide-react';

const UserProfileDropdown = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    // Sign out and redirect to home
    await signOut({
      redirect: false,
    });
    // Redirect to homepage
    window.location.href = '/';
  };

  if (!session?.user) {
    return null;
  }

  const userInitials = `${session.user.firstName?.[0] || session.user.email?.[0] || 'U'}${
    session.user.lastName?.[0] || ''
  }`.toUpperCase();

  const roleColors = {
    admin: 'bg-purple-500',
    staff: 'bg-green-500',
    customer: 'bg-blue-500',
  };

  const roleBadgeColors = {
    admin: 'bg-purple-100 text-purple-700',
    staff: 'bg-green-100 text-green-700',
    customer: 'bg-blue-100 text-blue-700',
  };

  const bgColor = roleColors[session.user.role] || 'bg-gray-500';
  const badgeColor = roleBadgeColors[session.user.role] || 'bg-gray-100 text-gray-700';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="User Profile"
      >
        <div
          className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center cursor-pointer`}
        >
          <span className="text-white text-sm font-semibold">{userInitials}</span>
        </div>
        <ChevronDown size={16} className="text-gray-600" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white font-semibold">{userInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {session.user.firstName} {session.user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* Role Badge and Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Role</span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${badgeColor}`}
              >
                {session.user.role}
              </span>
            </div>
            {session.user.status && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">Status</span>
                <span className="text-xs font-semibold px-2 py-1 rounded-full capitalize text-green-700 bg-green-100">
                  {session.user.status}
                </span>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 hover:text-red-700 font-medium"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
