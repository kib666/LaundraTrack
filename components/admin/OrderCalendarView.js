'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Clock,
  Truck,
  Package,
} from 'lucide-react';
import format from 'date-fns/format';
import addWeeks from 'date-fns/addWeeks';
import isToday from 'date-fns/isToday';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });

const buildEvents = (orders) =>
  orders.flatMap((order) => {
    const pickup = order.pickupDate || order.createdAt;
    const delivery = order.deliveryDate || order.eta;
    const customer = order.customerId || {};
    const customerName =
      typeof customer === 'string'
        ? 'Walk-in Customer'
        : `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Walk-in Customer';

    const pickupEvent = pickup
      ? {
          id: `${order.id || order._id}-pickup`,
          title: `${customerName} • Pickup`,
          start: pickup,
          extendedProps: {
            type: 'pickup',
            status: order.status,
            total: order.totalAmount || order.total,
          },
        }
      : null;

    const deliveryEvent = delivery
      ? {
          id: `${order.id || order._id}-delivery`,
          title: `${customerName} • Delivery`,
          start: delivery,
          extendedProps: {
            type: 'delivery',
            status: order.status,
            total: order.totalAmount || order.total,
          },
        }
      : null;

    return [pickupEvent, deliveryEvent].filter(Boolean);
  });

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('dayGridMonth');
  const [calendarRef, setCalendarRef] = useState(null);
  const [currentRange, setCurrentRange] = useState(null);

  const events = useMemo(() => buildEvents(orders), [orders]);

  const handleDateChange = (offset) => {
    if (view === 'dayGridMonth') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    } else {
      setCurrentDate((prev) => addWeeks(prev, offset));
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    if (calendarRef) {
      calendarRef.getApi().changeView(newView);
    }
  };

  const handleDateClick = (direction) => {
    if (!calendarRef) return;
    const api = calendarRef.getApi();
    if (direction === 'prev') {
      api.prev();
    } else if (direction === 'next') {
      api.next();
    } else {
      api.today();
    }
    updateRange(api);
  };

  const updateRange = (api) => {
    const viewInstance = api.view;
    setCurrentRange({ start: viewInstance.currentStart, end: viewInstance.currentEnd });
  };

  const handleCalendarReady = (calendar) => {
    setCalendarRef(calendar);
    updateRange(calendar.getApi());
  };

  const headerLabel = format(
    currentDate,
    view === 'dayGridMonth' ? 'MMMM yyyy' : "MMMM d'–'d, yyyy"
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleDateClick('prev')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-100"
            aria-label="Previous period"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800">{headerLabel}</p>
            <p className="text-sm text-gray-500">{events.length} scheduled events</p>
          </div>
          <button
            onClick={() => handleDateClick('next')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-100"
            aria-label="Next period"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDateClick('today')}
            className="px-3 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100"
          >
            Today
          </button>
          <button
            onClick={() => handleViewChange('timeGridWeek')}
            className={`px-4 py-2 text-sm font-medium border rounded-lg flex items-center space-x-2 ${
              view === 'timeGridWeek'
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'hover:bg-gray-100'
            }`}
          >
            <Clock size={16} />
            <span>Week</span>
          </button>
          <button
            onClick={() => handleViewChange('dayGridMonth')}
            className={`px-4 py-2 text-sm font-medium border rounded-lg flex items-center space-x-2 ${
              view === 'dayGridMonth'
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'hover:bg-gray-100'
            }`}
          >
            <LayoutGrid size={16} />
            <span>Month</span>
          </button>
        </div>
      </div>

      <CalendarSummary orders={orders} currentRange={currentRange} />

      <div className="border rounded-lg overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          ref={handleCalendarReady}
          initialView="dayGridMonth"
          headerToolbar={false}
          events={events}
          displayEventEnd={false}
          eventTimeFormat={{ hour: 'numeric', minute: '2-digit' }}
          eventClassNames={(arg) =>
            arg.event.extendedProps.type === 'delivery'
              ? 'bg-green-500 border-none'
              : 'bg-blue-500 border-none'
          }
          eventContent={(eventInfo) => {
            const { event } = eventInfo;
            const type = event.extendedProps.type;
            const IconComponent = type === 'delivery' ? Truck : Package;
            const isDueToday = isToday(event.start);

            return (
              <div className="flex items-center space-x-2 text-white text-xs font-medium">
                <IconComponent size={12} />
                <span className="truncate">{event.title}</span>
                {isDueToday && (
                  <span className="text-[10px] bg-white text-blue-600 px-1 py-px rounded">
                    Today
                  </span>
                )}
              </div>
            );
          }}
          datesSet={(arg) => setCurrentDate(arg.start)}
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
