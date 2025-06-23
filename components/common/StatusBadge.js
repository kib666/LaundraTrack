// components/common/StatusBadge.js
const StatusBadge = ({ status }) => {
    const statusConfig = {
        PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
        IN_PROGRESS: { color: 'bg-blue-100 text-blue-800', text: 'In Progress' },
        COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Ready' },
        DELIVERED: { color: 'bg-purple-100 text-purple-800', text: 'Delivered' },
        CANCELLED: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.text}
        </span>
    );
};

export default StatusBadge;