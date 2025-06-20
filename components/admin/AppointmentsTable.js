import React, { useState } from 'react';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';
import AppointmentBadge from '../common/AppointmentBadge';

const AppointmentsTable = ({ appointments, onStatusUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [rejectionReason, setRejectionReason] = useState('');
    const [currentAppointment, setCurrentAppointment] = useState(null);

    const filteredAppointments = appointments.filter(appt => {
        const matchesSearch = appt.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appt.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleReject = (apptId) => {
        if (rejectionReason.trim()) {
            onStatusUpdate(apptId, 'rejected', rejectionReason);
            setRejectionReason('');
            setCurrentAppointment(null);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search appointments..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appt ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAppointments.map((appt) => (
                            <tr key={appt.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.id}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{appt.customer}</div>
                                        <div className="text-sm text-gray-500">{appt.phone}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(appt.date).toLocaleString()}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{appt.service}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <AppointmentBadge status={appt.status} />
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                    {appt.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onStatusUpdate(appt.id, 'approved')}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentAppointment(appt.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <AlertCircle size={18} />
                                            </button>
                                        </div>
                                    )}
                                    {appt.status === 'rejected' && appt.rejectionReason && (
                                        <span className="text-xs text-red-600">{appt.rejectionReason}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Rejection Reason Modal */}
            {currentAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Reject Appointment</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for rejection</label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Provide a reason for rejecting this appointment..."
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setCurrentAppointment(null)}
                                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(currentAppointment)}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentsTable;