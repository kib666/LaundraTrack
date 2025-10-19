'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MoreVertical, Trash2, RotateCcw, AlertCircle, Loader } from 'lucide-react';

const OrderCardMenu = ({ orderId, orderStatus, onDelete, onRevert }) => {
  const { data: session, status: sessionStatus } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const menuRef = useRef(null);

  // Determine which actions are available based on status
  const canRevert = orderStatus && orderStatus !== 'pending' && orderStatus !== 'cancelled';
  const canDelete = true; // Can always delete

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (
      !window.confirm('Are you sure you want to delete this order? This action cannot be undone.')
    ) {
      return;
    }

    // Check session status
    if (sessionStatus === 'unauthenticated') {
      setError('Your session has expired. Please log in again.');
      return;
    }

    if (sessionStatus === 'loading') {
      setError('Session is still loading. Please wait...');
      return;
    }

    if (!session?.user?.token) {
      console.error('Token missing - Session:', session);
      setError('Authentication token not found. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = session.user.token;
      console.log('[STAFF DELETE] Token present:', !!token);
      if (token) {
        console.log('[STAFF DELETE] Token length:', token.length);
        console.log('[STAFF DELETE] Token starts with:', token.substring(0, 20));
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      console.log(
        '[STAFF DELETE] Request headers:',
        JSON.stringify({ ...headers, Authorization: 'Bearer [REDACTED]' })
      );

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers,
      });

      console.log('[STAFF DELETE] Response status:', response.status);
      const data = await response.json();
      console.log('[STAFF DELETE] Response data:', data);

      if (!response.ok) {
        console.error('[STAFF DELETE] Failed with status', response.status, ':', data);
        setError(data.message || 'Failed to delete order');
        return;
      }

      onDelete(orderId);
      setIsOpen(false);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Error deleting order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async () => {
    if (!window.confirm('Are you sure you want to revert this order to the previous status?')) {
      return;
    }

    // Check session status
    if (sessionStatus === 'unauthenticated') {
      setError('Your session has expired. Please log in again.');
      return;
    }

    if (sessionStatus === 'loading') {
      setError('Session is still loading. Please wait...');
      return;
    }

    if (!session?.user?.token) {
      console.error('Token missing - Session:', session);
      setError('Authentication token not found. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = session.user.token;
      console.log('[STAFF REVERT] Token present:', !!token);
      if (token) {
        console.log('[STAFF REVERT] Token length:', token.length);
        console.log('[STAFF REVERT] Token starts with:', token.substring(0, 20));
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      console.log(
        '[STAFF REVERT] Request headers:',
        JSON.stringify({ ...headers, Authorization: 'Bearer [REDACTED]' })
      );

      const response = await fetch(`/api/orders/${orderId}/revert-status`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });

      console.log('[STAFF REVERT] Response status:', response.status);
      const data = await response.json();
      console.log('[STAFF REVERT] Response data:', data);

      if (!response.ok) {
        console.error('[STAFF REVERT] Failed with status', response.status, ':', data);
        setError(data.message || 'Failed to revert order status');
        return;
      }

      onRevert(orderId, data.order);
      setIsOpen(false);
    } catch (err) {
      console.error('Revert error:', err);
      setError('Error reverting status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        title="More options"
      >
        <MoreVertical size={18} className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {error && (
            <div className="p-3 m-2 bg-red-50 border border-red-200 rounded flex items-start gap-2 text-xs">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={14} />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {canRevert && (
            <button
              onClick={handleRevert}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b disabled:opacity-50"
            >
              {loading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <RotateCcw size={16} className="text-blue-500" />
              )}
              <span>Revert Progress</span>
            </button>
          )}

          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
              <span>Delete Order</span>
            </button>
          )}

          {!canRevert && !canDelete && (
            <div className="px-4 py-2 text-xs text-gray-500">No actions available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCardMenu;
