import React from 'react';

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

export default StatusBadge;