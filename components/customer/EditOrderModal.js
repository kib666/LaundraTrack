'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Loader } from 'lucide-react';

const EditOrderModal = ({ order, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    serviceType: 'wash',
    weight: 0,
    preferredDate: '',
    preferredTime: 'Morning',
    fulfillmentType: 'pickup',
    pickupAddress: '',
    deliveryAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (order && isOpen) {
      // Preferred time is now stored as "Morning", "Afternoon", or "Night"
      const preferredTime = order.preferredTime || 'Morning';

      setFormData({
        serviceType: order.serviceType || 'wash',
        weight: order.weight || 0,
        preferredDate: order.preferredDate
          ? new Date(order.preferredDate).toISOString().split('T')[0]
          : '',
        preferredTime,
        fulfillmentType: order.fulfillmentType || 'pickup',
        pickupAddress: order.pickupAddress || '',
        deliveryAddress: order.deliveryAddress || '',
      });
      setError('');
      setSuccess('');
    }
  }, [order, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Preferred time is already in the correct format (Morning/Afternoon/Night)
      const response = await fetch(`/api/orders/${order._id}/edit-details`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update order');
        return;
      }

      setSuccess('Order updated successfully!');
      setTimeout(() => {
        onSave(data.order);
        onClose();
      }, 1500);
    } catch (err) {
      setError('Error updating order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Edit Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="wash">Wash</option>
              <option value="dry-clean">Dry Clean</option>
              <option value="iron">Iron</option>
              <option value="combo">Combo</option>
            </select>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="0.5"
              step="0.5"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preferred Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Time Period
            </label>
            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Night">Night</option>
            </select>
          </div>

          {/* Fulfillment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fulfillment Type</label>
            <select
              name="fulfillmentType"
              value={formData.fulfillmentType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          {/* Pickup Address */}
          {formData.fulfillmentType === 'pickup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
              <input
                type="text"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                placeholder="Enter pickup address"
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Delivery Address */}
          {formData.fulfillmentType === 'delivery' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address *
              </label>
              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                placeholder="Enter delivery address"
                required={formData.fulfillmentType === 'delivery'}
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;
