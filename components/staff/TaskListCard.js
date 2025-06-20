import React, { useState, useEffect } from 'react';
import { Clock, Package, CheckCircle, Truck, AlertCircle, User, Phone } from 'lucide-react';

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
                setTimeLeft('Overdue!');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <span className={`text-sm ${timeLeft === 'Overdue!' ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
            {timeLeft}
        </span>
    );
};

const TaskListCard = ({ tasks, onStatusUpdate, staffName = "Staff Member" }) => {
    const [filter, setFilter] = useState('all');

    // Filter tasks assigned to this staff member
    const myTasks = tasks.filter(task => task.assignedTo === staffName || !task.assignedTo);

    const filteredTasks = filter === 'all'
        ? myTasks
        : myTasks.filter(task => task.status === filter);

    const groupedTasks = {
        pending: filteredTasks.filter(task => task.status === 'pending'),
        in_wash: filteredTasks.filter(task => task.status === 'in_wash'),
        ready: filteredTasks.filter(task => task.status === 'ready')
    };

    const handleTaskAction = (taskId, newStatus) => {
        onStatusUpdate(taskId, newStatus);
    };

    return (
        <div className="space-y-6">
            {/* Filter Buttons */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex space-x-2 overflow-x-auto">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All Tasks ({myTasks.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'pending'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Pending ({myTasks.filter(t => t.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setFilter('in_wash')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'in_wash'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        In Progress ({myTasks.filter(t => t.status === 'in_wash').length})
                    </button>
                    <button
                        onClick={() => setFilter('ready')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'ready'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Ready ({myTasks.filter(t => t.status === 'ready').length})
                    </button>
                </div>
            </div>

            {/* Task Groups */}
            {filter === 'all' ? (
                // Show grouped tasks when "All" is selected
                Object.entries(groupedTasks).map(([status, statusTasks]) => (
                    statusTasks.length > 0 && (
                        <div key={status} className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                                    {status === 'pending' && <Clock size={20} className="text-yellow-500" />}
                                    {status === 'in_wash' && <Package size={20} className="text-blue-500" />}
                                    {status === 'ready' && <Truck size={20} className="text-green-500" />}
                                    {status.replace('_', ' ')} ({statusTasks.length})
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {statusTasks.map((task) => (
                                    <TaskCard key={task.id} task={task} onAction={handleTaskAction} />
                                ))}
                            </div>
                        </div>
                    )
                ))
            ) : (
                // Show flat list when specific status is selected
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold capitalize">
                            {filter.replace('_', ' ')} Tasks ({filteredTasks.length})
                        </h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => (
                                <TaskCard key={task.id} task={task} onAction={handleTaskAction} />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>No {filter} tasks at the moment</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const TaskCard = ({ task, onAction }) => {
    const getPriorityColor = (eta) => {
        const now = new Date();
        const etaDate = new Date(eta);
        const hoursLeft = (etaDate - now) / (1000 * 60 * 60);

        if (hoursLeft < 2) return 'border-l-red-500';
        if (hoursLeft < 6) return 'border-l-yellow-500';
        return 'border-l-green-500';
    };

    return (
        <div className={`p-4 bg-gray-50 rounded-lg border-l-4 ${getPriorityColor(task.eta)}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{task.customer}</h4>
                        <StatusBadge status={task.status} />
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                            <Package size={14} />
                            <span>Order: {task.id} • {task.weight}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>{task.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>ETA: <LiveCountdown targetDate={task.eta} /></span>
                        </div>
                    </div>

                    {task.notes && (
                        <div className="bg-blue-50 p-2 rounded text-sm text-blue-800 mb-3">
                            <strong>Note:</strong> {task.notes}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-2 mt-3">
                {task.status === 'pending' && (
                    <button
                        onClick={() => onAction(task.id, 'in_wash')}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <Package size={16} />
                        Start Wash
                    </button>
                )}
                {task.status === 'in_wash' && (
                    <button
                        onClick={() => onAction(task.id, 'ready')}
                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                        <CheckCircle size={16} />
                        Mark Ready
                    </button>
                )}
                {task.status === 'ready' && (
                    <button
                        onClick={() => onAction(task.id, 'delivered')}
                        className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                    >
                        <Truck size={16} />
                        Mark Delivered
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskListCard;