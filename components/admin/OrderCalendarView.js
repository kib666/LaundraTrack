'use client';

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Package, Flag } from 'lucide-react';

export default function OrderCalendarView({ orders }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startDay });

  const ordersByDate = {};
  orders.forEach(order => {
    const arrivalDate = new Date(order.createdAt).toDateString();
    const etaDate = new Date(order.eta).toDateString();
    
    if (!ordersByDate[arrivalDate]) ordersByDate[arrivalDate] = [];
    ordersByDate[arrivalDate].push({ ...order, type: 'arrival' });

    if (!ordersByDate[etaDate]) ordersByDate[etaDate] = [];
    ordersByDate[etaDate].push({ ...order, type: 'eta' });
  });

  const changeMonth = (offset) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Calendar className="mr-2" /> Order Calendar
        </h2>
        <div className="flex items-center space-x-2">
          <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          <span className="text-lg font-medium">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 border-t border-l">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center py-2 bg-gray-50 text-xs font-semibold uppercase text-gray-600">{day}</div>
        ))}
        {emptyDays.map((_, i) => <div key={`empty-${i}`} className="bg-gray-50 border-r border-b"></div>)}
        {days.map(day => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dateString = date.toDateString();
          const dayOrders = ordersByDate[dateString] || [];
          return (
            <div key={day} className="relative min-h-[120px] bg-white p-2 border-r border-b">
              <span className="font-semibold text-sm">{day}</span>
              <div className="mt-1 space-y-1">
                {dayOrders.map(order => (
                  <div 
                    key={`${order.id}-${order.type}`} 
                    className={`group relative flex items-center text-xs p-1 rounded-md cursor-pointer ${order.type === 'arrival' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                  >
                    {order.type === 'arrival' ? <Package size={12} className="mr-1 flex-shrink-0" /> : <Flag size={12} className="mr-1 flex-shrink-0" />}
                    <span className="truncate">{order.user?.name || 'Walk-in Customer'}</span>
                    <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max">
                      <p><strong>{order.user?.name || 'Walk-in Customer'}</strong></p>
                      <p>{order.service}</p>
                      <p>Status: {order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 