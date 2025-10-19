'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Calendar, ChevronLeft, ChevronRight, Clock, Truck, Package } from 'lucide-react';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });

const getStatusDisplay = (status) => {
  const mappings = {
    PENDING: { text: 'Pending', color: 'bg-yellow-500' },
    IN_PROGRESS: { text: 'In Progress', color: 'bg-blue-500' },
    COMPLETED: { text: 'Ready', color: 'bg-green-500' },
    DELIVERED: { text: 'Delivered', color: 'bg-purple-500' },
    CANCELLED: { text: 'Cancelled', color: 'bg-red-500' },
    DELETED: { text: 'Deleted', color: 'bg-gray-500' },
  };
  return mappings[status] || { text: status, color: 'bg-gray-500' };
};

const buildEvents = (orders, filterStart, filterEnd) => {
  return orders.flatMap((order) => {
    const pickup = order.pickupDate;
    const delivery = order.deliveryDate || order.eta;
    const customer = order.customerId || {};
    const customerName =
      typeof customer === 'string'
        ? 'Walk-in Customer'
        : `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Walk-in Customer';

    const events = [];

    // Only add pickup event if it has a date and falls within the filter range
    if (pickup) {
      const pickupDate = new Date(pickup);
      if (!filterStart || !filterEnd || (pickupDate >= filterStart && pickupDate < filterEnd)) {
        events.push({
          id: `${order.id || order._id}-pickup`,
          title: `${customerName} • Pickup`,
          start: pickup,
          extendedProps: {
            type: 'pickup',
            status: order.status,
            total: order.totalAmount || order.total,
          },
        });
      }
    }

    // Only add delivery event if it has a date and falls within the filter range
    if (delivery) {
      const deliveryDate = new Date(delivery);
      if (!filterStart || !filterEnd || (deliveryDate >= filterStart && deliveryDate < filterEnd)) {
        events.push({
          id: `${order.id || order._id}-delivery`,
          title: `${customerName} • Delivery`,
          start: delivery,
          extendedProps: {
            type: 'delivery',
            status: order.status,
            total: order.totalAmount || order.total,
          },
        });
      }
    }

    return events;
  });
};

const CalendarSummary = ({ orders, currentRange }) => {
  const summary = useMemo(() => {
    const stats = {
      total: 0,
      pickup: 0,
      delivery: 0,
      inProgress: 0,
    };

    const rangeStart = currentRange?.start ? new Date(currentRange.start) : null;
    const rangeEnd = currentRange?.end ? new Date(currentRange.end) : null;

    orders.forEach((order) => {
      const pickupDate = order.pickupDate ? new Date(order.pickupDate) : null;
      const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate) : null;

      const isWithinRange = (date) =>
        date && rangeStart && rangeEnd && date >= rangeStart && date < rangeEnd;

      if (isWithinRange(pickupDate)) {
        stats.total += 1;
        stats.pickup += 1;
      }

      if (isWithinRange(deliveryDate)) {
        stats.total += 1;
        stats.delivery += 1;
      }

      if (
        order.status === 'IN_PROGRESS' &&
        (isWithinRange(pickupDate) || isWithinRange(deliveryDate))
      ) {
        stats.inProgress += 1;
      }
    });

    return stats;
  }, [orders, currentRange]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-600">
          <Calendar size={18} />
          <span className="font-medium">Total events</span>
        </div>
        <p className="text-3xl font-semibold text-blue-800 mt-2">{summary.total}</p>
      </div>
      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-yellow-600">
          <Clock size={18} />
          <span className="font-medium">Pickups</span>
        </div>
        <p className="text-3xl font-semibold text-yellow-800 mt-2">{summary.pickup}</p>
      </div>
      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-green-600">
          <Truck size={18} />
          <span className="font-medium">Deliveries</span>
        </div>
        <p className="text-3xl font-semibold text-green-800 mt-2">{summary.delivery}</p>
        <p className="text-xs text-green-700 mt-1">{summary.inProgress} in-progress</p>
      </div>
    </div>
  );
};

export default function OrderCalendarView({ orders }) {
  const calendarRef = useRef(null);
  const [currentRange, setCurrentRange] = useState(null);
  const [displayDate, setDisplayDate] = useState(new Date());

  const events = useMemo(() => {
    const filterStart = currentRange?.start ? new Date(currentRange.start) : null;
    const filterEnd = currentRange?.end ? new Date(currentRange.end) : null;
    return buildEvents(orders, filterStart, filterEnd);
  }, [orders, currentRange]);

  const handleDateClick = (direction) => {
    if (!calendarRef.current || !calendarRef.current.getApi) {
      return;
    }
    const api = calendarRef.current.getApi();
    if (direction === 'prev') {
      api.prev();
    } else if (direction === 'next') {
      api.next();
    }
    updateRange(api);
  };

  const updateRange = (api) => {
    const viewInstance = api.view;
    setCurrentRange({ start: viewInstance.currentStart, end: viewInstance.currentEnd });
    setDisplayDate(api.getDate());
  };

  // Set up initial calendar range
  useEffect(() => {
    if (calendarRef.current && calendarRef.current.getApi) {
      const api = calendarRef.current.getApi();
      updateRange(api);
    }
  }, []);

  const headerLabel = useMemo(() => {
    return format(displayDate, 'MMMM yyyy');
  }, [displayDate]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handleDateClick('prev')}
          className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center min-w-48">
          <p className="text-2xl font-semibold text-gray-800">{headerLabel}</p>
          <p className="text-sm text-gray-500 mt-1">{events.length} scheduled events</p>
        </div>
        <button
          onClick={() => handleDateClick('next')}
          className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <CalendarSummary orders={orders} currentRange={currentRange} />

      <div className="border rounded-lg overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          ref={calendarRef}
          initialView="dayGridMonth"
          initialDate={new Date()}
          headerToolbar={false}
          events={events}
          displayEventEnd={false}
          dayCellContent={(arg) => (
            <div className="flex justify-end">
              <span className="text-xs font-semibold text-gray-700">{arg.date.getDate()}</span>
            </div>
          )}
          eventTimeFormat={{ hour: 'numeric', minute: '2-digit' }}
          eventClassNames={(arg) => {
            const statusDisplay = getStatusDisplay(arg.event.extendedProps.status);
            return `${statusDisplay.color} border-none`;
          }}
          eventContent={(eventInfo) => {
            const { event } = eventInfo;
            const type = event.extendedProps.type;
            const status = event.extendedProps.status;
            const statusDisplay = getStatusDisplay(status);
            const IconComponent = type === 'delivery' ? Truck : Package;
            const isDueToday = isToday(event.start);

            return (
              <div className="flex items-center space-x-2 text-white text-xs font-medium">
                <IconComponent size={12} />
                <span className="truncate">{event.title}</span>
                {isDueToday && (
                  <span
                    className="text-[10px] bg-white px-1 py-px rounded"
                    style={{ color: statusDisplay.color.replace('bg-', '') }}
                  >
                    Today
                  </span>
                )}
              </div>
            );
          }}
          datesSet={(arg) => {
            console.log('datesSet called:', arg);
            setDisplayDate(arg.start);
            setCurrentRange({ start: arg.start, end: arg.end });
          }}
          eventDidMount={(info) => {
            if (info.view) {
              const api = info.view.calendar;
              updateRange(api);
            }
          }}
          height="auto"
        />
      </div>
    </div>
  );
}
