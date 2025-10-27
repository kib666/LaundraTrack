'use client';

import React, { useState } from 'react';
import { AlertTriangle, Lock, Mail, Eye, EyeOff, Loader } from 'lucide-react';
import Modal from './Modal';

export default function SuperAdminLoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/superadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store the token
        localStorage.setItem('superadminToken', data.token);
        // Redirect to super admin dashboard
        window.location.href = '/superadmin';
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Super Admin Login">
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="super@gmail.com"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={18} />
                <span>Logging in...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
