'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { X, Loader } from 'lucide-react';
import Modal from './Modal';

const PortalAuthModal = ({ isOpen, portalType, onClose }) => {
  const { data: session, status } = useSession();
  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasJustLoggedIn, setHasJustLoggedIn] = useState(false);

  // Portal role mapping
  const portalRoleMap = {
    customer: 'customer',
    staff: 'staff',
    admin: 'admin',
  };

  const portalTitles = {
    customer: 'Customer Portal',
    staff: 'Staff Portal',
    admin: 'Admin Portal',
  };

  const portalDescriptions = {
    customer: 'Track your orders and manage your laundry services',
    staff: 'View assigned tasks and manage daily operations',
    admin: 'Manage orders, staff, and business operations',
  };

  // Admin portal does not allow registration (only sign in)
  const allowRegistration = portalType !== 'admin';

  // Force sign-in only for admin portal
  useEffect(() => {
    if (!allowRegistration && isRegister) {
      setIsRegister(false);
    }
  }, [allowRegistration, isRegister]);

  // Reset hasJustLoggedIn when modal opens or portal changes
  useEffect(() => {
    if (isOpen) {
      setHasJustLoggedIn(false);
    }
  }, [isOpen, portalType]);

  // Auto-redirect on successful login/registration only
  useEffect(() => {
    if (session?.user?.role && hasJustLoggedIn && isOpen) {
      const redirectDelay = setTimeout(() => {
        // Map user role to appropriate portal
        const roleRedirectMap = {
          admin: '/admin',
          staff: '/staff',
          customer: '/customer',
        };

        const redirectUrl = roleRedirectMap[session.user.role];
        if (redirectUrl) {
          setHasJustLoggedIn(false);
          onClose();
          window.location.href = redirectUrl;
        }
      }, 1500);

      return () => clearTimeout(redirectDelay);
    }
  }, [session?.user?.role, hasJustLoggedIn, isOpen, onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error || 'Invalid email or password.');
        setHasJustLoggedIn(false);
      } else if (result?.ok) {
        setSuccess('Login successful! Redirecting to your dashboard...');
        setEmail('');
        setPassword('');
        // Set flag to trigger redirect in useEffect
        setHasJustLoggedIn(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setHasJustLoggedIn(false);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Prevent registration if not allowed (e.g., admin portal)
    if (!allowRegistration) {
      setError('Registration is not available for this portal. Please sign in instead.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
          confirmPassword,
          role: portalRoleMap[portalType] || 'customer',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Registration successful! Logging you in...');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');

        // Auto-login after successful registration
        setTimeout(() => {
          handleLogin(new Event('submit', { bubbles: true }));
        }, 1000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
        setHasJustLoggedIn(false);
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      setHasJustLoggedIn(false);
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setIsRegister(false);
    setHasJustLoggedIn(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{portalTitles[portalType]}</h2>
            <p className="text-sm text-gray-600 mt-1">{portalDescriptions[portalType]}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 flex items-center">
              <Loader className="animate-spin mr-2" size={16} />
              {success}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
          {/* Register Fields */}
          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={isRegister}
                  disabled={isLoading || success}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={isRegister}
                  disabled={isLoading || success}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100"
                />
              </div>
            </>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading || success}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100"
          />

          {/* Phone (Register only) */}
          {isRegister && (
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required={isRegister}
              disabled={isLoading || success}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100"
            />
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading || success}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100"
          />

          {/* Confirm Password (Register only) */}
          {isRegister && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={isRegister}
              disabled={isLoading || success}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100"
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader className="animate-spin" size={16} />}
            {success ? 'Redirecting...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Register/Login */}
        {allowRegistration && (
          <div className="mt-6 text-center border-t pt-6">
            <p className="text-sm text-gray-600">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                  setSuccess('');
                }}
                disabled={isLoading || success}
                className="ml-2 text-blue-600 hover:text-blue-700 font-semibold disabled:text-gray-400"
              >
                {isRegister ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        )}

        {/* Admin Portal Notice */}
        {!allowRegistration && (
          <div className="mt-6 text-center border-t pt-6">
            <p className="text-xs text-gray-500">
              Admin accounts are created by Super Admins only. <br />
              Please sign in with your admin credentials.
            </p>
          </div>
        )}

        {/* Portal Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-700">
            <span className="font-semibold">📌 Tip:</span> Your role ({portalRoleMap[portalType]})
            will be verified during authentication. Only authorized users can access this portal.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default PortalAuthModal;
