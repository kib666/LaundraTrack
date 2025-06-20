import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AppointmentCalendarView = ({ appointments }) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendarCells = [];
    let dayCounter = 1;

    for (let i = 0; i < firstDay; i++) {
        calendarCells.push(<div key={`empty-${i}`} className="h-24 p-1 border bg-gray-50"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const cellDate = new Date(currentYear, currentMonth, i).toISOString().split('T')[0];
        const dayAppointments = appointments.filter(appt =>
            new Date(appt.date).toISOString().split('T')[0] === cellDate
        );

        calendarCells.push(
            <div key={`day-${i}`} className={`h-24 p-1 border ${i === currentDay ? 'bg-blue-50' : ''}`}>
                <div className="flex justify-between">
                    <span className={`text-sm font-medium ${i === currentDay ? 'text-blue-600' : ''}`}>{i}</span>
                    {dayAppointments.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                            {dayAppointments.length}
                        </span>
                    )}
                </div>
                <div className="overflow-y-auto max-h-16">
                    {dayAppointments.map(appt => (
                        <div key={appt.id} className="text-xs mt-1 p-1 rounded bg-gray-100 truncate">
                            {appt.customer} - {appt.service}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                    {new Date(currentYear, currentMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex space-x-2">
                    <button className="p-1 rounded hover:bg-gray-100">
                        <ChevronLeft size={18} />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-0">
                {days.map(day => (
                    <div key={day} className="text-center font-medium text-sm py-2 border-b">
                        {day}
                    </div>
                ))}
                {calendarCells}
            </div>
        </div>
    );
};

export default AppointmentCalendarView;