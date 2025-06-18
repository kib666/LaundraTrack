'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Package,
    Truck,
    User,
    Users,
    DollarSign,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    Plus,
    MapPin,
    Phone,
    Mail,
    Settings,
    Bell,
    Menu,
    X,
    Home,
    Clipboard,
    BarChart3,
    HelpCircle,
    Loader,
    Download,
    CalendarCheck,
    CalendarX2,
    CalendarDays,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// Mock data
const mockOrders = [
    { id: 'LD001', customer: 'John Doe', phone: '+1234567890', weight: '5kg', status: 'pending', eta: '2024-06-19T10:00:00Z', total: 45.00 },
    { id: 'LD002', customer: 'Jane Smith', phone: '+1234567891', weight: '3kg', status: 'in_wash', eta: '2024-06-19T14:00:00Z', total: 35.00 },
    { id: 'LD003', customer: 'Bob Wilson', phone: '+1234567892', weight: '7kg', status: 'ready', eta: '2024-06-19T16:00:00Z', total: 65.00 },
    { id: 'LD004', customer: 'Alice Johnson', phone: '+1234567893', weight: '4kg', status: 'delivered', eta: '2024-06-18T18:00:00Z', total: 40.00 }
];

const mockAppointments = [
    { id: 'AP001', customer: 'Mike Brown', phone: '+1234567894', date: '2024-06-20T10:00:00Z', service: 'Wash & Fold', notes: 'Has delicate items', status: 'pending' },
    { id: 'AP002', customer: 'Sarah Wilson', phone: '+1234567895', date: '2024-06-20T14:00:00Z', service: 'Dry Clean', notes: 'Urgent - needed by Friday', status: 'approved' },
    { id: 'AP003', customer: 'David Lee', phone: '+1234567896', date: '2024-06-21T11:00:00Z', service: 'Wash & Iron', notes: 'Large blanket included', status: 'rejected', rejectionReason: 'Fully booked at this time' }
];

// Utility Components
const StatusBadge = ({ status }) => {
    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
        in_wash: { color: 'bg-blue-100 text-blue-800', text: 'In Wash' },
        ready: { color: 'bg-green-100 text-green-800', text: 'Ready' },
        delivered: { color: 'bg-gray-100 text-gray-800', text: 'Delivered' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.text}
        </span>
    );
};

const AppointmentBadge = ({ status }) => {
    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
        approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approved' },
        rejected: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
            <Icon size={14} />
            {config.text}
        </span>
    );
};

