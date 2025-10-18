'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { Shield, Loader } from 'lucide-react';

export default function SuperAdminLogin() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated as superadmin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'superadmin') {
      window.location.href = '/superadmin';
    } else if (status === 'authenticated' && session?.user?.role !== 'superadmin') {
      // If logged in but not superadmin, redirect based on role
      switch (session?.user?.role) {
        case 'admin':
          window.location.href = '/admin';
          break;
        case 'staff':
          window.location.href = '/staff';
          break;
        case 'customer':
          window.location.href = '/customer';
          break;
        default:
          break;
      }
    }
  }, [session, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error || 'Invalid email or password.');
        setIsLoading(false);
      } else if (result?.ok) {
        // Session will be updated, useEffect will redirect
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-500 p-4 rounded-lg">
              <Shield className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin Portal</h1>
          <p className="text-gray-600">Manage your laundry business</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg border p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="superadmin@laundry.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-500 text-white py-3 rounded-lg font-medium hover:bg-indigo-600 disabled:bg-indigo-300 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-sm text-indigo-900">
              <span className="font-semibold">Default Credentials:</span>
              <br />
              Email: superadmin@laundry.com
              <br />
              Password: SuperAdmin@123
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have admin access? Contact your system administrator.
        </p>
      </div>
    </div>
  );
}
