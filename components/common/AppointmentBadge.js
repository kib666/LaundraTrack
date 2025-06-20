// components/common/AppointmentBadge.js
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

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

export default AppointmentBadge;