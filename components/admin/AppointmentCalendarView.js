import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const AppointmentBadge = ({ status }) => {
    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, text: 'Pending' },
        approved: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, text: 'Approved' },
        rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle, text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            <Icon size={12} />
            {config.text}
        </span>
    );
};

const AppointmentCalendarView = ({ appointments = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const calendarMonth = currentDate.getMonth();
    const calendarYear = currentDate.getFullYear();

    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(calendarMonth + direction);
        setCurrentDate(newDate);
    };

    const isToday = (day) => {
        return day === currentDay && calendarMonth === currentMonth && calendarYear === currentYear;
    };

    const getAppointmentsForDate = (day) => {
        const cellDate = new Date(calendarYear, calendarMonth, day).toISOString().split('T')[0];
        return appointments.filter(appt =>
            new Date(appt.date).toISOString().split('T')[0] === cellDate
        );
    };

    const calendarCells = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        calendarCells.push(
            <div key={`empty-${i}`} className="h-32 p-2 border border-gray-200 bg-gray-50"></div>
        );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayAppointments = getAppointmentsForDate(day);
        const isCurrentDay = isToday(day);

        calendarCells.push(
            <div
                key={`day-${day}`}
                className={`h-32 p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isCurrentDay ? 'bg-blue-50 border-blue-300' : ''
                }`}
                onClick={() => {
                    if (dayAppointments.length > 0) {
                        setSelectedAppointment(dayAppointments[0]);
                    }
                }}
            >
                <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}`}>
                        {day}
                    </span>
                    {dayAppointments.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                            {dayAppointments.length}
                        </span>
                    )}
                </div>
                <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((appt) => (
                        <div
                            key={appt.id}
                            className="text-xs p-1 rounded bg-gray-100 truncate cursor-pointer hover:bg-gray-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAppointment(appt);
                            }}
                        >
                            <div className="font-medium">{appt.customer}</div>
                            <div className="text-gray-600">{appt.service}</div>
                        </div>
                    ))}
                    {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                            +{dayAppointments.length - 2} more
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Appointment Calendar</h2>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-medium">
                        {months[calendarMonth]} {calendarYear}
                    </span>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-6">
                {days.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                    </div>
                ))}
                {calendarCells}
            </div>

            {/* Appointment Details Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Appointment Details</h3>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm text-gray-600">Customer:</span>
                                <p className="font-medium">{selectedAppointment.customer}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Phone:</span>
                                <p className="font-medium">{selectedAppointment.phone}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Service:</span>
                                <p className="font-medium">{selectedAppointment.service}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Date:</span>
                                <p className="font-medium">
                                    {new Date(selectedAppointment.date).toLocaleString()}
                                </p>
                            </div>
                            {selectedAppointment.notes && (
                                <div>
                                    <span className="text-sm text-gray-600">Notes:</span>
                                    <p className="font-medium">{selectedAppointment.notes}</p>
                                </div>
                            )}
                            <div>
                                <span className="text-sm text-gray-600">Status:</span>
                                <div className="mt-1">
                                    <AppointmentBadge status={selectedAppointment.status} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentCalendarView;