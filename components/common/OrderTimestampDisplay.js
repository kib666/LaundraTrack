'use client';

import React, { useState } from 'react';
import { Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { formatManilaTime, formatManilaDate } from '@/lib/formatters';

/**
 * Order timestamp display component
 * Shows when order was submitted and preferred delivery info
 * with expandable details
 */
const OrderTimestampDisplay = ({ submittedAt, preferredDate, preferredTime, compact = false }) => {
  const [expanded, setExpanded] = useState(false);

  if (!submittedAt) return null;

  const submittedTimeFormatted = formatManilaTime(submittedAt);
  const preferredDateFormatted = preferredDate ? formatManilaDate(preferredDate) : null;

  if (compact) {
    return (
      <div className="flex items-center text-xs text-gray-600 gap-2">
        <Clock size={14} className="text-gray-500 flex-shrink-0" />
        <span>Ordered: {submittedTimeFormatted}</span>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white transition-colors"
      >
        <div className="flex items-start gap-3">
          <Clock size={18} className="text-blue-500 flex-shrink-0 mt-1" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">Order Timeline</p>
            <p className="text-xs text-gray-600 mt-1">Submitted: {submittedTimeFormatted}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t bg-white px-4 py-3 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Submitted Time */}
            <div className="flex items-start gap-2">
              <Clock size={16} className="text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Order Placed
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">{submittedTimeFormatted}</p>
              </div>
            </div>

            {/* Preferred Date & Time */}
            {(preferredDateFormatted || preferredTime) && (
              <div className="flex items-start gap-2 bg-green-50 p-2 rounded border border-green-200">
                <Calendar size={16} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Preferred Delivery
                  </p>
                  <div className="mt-1 space-y-1">
                    {preferredDateFormatted && (
                      <p className="text-sm font-medium text-gray-900">{preferredDateFormatted}</p>
                    )}
                    {preferredTime && (
                      <p className="text-sm text-green-700 font-medium">⏰ {preferredTime}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimestampDisplay;
