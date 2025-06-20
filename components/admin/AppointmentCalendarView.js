import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// Mock appointment data
const mockAppointments = [
    { id: 'AP001', customer: 'Mike Brown', phone: '+1234567894', date: '2024-06-20T10:00:00Z', service: 'Wash & Fold', notes: 'Has delicate items', status: 'pending' },
    { id: 'AP002', customer: 'Sarah Wilson', phone: '+1234567895', date: '2024-06-20T14:00:00Z', service: 'Dry Clean', notes: 'Urgent - needed by Friday', status: 'approved' },
    { id: 'AP003', customer: 'David Lee', phone: '+1234567896', date: '2024-06-21T11:00:00Z', service: 'Wash & Iron', notes: 'Large blanket included', status: 'rejected' },
    { id: 'AP004', customer: 'Emma Davis', phone: '+1234567897', date: '2024-06-22T09:00:00Z', service: 'Express Service', notes: 'Pick up by 3 PM', status: 'pending' },
    { id: 'AP005', customer: 'John Martinez', phone: '+1234567898', date: '2024-06-22T15:00:00Z', service: 'Wash & Fold', notes: 'Regular customer', status: 'approved' },
    { id: 'AP006', customer: 'Lisa Johnson', phone: '+1234567899', date: '2024-06-23T12:00:00Z', service: 'Dry Clean', notes: 'Business suits only', status: 'pending' }
];

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

const AppointmentCalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments] = useState(mockAppointments);
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

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayAppointments = getAppointmentsForDate(day);
        const isCurrentDay = isToday(day);

        calendarCells.push(
            <div
                key={`day-${day}`}
                className={`h-32 p-2 border border-gray-200 hover:bg-gray-50 transition-colors ${isCurrentDay ? 'bg-blue-50 border-blue-300' : 'bg-white'
                    }`}
            >
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-semibold ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                        {day}
                    </span>
                    {dayAppointments.length > 0 && (
                        <span className="text-xs bg-blue-500 text-white rounded-full px-2 py-1 min-w-[20px] text-center">
                            {dayAppointments.length}
                        </span>
                    )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-20">
                    {dayAppointments.slice(0, 2).map(appt => (
                        <div
                            key={appt.id}
                            onClick={() => setSelectedAppointment(appt)}
                            className="text-xs p-1 rounded cursor-pointer hover:bg-white border border-gray-200 bg-gray-50 transition-colors"
                            title={`${appt.customer} - ${appt.service} at ${new Date(appt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium truncate">{appt.customer}</span>
                                <AppointmentBadge status={appt.status} />
                            </div>
                            <div className="text-gray-600 truncate">
                                {new Date(appt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {appt.service}
                            </div>
                        </div>
                    ))}
                    {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500 text-center py-1">
                            +{dayAppointments.length - 2} more
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            {/* Calendar Header */}
            <div className="flex justify-between items-center p-6 border-b">
                <div className="flex items-center space-x-4">
                    <CalendarDays className="text-blue-500" size={24} />
                    <h2 className="text-xl font-semibold text-gray-900">
                        {months[calendarMonth]} {calendarYear}
                    </h2>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                        title="Previous month"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        Today
                    </button>

                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                        title="Next month"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
                {/* Days of the week header */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                    {days.map(day => (
                        <div key={day} className="text-center font-semibold text-sm py-3 text-gray-700 border-b">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar cells */}
                <div className="grid grid-cols-7 gap-0">
                    {calendarCells}
                </div>
            </div>

            {/* Legend */}
            <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Today</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <AppointmentBadge status="pending" />
                            <AppointmentBadge status="approved" />
                            <AppointmentBadge status="rejected" />
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        Total appointments: {appointments.length}
                    </div>
                </div>
            </div>

            {/* Appointment Detail Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">Appointment Details</h3>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-lg">{selectedAppointment.customer}</h4>
                                    <p className="text-gray-600">{selectedAppointment.phone}</p>
                                </div>
                                <AppointmentBadge status={selectedAppointment.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Date</label>
                                    <p className="text-gray-900">
                                        {new Date(selectedAppointment.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Time</label>
                                    <p className="text-gray-900">
                                        {new Date(selectedAppointment.date).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Service</label>
                                <p className="text-gray-900">{selectedAppointment.service}</p>
                            </div>

                            {selectedAppointment.notes && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Notes</label>
                                    <p className="text-gray-900">{selectedAppointment.notes}</p>
                                </div>
                            )}

                            {selectedAppointment.status === 'pending' && (
                                <div className="flex space-x-3 pt-4">
                                    <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                        Approve
                                    </button>
                                    <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentCalendarView;