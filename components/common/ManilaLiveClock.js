'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

/**
 * Live clock component showing current time in Manila timezone
 * Updates every second
 */
const ManilaLiveClock = () => {
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      const manilaTime = now.toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setTime(manilaTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock size={16} />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
      <Clock size={16} className="animate-pulse" />
      <span>Philippines: {time}</span>
    </div>
  );
};

export default ManilaLiveClock;