const LiveCountdown = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference > 0) {
                const hours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours}h ${minutes}m`);
            } else {
                setTimeLeft('Ready!');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return <span className="text-sm text-gray-600">{timeLeft}</span>;
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

const TopBar = ({ title, user = "Admin" }) => {
    return (
        <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
                <Bell className="text-gray-600 hover:text-gray-800 cursor-pointer" size={20} />
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="text-white" size={16} />
                    </div>
                    <span className="text-sm font-medium">{user}</span>
                </div>
            </div>
        </div>
    );
};

// Dashboard Components
const DashboardStats = ({ orders, appointments }) => {
    const stats = [
        { title: 'Total Orders', value: orders.length.toString(), icon: Package, color: 'bg-blue-500' },
        { title: 'Pending Appointments', value: appointments.filter(a => a.status === 'pending').length.toString(), icon: Clock, color: 'bg-yellow-500' },
        { title: 'Ready for Delivery', value: orders.filter(o => o.status === 'ready').length.toString(), icon: Truck, color: 'bg-green-500' },
        { title: 'Today\'s Revenue', value: `$${orders.reduce((sum, order) => sum + order.total, 0)}`, icon: DollarSign, color: 'bg-purple-500' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-900 mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`${stat.color} p-3 rounded-lg`}>
                            <stat.icon className="text-white" size={24} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Order Components
const OrdersTable = ({ orders, onStatusUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search orders..."
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
                        <option value="in_wash">In Wash</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                                        <div className="text-sm text-gray-500">{order.phone}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.weight}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <select
                                        className="text-sm border-none bg-transparent focus:outline-none"
                                        value={order.status}
                                        onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in_wash">In Wash</option>
                                        <option value="ready">Ready</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <LiveCountdown targetDate={order.eta} />
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ${order.total.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Staff Components
const TaskListCard = ({ tasks, onStatusUpdate }) => {
    const groupedTasks = {
        pending: tasks.filter(task => task.status === 'pending'),
        in_wash: tasks.filter(task => task.status === 'in_wash'),
        ready: tasks.filter(task => task.status === 'ready')
    };

    return (
        <div className="space-y-6">
            {Object.entries(groupedTasks).map(([status, statusTasks]) => (
                <div key={status} className="bg-white rounded-lg shadow-sm border">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold capitalize">{status.replace('_', ' ')} ({statusTasks.length})</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {statusTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">{task.customer}</h4>
                                        <StatusBadge status={task.status} />
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Order: {task.id} • {task.weight}</p>
                                    <p className="text-sm text-gray-500">ETA: <LiveCountdown targetDate={task.eta} /></p>
                                </div>
                                <div className="ml-4 space-x-2">
                                    {task.status === 'pending' && (
                                        <button
                                            onClick={() => onStatusUpdate(task.id, 'in_wash')}
                                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                        >
                                            Start Wash
                                        </button>
                                    )}
                                    {task.status === 'in_wash' && (
                                        <button
                                            onClick={() => onStatusUpdate(task.id, 'ready')}
                                            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                        >
                                            Mark Ready
                                        </button>
                                    )}
                                    {task.status === 'ready' && (
                                        <button
                                            onClick={() => onStatusUpdate(task.id, 'delivered')}
                                            className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                                        >
                                            Mark Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Customer Components
const OrderLookupForm = ({ onLookup }) => {
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [lookupType, setLookupType] = useState('order');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLookup(lookupType === 'order' ? orderId : phone, lookupType);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-center mb-6">Track Your Order</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4 mb-4">
                    <button
                        type="button"
                        onClick={() => setLookupType('order')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${lookupType === 'order'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Order ID
                    </button>
                    <button
                        type="button"
                        onClick={() => setLookupType('phone')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${lookupType === 'phone'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Phone Number
                    </button>
                </div>

                {lookupType === 'order' ? (
                    <input
                        type="text"
                        placeholder="Enter order ID (e.g., LD001)"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        required
                    />
                ) : (
                    <input
                        type="tel"
                        placeholder="Enter phone number"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                    Track Order
                </button>
            </form>
        </div>
    );
};

const StatusProgressTracker = ({ status, eta }) => {
    const steps = [
        { key: 'pending', label: 'Order Received', icon: Package },
        { key: 'in_wash', label: 'In Wash', icon: Clock },
        { key: 'ready', label: 'Ready', icon: CheckCircle },
        { key: 'delivered', label: 'Delivered', icon: Truck }
    ];

    const getCurrentStep = () => {
        const stepIndex = steps.findIndex(step => step.key === status);
        return stepIndex !== -1 ? stepIndex : 0;
    };

    const currentStep = getCurrentStep();

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-6 text-center">Order Status</h3>

            <div className="relative">
                <div className="flex justify-between items-center mb-8">
                    {steps.map((step, index) => {
                        const isActive = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={step.key} className="flex flex-col items-center flex-1">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                                    } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}>
                                    <step.icon size={20} />
                                </div>
                                <span className={`text-sm text-center ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-10">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {status !== 'delivered' && (
                <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Estimated delivery time:</p>
                    <p className="text-lg font-semibold text-blue-600">
                        <LiveCountdown targetDate={eta} />
                    </p>
                </div>
            )}
        </div>
    );
};

// Appointment Components
const AppointmentForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        service: 'Wash & Fold',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date & Time</label>
                <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>Wash & Fold</option>
                    <option>Dry Clean</option>
                    <option>Wash & Iron</option>
                    <option>Express Service</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requirements..."
                />
            </div>
            <div className="flex space-x-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Book Appointment
                </button>
            </div>
        </form>
    );
};

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

