import React from 'react';
import { StatusBadge, LiveCountdown } from '../shared/StatusBadge';

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

export default TaskListCard;