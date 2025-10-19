'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Package,
  Truck,
  CalendarDays,
  Clock,
  X,
  Loader,
  LogIn,
  UserPlus,
  History,
  PlusCircle,
  Shield,
  Users,
  User as UserIcon,
  Edit,
  RotateCcw,
} from 'lucide-react';
import StatusProgressTracker from '@/components/customer/StatusProgressTracker';
import StatusBadge from '@/components/common/StatusBadge';
import EditOrderModal from '@/components/customer/EditOrderModal';
import UserProfileDropdown from '@/components/common/UserProfileDropdown';
import OrderTimestampDisplay from '@/components/common/OrderTimestampDisplay';

const broadcastOrderUpdate = () => {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
    return;
  }
  const channel = new BroadcastChannel('orders-sync');
  channel.postMessage({ type: 'ORDERS_UPDATED', source: 'customer' });
  channel.close();
};

const OrderLookupForm = ({ onLookup, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onLookup(searchTerm.trim(), 'phone');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Track Your Order</h2>
        <Package className="text-blue-500" size={24} />
      </div>
      <p className="text-gray-600 mb-4">Enter your phone number to track your laundry.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={'Enter your phone number'}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'Tracking...' : 'Track Order'}
        </button>
      </form>
    </div>
  );
};

const OrderDetails = ({ orders, onBack, onCancel, onOrderUpdate }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);
  const [undoLoading, setUndoLoading] = useState(null);

  // Handle single order or array of orders
  const orderList = Array.isArray(orders) ? orders : [orders];
  const customer = orderList[0]?.user || {};

  const canCancelOrder = (status) => {
    // Can only cancel if status is PENDING
    return status === 'PENDING';
  };

  const canEditOrder = (status) => {
    // Can edit if status is PENDING or CONFIRMED
    return status === 'PENDING' || status === 'CONFIRMED';
  };

  const canUndoCancel = (status) => {
    // Can undo if status is CANCELLED
    return status === 'CANCELLED';
  };

  const handleEditClick = (order) => {
    setSelectedOrderForEdit(order);
    setEditModalOpen(true);
  };

  const handleEditSave = (updatedOrder) => {
    // Update the order in the list
    if (onOrderUpdate) onOrderUpdate(updatedOrder);
  };

  const handleUndoCancel = async (orderId) => {
    setUndoLoading(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/undo-cancel`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to undo cancellation');
        return;
      }

      // Update the order
      if (onOrderUpdate) onOrderUpdate(data.order);
    } catch (error) {
      alert('Error undoing cancellation: ' + error.message);
    } finally {
      setUndoLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
          <p className="text-sm text-gray-600 mt-1">
            Customer: <span className="font-medium">{customer.firstName || customer.name}</span> •
            Phone: <span className="font-mono">{customer.phoneNumber || customer.phone}</span>
          </p>
        </div>
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {orderList.map((order) => (
          <div key={order.id}>
            <button
              onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
              className="w-full text-left bg-gray-50 border rounded-lg p-4 transition-all hover:shadow-md hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg text-gray-800">
                    ₱{order.total ? order.total.toFixed(2) : '0.00'}
                  </p>
                  <p className="text-xs text-gray-400 font-mono mt-1">{order.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="text-gray-400 text-lg">
                    {expandedOrderId === order.id ? '▼' : '▶'}
                  </span>
                </div>
              </div>
              <div className="mt-3 border-t pt-3 space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Package size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                  <span>
                    {order.weight || '0'} kg - {order.service || order.serviceType}
                  </span>
                </div>
                {order.deliveryAddress && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Truck size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-700">
                  <CalendarDays size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                  <span>
                    {new Date(order.eta || order.deliveryDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {order.submittedAt && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>
                      Submitted:{' '}
                      {new Date(order.submittedAt).toLocaleString('en-US', {
                        timeZone: 'Asia/Manila',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                      })}
                    </span>
                  </div>
                )}
                {order.preferredTime && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>Preferred: {order.preferredTime}</span>
                  </div>
                )}
              </div>
            </button>

            {expandedOrderId === order.id && (
              <div className="mt-2 border border-t-0 rounded-b-lg p-4 bg-white space-y-4">
                <StatusProgressTracker
                  status={order.status}
                  eta={order.eta || order.deliveryDate}
                  fulfillmentType={order.fulfillmentType}
                >
                  <p className="text-sm text-blue-700">
                    Expected delivery:{' '}
                    {new Date(order.eta || order.deliveryDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </StatusProgressTracker>
                {(canEditOrder(order.status) ||
                  canCancelOrder(order.status) ||
                  canUndoCancel(order.status)) && (
                  <div className="pt-4 border-t space-y-2">
                    {canEditOrder(order.status) && (
                      <button
                        onClick={() => handleEditClick(order)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                        Edit Order Details
                      </button>
                    )}
                    {canCancelOrder(order.status) && (
                      <button
                        onClick={() => onCancel && onCancel(order.id, order.status)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                    {canUndoCancel(order.status) && (
                      <button
                        onClick={() => handleUndoCancel(order.id)}
                        disabled={undoLoading === order.id}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:bg-green-300 flex items-center justify-center gap-2"
                      >
                        {undoLoading === order.id ? (
                          <>
                            <Loader size={16} className="animate-spin" />
                            Restoring...
                          </>
                        ) : (
                          <>
                            <RotateCcw size={16} />
                            Restore Order
                          </>
                        )}
                      </button>
                    )}
                    {canCancelOrder(order.status) && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Once the order is in progress, it cannot be cancelled.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedOrderForEdit && (
        <EditOrderModal
          order={selectedOrderForEdit}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedOrderForEdit(null);
          }}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

const AuthForm = ({ isRegister = false }) => {
  const { data: session } = useSession();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect based on role after login
  useEffect(() => {
    if (session?.user?.role) {
      const redirectDelay = setTimeout(() => {
        switch (session.user.role) {
          case 'admin':
            window.location.href = '/admin';
            break;
          case 'staff':
            window.location.href = '/staff';
            break;
          case 'customer':
            // Refresh page to show customer dashboard
            window.location.href = '/customer';
            break;
          default:
            break;
        }
      }, 1000);
      return () => clearTimeout(redirectDelay);
    }
  }, [session?.user?.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (isRegister) {
      // Handle registration
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
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registration successful! Please log in.');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Registration failed.');
      }
    } else {
      // Handle login
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error || 'Invalid email or password.');
      } else if (result?.ok) {
        setSuccess('Login successful! Redirecting to your dashboard...');
        // Clear the form - redirect will happen via useEffect when session updates
        setEmail('');
        setPassword('');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {!isRegister && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
            <UserIcon className="text-blue-500 mx-auto mb-2" size={24} />
            <p className="text-xs font-semibold text-gray-800">Customer</p>
            <p className="text-xs text-gray-600 mt-1">Track orders</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
            <Users className="text-green-500 mx-auto mb-2" size={24} />
            <p className="text-xs font-semibold text-gray-800">Staff</p>
            <p className="text-xs text-gray-600 mt-1">Manage tasks</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
            <Shield className="text-purple-500 mx-auto mb-2" size={24} />
            <p className="text-xs font-semibold text-gray-800">Admin</p>
            <p className="text-xs text-gray-600 mt-1">Full control</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>
        {!isRegister && (
          <p className="text-sm text-gray-600 mb-4">Login to your account to access the system</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full p-3 border rounded-lg text-gray-900"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-3 border rounded-lg text-gray-900"
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg text-gray-900"
          />
          {isRegister && (
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-gray-900"
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg text-gray-900"
          />
          {isRegister && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-gray-900"
            />
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {isLoading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm mt-2 bg-green-50 p-3 rounded-lg">{success}</p>
          )}
        </form>

        {!isRegister && (
          <p className="text-xs text-gray-500 text-center mt-4">
            Don't have an account?{' '}
            <button
              onClick={() => window.location.reload()}
              className="text-blue-500 hover:underline"
            >
              Create one
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

// Pricing structure and options - moved outside component to avoid recreation
const PRICING_STRUCTURE = {
  8: {
    wash: 60,
    dry: 60,
    fold: 25,
  },
  12: {
    wash: 75,
    dry: 75,
    fold: 30,
  },
};

const INCLUSION_PRICES = {
  liquidDetergent: 20,
  downy: 10,
  plastic: 5,
};

const SERVICE_OPTIONS = [
  { value: 'wash', label: 'Wash' },
  { value: 'washAndDry', label: 'Wash and Dry' },
  { value: 'fullService', label: 'Full Service (Wash, Dry, and Fold)' },
];

const WEIGHT_OPTIONS = [8, 12];

const NewOrderForm = ({ onOrderCreated }) => {
  const { data: session } = useSession();
  const [weight, setWeight] = useState('');
  const [serviceType, setServiceType] = useState('wash');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState('pickup');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [isAddOnsOpen, setIsAddOnsOpen] = useState(false);
  const [inclusions, setInclusions] = useState({
    liquidDetergent: 0,
    downy: 0,
    plastic: 0,
  });

  // Calculate total price
  useEffect(() => {
    const calculatePrice = () => {
      if (!weight || !serviceType) {
        setEstimatedPrice(0);
        return;
      }

      const w = parseInt(weight);
      const pricing = PRICING_STRUCTURE[w];

      if (!pricing) {
        setEstimatedPrice(0);
        return;
      }

      let servicePrice = 0;

      if (serviceType === 'wash') {
        servicePrice = pricing.wash;
      } else if (serviceType === 'washAndDry') {
        servicePrice = pricing.wash + pricing.dry;
      } else if (serviceType === 'fullService') {
        servicePrice = pricing.wash + pricing.dry + pricing.fold;
      }

      // Add inclusions cost
      const inclusionsCost =
        inclusions.liquidDetergent * INCLUSION_PRICES.liquidDetergent +
        inclusions.downy * INCLUSION_PRICES.downy +
        inclusions.plastic * INCLUSION_PRICES.plastic;

      // Add delivery fee if delivery is selected
      const deliveryFee = fulfillmentType === 'delivery' ? 20 : 0;

      setEstimatedPrice(servicePrice + inclusionsCost + deliveryFee);
    };

    calculatePrice();
  }, [weight, serviceType, inclusions, fulfillmentType]);

  const handleInclusionChange = (key, quantity) => {
    setInclusions((prev) => ({
      ...prev,
      [key]: Math.max(0, quantity),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!session?.user?.token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      if (!weight) {
        throw new Error('Please select a weight.');
      }

      if (!preferredDate) {
        throw new Error('Preferred date is required.');
      }

      if (!preferredTime) {
        throw new Error('Preferred time is required.');
      }

      if (estimatedPrice <= 0) {
        throw new Error('Invalid price calculation. Please refresh and try again.');
      }

      if (fulfillmentType === 'delivery' && !deliveryAddress.trim()) {
        throw new Error('Delivery address is required for delivery orders.');
      }

      const serviceName = serviceOptions.find((s) => s.value === serviceType)?.label;

      // Build items array
      const items = [];
      if (serviceType === 'wash' || serviceType === 'washAndDry' || serviceType === 'fullService') {
        items.push({
          name: `${serviceName} - ${weight}kg`,
          quantity: 1,
          price: estimatedPrice,
        });
      }

      // Map form serviceType to database enum values
      const serviceTypeMap = {
        wash: 'wash',
        washAndDry: 'combo',
        fullService: 'combo',
      };
      const mappedServiceType = serviceTypeMap[serviceType] || 'wash';

      // Log request for debugging
      const requestBody = {
        items,
        totalAmount: estimatedPrice,
        deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress.trim() : null,
        description: `${serviceName} service for ${weight}kg`,
        preferredDate,
        preferredTime,
        serviceType: mappedServiceType,
        fulfillmentType,
        weight: parseInt(weight),
        inclusions: {
          liquidDetergent: inclusions.liquidDetergent,
          downy: inclusions.downy,
          plastic: inclusions.plastic,
        },
        notes,
      };

      console.log('Order submission request:', requestBody);

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await res.json();
      console.log('Order submission response:', responseData);

      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to create order.');
      }

      setWeight('');
      setNotes('');
      setServiceType('wash');
      setDeliveryAddress('');
      setPreferredDate('');
      setPreferredTime('Morning');
      setFulfillmentType('pickup');
      setInclusions({
        liquidDetergent: 0,
        downy: 0,
        plastic: 0,
      });
      onOrderCreated();
      broadcastOrderUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 p-2 rounded-full">
          <PlusCircle className="text-green-600" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Create New Order</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Service Type</label>
          <div className="space-y-2">
            {SERVICE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ borderColor: serviceType === option.value ? '#3b82f6' : '#e5e7eb' }}
              >
                <input
                  type="radio"
                  name="serviceType"
                  value={option.value}
                  checked={serviceType === option.value}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="ml-3 text-gray-900 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Weight Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Weight (kg)</label>
          <div className="flex gap-3">
            {WEIGHT_OPTIONS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeight(w.toString())}
                className={`flex-1 p-3 rounded-lg font-medium transition-all ${
                  weight === w.toString()
                    ? 'bg-blue-600 text-white border-2 border-blue-600'
                    : 'bg-gray-100 text-gray-800 border-2 border-gray-300 hover:border-blue-400'
                }`}
              >
                {w} kg
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        {weight && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Pricing Breakdown for {weight}kg:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Wash:</span>
                <span className="font-medium">₱{pricingStructure[parseInt(weight)].wash}</span>
              </div>
              {(serviceType === 'washAndDry' || serviceType === 'fullService') && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dry:</span>
                  <span className="font-medium">₱{pricingStructure[parseInt(weight)].dry}</span>
                </div>
              )}
              {serviceType === 'fullService' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fold:</span>
                  <span className="font-medium">₱{pricingStructure[parseInt(weight)].fold}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inclusions Section - Collapsible Dropdown */}
        <div className="border-t pt-6">
          <button
            type="button"
            onClick={() => setIsAddOnsOpen(!isAddOnsOpen)}
            className="w-full p-4 bg-gray-50 border rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700">Add-ons (Optional)</span>
            <span className="text-lg text-gray-600">{isAddOnsOpen ? '−' : '+'}</span>
          </button>

          {isAddOnsOpen && (
            <div className="mt-3 space-y-3 p-4 bg-gray-50 rounded-lg border">
              {/* Liquid Detergent */}
              <div className="p-3 border bg-white rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Liquid Detergent</p>
                  <p className="text-sm text-gray-500">₱20 each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleInclusionChange('liquidDetergent', inclusions.liquidDetergent - 1)
                    }
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={inclusions.liquidDetergent}
                    onChange={(e) =>
                      handleInclusionChange('liquidDetergent', parseInt(e.target.value) || 0)
                    }
                    min="0"
                    className="w-12 text-center border rounded p-1 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleInclusionChange('liquidDetergent', inclusions.liquidDetergent + 1)
                    }
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Downy */}
              <div className="p-3 border bg-white rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Downy</p>
                  <p className="text-sm text-gray-500">₱10 each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleInclusionChange('downy', inclusions.downy - 1)}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={inclusions.downy}
                    onChange={(e) => handleInclusionChange('downy', parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-12 text-center border rounded p-1 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleInclusionChange('downy', inclusions.downy + 1)}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Plastic */}
              <div className="p-3 border bg-white rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Plastic</p>
                  <p className="text-sm text-gray-500">₱5 each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleInclusionChange('plastic', inclusions.plastic - 1)}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={inclusions.plastic}
                    onChange={(e) =>
                      handleInclusionChange('plastic', parseInt(e.target.value) || 0)
                    }
                    min="0"
                    className="w-12 text-center border rounded p-1 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleInclusionChange('plastic', inclusions.plastic + 1)}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Estimated Price */}
        {estimatedPrice > 0 && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="space-y-2 text-sm mb-3">
              {weight && (
                <>
                  <div className="flex justify-between text-gray-700">
                    <span>Service:</span>
                    <span className="font-medium">
                      ₱
                      {(() => {
                        const w = parseInt(weight);
                        const pricing = pricingStructure[w];
                        let servicePrice = 0;
                        if (serviceType === 'wash') servicePrice = pricing.wash;
                        else if (serviceType === 'washAndDry')
                          servicePrice = pricing.wash + pricing.dry;
                        else if (serviceType === 'fullService')
                          servicePrice = pricing.wash + pricing.dry + pricing.fold;
                        return servicePrice;
                      })()}
                    </span>
                  </div>
                  {(inclusions.liquidDetergent > 0 ||
                    inclusions.downy > 0 ||
                    inclusions.plastic > 0) && (
                    <div className="flex justify-between text-gray-700">
                      <span>Add-ons:</span>
                      <span className="font-medium">
                        ₱
                        {inclusions.liquidDetergent * 20 +
                          inclusions.downy * 10 +
                          inclusions.plastic * 5}
                      </span>
                    </div>
                  )}
                  {fulfillmentType === 'delivery' && (
                    <div className="flex justify-between text-gray-700">
                      <span>Delivery:</span>
                      <span className="font-medium">₱20</span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="border-t pt-2 flex justify-between">
              <p className="font-bold text-gray-800">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">₱{estimatedPrice.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Fulfillment Type */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="fulfillment-toggle"
              checked={fulfillmentType === 'delivery'}
              onChange={(e) => setFulfillmentType(e.target.checked ? 'delivery' : 'pickup')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="fulfillment-toggle" className="text-sm font-medium text-gray-700">
              Will be Delivered <span className="text-blue-600 font-semibold">+₱20</span>
            </label>
          </div>
          <p className="text-xs text-gray-600 ml-6">Maximum delivery distance: 2km from location</p>
        </div>

        {/* Delivery Address */}
        {fulfillmentType === 'delivery' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <input
              type="text"
              placeholder="Your full address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required={fulfillmentType === 'delivery'}
              className="w-full p-3 border rounded-lg text-gray-900"
            />
          </div>
        )}

        {/* Preferred Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
          <input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            required
            className="w-full p-3 border rounded-lg text-gray-900"
          />
        </div>

        {/* Preferred Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Time Period
          </label>
          <select
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            required
            className="w-full p-3 border rounded-lg text-gray-900 font-medium"
          >
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Night">Night</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
          <textarea
            placeholder="e.g., Special instructions for delicate items"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            className="w-full p-3 border rounded-lg text-gray-900"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !weight}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Submitting...' : 'Submit Order'}
        </button>

        {error && <p className="text-red-500 text-sm mt-2 p-3 bg-red-50 rounded-lg">{error}</p>}
      </form>
    </div>
  );
};

const LoggedInDashboard = ({ user }) => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [deliveryUpdates, setDeliveryUpdates] = useState({});
  const [mutatingOrderId, setMutatingOrderId] = useState(null);
  const [deliveryModal, setDeliveryModal] = useState({ isOpen: false, orderId: null, address: '' });

  const fetchOrders = useCallback(async () => {
    if (!session?.user?.token) {
      setOrders([]);
      setDeliveryUpdates({});
      setIsLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${session.user.token}` };
      const res = await fetch(`/api/orders`, { headers });
      if (res.ok) {
        const data = await res.json();
        const ordersList = data.orders || data;
        console.log('[CUSTOMER FETCH] Orders received from API:', ordersList);
        const filteredOrders = Array.isArray(ordersList)
          ? ordersList.filter((order) => {
              const customer = order.customerId || order.user || {};
              const customerId =
                typeof customer === 'string'
                  ? customer
                  : customer?._id || customer?.id || customer?.userId;
              return customerId && customerId.toString() === user.id;
            })
          : [];
        console.log('[CUSTOMER FETCH] Filtered orders:', filteredOrders);
        console.log(
          '[CUSTOMER FETCH] Weight values in orders:',
          filteredOrders.map((o) => ({ id: o.id, weight: o.weight }))
        );
        setOrders(filteredOrders);
        const nextDeliveryUpdates = {};
        filteredOrders.forEach((order) => {
          nextDeliveryUpdates[order.id] = order.deliveryAddress || '';
        });
        setDeliveryUpdates(nextDeliveryUpdates);
      } else {
        setOrders([]);
        setDeliveryUpdates({});
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setDeliveryUpdates({});
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.token, user.id]);

  const handleCancelOrder = async (orderId, orderStatus) => {
    if (orderStatus !== 'PENDING') {
      alert('This order cannot be cancelled. Only pending orders can be cancelled.');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    if (!session?.user?.token) {
      alert('Authentication token missing. Please log in again.');
      return;
    }

    try {
      setMutatingOrderId(orderId);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (response.ok) {
        alert('Order cancelled successfully');
        broadcastOrderUpdate();
        fetchOrders();
      } else {
        const data = await response.json();
        alert(data?.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Error canceling order');
    } finally {
      setMutatingOrderId(null);
    }
  };

  const handleToggleFulfillment = async (order, fulfillmentType) => {
    if (!session?.user?.token) {
      alert('Authentication token missing. Please log in again.');
      return;
    }

    // If switching to delivery, open modal to get address
    if (fulfillmentType === 'delivery') {
      setDeliveryModal({
        isOpen: true,
        orderId: order.id,
        address: order.deliveryAddress || '',
      });
      return;
    }

    // If switching to pickup
    try {
      setMutatingOrderId(order.id);
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({
          fulfillmentType: 'pickup',
          pickupAddress: 'Customer Drop-off',
        }),
      });
      if (response.ok) {
        alert('Order updated to pickup');
        broadcastOrderUpdate();
        fetchOrders();
      } else {
        const data = await response.json();
        alert(data?.message || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error toggling fulfillment:', error);
      alert('Error updating order');
    } finally {
      setMutatingOrderId(null);
    }
  };

  const handleDeliveryAddressSubmit = async () => {
    if (!session?.user?.token) {
      alert('Authentication token missing. Please log in again.');
      return;
    }

    if (!deliveryModal.address.trim()) {
      alert('Please enter a delivery address');
      return;
    }

    try {
      setMutatingOrderId(deliveryModal.orderId);
      const response = await fetch(`/api/orders/${deliveryModal.orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({
          fulfillmentType: 'delivery',
          deliveryAddress: deliveryModal.address.trim(),
        }),
      });
      if (response.ok) {
        alert('Order updated to delivery with address provided');
        setDeliveryModal({ isOpen: false, orderId: null, address: '' });
        broadcastOrderUpdate();
        fetchOrders();
      } else {
        const data = await response.json();
        alert(data?.message || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating delivery address:', error);
      alert('Error updating order');
    } finally {
      setMutatingOrderId(null);
    }
  };

  const handleDeliveryAddressUpdate = async (orderId, address) => {
    if (!session?.user?.token) {
      alert('Authentication token missing. Please log in again.');
      return;
    }

    if (!address.trim()) {
      return;
    }

    try {
      setMutatingOrderId(orderId);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({
          deliveryAddress: address.trim(),
        }),
      });
      if (response.ok) {
        broadcastOrderUpdate();
        fetchOrders();
      } else {
        const data = await response.json();
        alert(data?.message || 'Failed to update address');
      }
    } catch (error) {
      console.error('Error updating delivery address:', error);
      alert('Error updating address');
    } finally {
      setMutatingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 5000);
    let channel;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('orders-sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'ORDERS_UPDATED' && event.data?.source !== 'customer') {
          fetchOrders();
        }
      };
    }

    return () => {
      clearInterval(interval);
      if (channel) {
        channel.close();
      }
    };
  }, [fetchOrders]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, <span className="text-blue-600">{user.name.split(' ')[0]}</span>!
          </h1>
          <div className="flex items-center gap-6">
            <UserProfileDropdown />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2">
          <NewOrderForm userId={user.id} onOrderCreated={fetchOrders} />
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-full">
                <History className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Your Order History</h2>
            </div>
            {isLoading ? (
              <div className="text-center py-10">
                <Loader className="animate-spin text-blue-500 mx-auto" size={32} />
                <p className="mt-2 text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((order) => (
                    <div key={order.id}>
                      <button
                        onClick={() =>
                          setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                        }
                        className="w-full text-left bg-gray-50 border rounded-lg p-4 transition-all hover:shadow-md hover:border-blue-200 hover:bg-blue-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-lg text-gray-800">
                              ₱{order.total.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400 font-mono mt-1">{order.id}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={order.status} />
                            <span className="text-gray-400 text-lg">
                              {expandedOrderId === order.id ? '▼' : '▶'}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 border-t pt-3 space-y-2">
                          <div className="flex items-center text-sm text-gray-700">
                            <Package size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                            <span>
                              {(order.weight || 0).toString()}kg -{' '}
                              {order.serviceType || order.service}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <Truck size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                            <span>
                              {order.fulfillmentType === 'delivery'
                                ? order.deliveryAddress || 'Delivery address pending'
                                : 'Customer will drop off items'}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <CalendarDays size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                            <span>
                              {order.preferredDate
                                ? new Date(order.preferredDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : 'Preferred date pending'}
                            </span>
                          </div>
                        </div>
                      </button>

                      {expandedOrderId === order.id && (
                        <div className="mt-2 border border-t-0 rounded-b-lg p-4 bg-white space-y-4">
                          {/* Order Timeline & Timestamps */}
                          <OrderTimestampDisplay
                            submittedAt={order.submittedAt}
                            preferredDate={order.preferredDate}
                            preferredTime={order.preferredTime}
                            compact={false}
                          />

                          <StatusProgressTracker
                            status={order.status}
                            eta={order.preferredDate}
                            fulfillmentType={order.fulfillmentType}
                          >
                            <p className="text-sm text-blue-700">
                              Preferred date:{' '}
                              {order.preferredDate
                                ? new Date(order.preferredDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : 'Pending'}
                            </p>
                          </StatusProgressTracker>
                          {['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(order.status) && (
                            <div className="pt-4 border-t space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                  onClick={() => handleToggleFulfillment(order, 'pickup')}
                                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors border ${
                                    order.fulfillmentType === 'pickup'
                                      ? 'bg-blue-500 text-white border-blue-500'
                                      : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                                  } ${mutatingOrderId === order.id ? 'opacity-70 cursor-wait' : ''}`}
                                  disabled={mutatingOrderId === order.id}
                                >
                                  Switch to Pickup
                                </button>
                                <button
                                  onClick={() => handleToggleFulfillment(order, 'delivery')}
                                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors border ${
                                    order.fulfillmentType === 'delivery'
                                      ? 'bg-blue-500 text-white border-blue-500'
                                      : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                                  } ${mutatingOrderId === order.id ? 'opacity-70 cursor-wait' : ''}`}
                                  disabled={mutatingOrderId === order.id}
                                >
                                  Switch to Delivery
                                </button>
                                {order.fulfillmentType === 'delivery' &&
                                  deliveryUpdates[order.id] !== undefined && (
                                    <input
                                      type="text"
                                      placeholder="Update delivery address"
                                      value={deliveryUpdates[order.id]}
                                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm"
                                      onChange={(e) =>
                                        setDeliveryUpdates((prev) => ({
                                          ...prev,
                                          [order.id]: e.target.value,
                                        }))
                                      }
                                      onBlur={() =>
                                        handleDeliveryAddressUpdate(
                                          order.id,
                                          deliveryUpdates[order.id],
                                          order.status
                                        )
                                      }
                                    />
                                  )}
                              </div>
                              {order.status === 'PENDING' && (
                                <button
                                  onClick={() => handleCancelOrder(order.id, order.status)}
                                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                  Cancel Order
                                </button>
                              )}
                              <p className="text-xs text-gray-500 text-center">
                                {order.status === 'PENDING'
                                  ? 'Updates are instant while the order remains pending.'
                                  : 'You can change delivery type until the order is completed.'}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <Package className="mx-auto text-gray-400" size={40} />
                <p className="mt-2 text-gray-600">You have no orders yet.</p>
                <p className="text-sm text-gray-500">Create a new one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delivery Address Modal */}
      {deliveryModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Enter Delivery Address</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide your delivery address to switch this order to delivery.
            </p>
            <textarea
              value={deliveryModal.address}
              onChange={(e) =>
                setDeliveryModal((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              placeholder="Enter your full delivery address"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setDeliveryModal({ isOpen: false, orderId: null, address: '' })}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeliveryAddressSubmit}
                disabled={
                  !deliveryModal.address.trim() || mutatingOrderId === deliveryModal.orderId
                }
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
              >
                {mutatingOrderId === deliveryModal.orderId ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CustomerPortal = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('track'); // track, login, register
  const [view, setView] = useState('lookup'); // 'lookup', 'details'
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect admin and staff users to their portals
  useEffect(() => {
    if (session?.user?.role && status === 'authenticated') {
      const redirectDelay = setTimeout(() => {
        if (session.user.role === 'admin') {
          window.location.href = '/admin';
        } else if (session.user.role === 'staff') {
          window.location.href = '/staff';
        }
      }, 500);
      return () => clearTimeout(redirectDelay);
    }
  }, [session?.user?.role, status]);

  const handleOrderLookup = async (searchTerm, type) => {
    setIsLoading(true);
    setError('');
    setOrder(null);
    try {
      const response = await fetch(`/api/orders/lookup?type=${type}&q=${searchTerm}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Order not found');
      }
      const data = await response.json();
      setOrder(data);
      setView('details');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const backToLookup = () => {
    setOrder(null);
    setError('');
    setView('lookup');
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (response.ok) {
        setOrder(null);
        setError('');
        setView('lookup');
        alert('Order cancelled successfully');
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Error canceling order');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  // If user is admin or staff, show loading while redirecting
  if (session?.user?.role && (session.user.role === 'admin' || session.user.role === 'staff')) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <Loader className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-gray-600 font-medium">
          {session.user.role === 'admin'
            ? 'Redirecting to Admin Dashboard...'
            : 'Redirecting to Staff Portal...'}
        </p>
      </div>
    );
  }

  if (session) {
    return <LoggedInDashboard user={session.user} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'track' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            <Package size={18} />
            <span>Track</span>
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'login' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 flex items-center space-x-2 ${activeTab === 'register' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            <UserPlus size={18} />
            <span>Register</span>
          </button>
        </div>

        {activeTab === 'track' && (
          <div>
            {view === 'lookup' && (
              <OrderLookupForm onLookup={handleOrderLookup} isLoading={isLoading} />
            )}
            {view === 'details' && order && (
              <OrderDetails orders={order} onBack={backToLookup} onCancel={handleCancelOrder} />
            )}
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
          </div>
        )}
        {activeTab === 'login' && <AuthForm />}
        {activeTab === 'register' && <AuthForm isRegister />}
      </div>
    </div>
  );
};

export default CustomerPortal;