// Main App Component
const LaundryTrackerApp = () => {
    const [currentView, setCurrentView] = useState('admin');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [orders, setOrders] = useState(mockOrders);
    const [appointments, setAppointments] = useState(mockAppointments);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [appointmentSuccess, setAppointmentSuccess] = useState(false);

    const handleStatusUpdate = (orderId, newStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const handleAppointmentStatusUpdate = (apptId, newStatus, rejectionReason = '') => {
        setAppointments(prev => prev.map(appt =>
            appt.id === apptId
                ? { ...appt, status: newStatus, ...(rejectionReason && { rejectionReason }) }
                : appt
        ));
    };

    const handleOrderLookup = (searchTerm, type) => {
        const order = orders.find(o =>
            type === 'order'
                ? o.id.toLowerCase() === searchTerm.toLowerCase()
                : o.phone.includes(searchTerm)
        );
        setSelectedOrder(order);
    };

    const handleBookAppointment = (formData) => {
        const newAppointment = {
            id: `AP${(appointments.length + 1).toString().padStart(3, '0')}`,
            customer: formData.name,
            phone: formData.phone,
            date: formData.date,
            service: formData.service,
            notes: formData.notes,
            status: 'pending'
        };

        setAppointments(prev => [...prev, newAppointment]);
        setIsAppointmentModalOpen(false);
        setAppointmentSuccess(true);
    };

    const Sidebar = ({ view, onViewChange }) => {
        const adminItems = [
            { key: 'dashboard', label: 'Dashboard', icon: Home },
            { key: 'orders', label: 'Orders', icon: Package },
            { key: 'appointments', label: 'Appointments', icon: CalendarDays },
            { key: 'reports', label: 'Reports', icon: BarChart3 },
            { key: 'settings', label: 'Settings', icon: Settings }
        ];

        const staffItems = [
            { key: 'tasks', label: 'My Tasks', icon: Clipboard },
            { key: 'deliveries', label: 'Deliveries', icon: Truck },
            { key: 'profile', label: 'Profile', icon: User }
        ];

        const items = view === 'admin' ? adminItems : staffItems;

        return (
            <div className="bg-white shadow-sm border-r h-full">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Laundry Tracker</h2>
                    <p className="text-sm text-gray-600 capitalize">{view} Portal</p>
                </div>

                <nav className="p-2">
                    {items.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => onViewChange(item.key)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${activeTab === item.key ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        );
    };

    const renderContent = () => {
        if (currentView === 'customer') {
            return (
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Laundry Services</h1>
                            <p className="text-gray-600">Track your order or book an appointment</p>
                        </div>

                        {!selectedOrder ? (
                            <div className="space-y-6">
                                <OrderLookupForm onLookup={handleOrderLookup} />

                                <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold">Book Appointment</h2>
                                        <CalendarDays className="text-blue-500" size={24} />
                                    </div>
                                    <p className="text-gray-600 mb-4">Schedule a pickup time that works for you</p>
                                    <button
                                        onClick={() => setIsAppointmentModalOpen(true)}
                                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CalendarCheck size={18} />
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                                    >
                                        ← Back to Services
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
                                    <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Order ID:</span>
                                            <span className="font-medium">{selectedOrder.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Customer:</span>
                                            <span className="font-medium">{selectedOrder.customer}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Weight:</span>
                                            <span className="font-medium">{selectedOrder.weight}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total:</span>
                                            <span className="font-medium">${selectedOrder.total}</span>
                                        </div>
                                    </div>
                                </div>

                                <StatusProgressTracker status={selectedOrder.status} eta={selectedOrder.eta} />

                                <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
                                    <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <Phone size={16} className="text-gray-500" />
                                            <span className="text-sm">Call us: (555) 123-4567</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Mail size={16} className="text-gray-500" />
                                            <span className="text-sm">Email: support@laundrytracker.com</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="flex h-screen bg-gray-50">
                {/* Desktop Sidebar */}
                <div className="hidden md:block w-64">
                    <Sidebar view={currentView} onViewChange={setActiveTab} />
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
                        <div className="absolute left-0 top-0 w-64 h-full">
                            <Sidebar view={currentView} onViewChange={(tab) => {
                                setActiveTab(tab);
                                setIsMobileMenuOpen(false);
                            }} />
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Mobile Header */}
                    <div className="md:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
                        <button onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-semibold">Laundry Tracker</h1>
                        <div className="w-6" />
                    </div>

                    <TopBar title={
                        currentView === 'admin'
                            ? activeTab === 'dashboard' ? 'Admin Dashboard'
                                : activeTab === 'orders' ? 'Order Management'
                                    : activeTab === 'appointments' ? 'Appointments'
                                        : 'Admin Portal'
                            : 'Staff Portal'
                    } />

                    <div className="flex-1 p-6 overflow-y-auto">
                        {currentView === 'admin' && (
                            <>
                                {activeTab === 'dashboard' && (
                                    <div>
                                        <DashboardStats orders={orders} appointments={appointments} />
                                        <div className="space-y-6 mt-6">
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-xl font-semibold">Recent Orders</h2>
                                                <button
                                                    onClick={() => setIsOrderModalOpen(true)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                                                >
                                                    <Plus size={16} />
                                                    <span>Add Order</span>
                                                </button>
                                            </div>
                                            <OrdersTable orders={orders} onStatusUpdate={handleStatusUpdate} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'orders' && (
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-semibold">All Orders</h2>
                                            <button
                                                onClick={() => setIsOrderModalOpen(true)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                                            >
                                                <Plus size={16} />
                                                <span>Add Order</span>
                                            </button>
                                        </div>
                                        <OrdersTable orders={orders} onStatusUpdate={handleStatusUpdate} />
                                    </div>
                                )}

                                {activeTab === 'appointments' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-semibold">Appointments</h2>
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => setIsAppointmentModalOpen(true)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                                                >
                                                    <Plus size={16} />
                                                    <span>Add Appointment</span>
                                                </button>
                                            </div>
                                        </div>

                                        <AppointmentCalendarView appointments={appointments} />

                                        <AppointmentsTable
                                            appointments={appointments}
                                            onStatusUpdate={handleAppointmentStatusUpdate}
                                        />
                                    </div>
                                )}

                                {(activeTab === 'reports' || activeTab === 'settings') && (
                                    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                                        <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
                                        <h2 className="text-xl font-semibold mb-2">{activeTab === 'reports' ? 'Reports' : 'Settings'}</h2>
                                        <p className="text-gray-600">This section is under development</p>
                                    </div>
                                )}
                            </>
                        )}

                        {currentView === 'staff' && (
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold mb-2">My Tasks</h2>
                                    <p className="text-gray-600">Manage your assigned laundry tasks</p>
                                </div>
                                <TaskListCard tasks={orders} onStatusUpdate={handleStatusUpdate} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* View Switcher (Demo purposes) */}
            <div className="fixed top-4 right-4 z-40 bg-white rounded-lg shadow-lg border p-2">
                <div className="flex space-x-1">
                    <button
                        onClick={() => setCurrentView('admin')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${currentView === 'admin' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Admin
                    </button>
                    <button
                        onClick={() => setCurrentView('staff')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${currentView === 'staff' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Staff
                    </button>
                    <button
                        onClick={() => setCurrentView('customer')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${currentView === 'customer' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Customer
                    </button>
                </div>
            </div>

            {renderContent()}

            {/* Add Order Modal */}
            <Modal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                title="Add New Order"
            >
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                        <input type="text" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input type="number" step="0.1" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                        <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Wash & Fold</option>
                            <option>Dry Clean</option>
                            <option>Wash & Iron</option>
                            <option>Express Service</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                        <input type="datetime-local" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                        <textarea
                            rows="2"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter full delivery address..."
                        />
                    </div>
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOrderModalOpen(false)}
                            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Create Order
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Book Appointment Modal */}
            <Modal
                isOpen={isAppointmentModalOpen}
                onClose={() => setIsAppointmentModalOpen(false)}
                title="Book Appointment"
            >
                <AppointmentForm
                    onSubmit={handleBookAppointment}
                    onCancel={() => setIsAppointmentModalOpen(false)}
                />
            </Modal>

            {/* Appointment Success Modal */}
            <Modal
                isOpen={appointmentSuccess}
                onClose={() => setAppointmentSuccess(false)}
                title="Appointment Booked!"
            >
                <div className="text-center p-6">
                    <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                    <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-gray-600 mb-6">Your appointment has been successfully booked. We'll contact you to confirm the details.</p>
                    <button
                        onClick={() => setAppointmentSuccess(false)}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default LaundryTrackerApp;