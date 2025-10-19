import React, { useState } from 'react';
import { Search, Calendar } from 'lucide-react';

// Status display mapping for consistency with staff page
const getStatusDisplay = (status) => {
  const statusMap = {
    PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    IN_PROGRESS: { color: 'bg-blue-100 text-blue-800', text: 'In Progress' },
    COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Ready' },
    DELIVERED: { color: 'bg-purple-100 text-purple-800', text: 'Delivered' },
    CANCELLED: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
    DELETED: { color: 'bg-gray-400 text-white', text: 'Deleted' },
  };
  return statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: status };
};

// New EditableDate component
const EditableDate = ({ order, onDateUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const deliveryDate = order.deliveryDate || order.eta;
  const [newDate, setNewDate] = useState(
    deliveryDate ? new Date(deliveryDate).toISOString().split('T')[0] : ''
  );

  const handleSave = () => {
    if (newDate) {
      onDateUpdate(order._id || order.id, newDate);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          onBlur={handleSave}
          autoFocus
          className="p-1 border rounded-md text-sm text-gray-900"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEditing(true)}>
      <Calendar size={14} className="text-gray-500" />
      <span className="text-sm text-gray-900">
        {deliveryDate ? new Date(deliveryDate).toLocaleDateString() : 'Not set'}
      </span>
    </div>
  );
};

const OrdersTable = ({ orders, onDateUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter((order) => {
    const customer = order.customerId || {};
    const customerName =
      typeof customer === 'string'
        ? ''
        : ((customer.firstName || '') + ' ' + (customer.lastName || '')).trim();
    const trackingNumber = order.trackingNumber || order.id || '';
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
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
                placeholder="Search by customer name or Order ID..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Ready</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weight
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preferred Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const customer = order.customerId || {};
              const customerName =
                typeof customer === 'string'
                  ? 'Walk-in Customer'
                  : (customer.firstName || '') + ' ' + (customer.lastName || '');
              const weight = order.items && order.items[0]?.quantity ? order.items[0].quantity : 0;
              const orderId = order._id || order.id;

              return (
                <tr key={orderId} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.trackingNumber || order.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customerName}</div>
                      <div className="text-sm text-gray-500">
                        {typeof customer === 'string' ? '' : customer.phone || ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{weight} kg</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {(() => {
                      const statusDisplay = getStatusDisplay(order.status);
                      return (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusDisplay.color}`}
                        >
                          {statusDisplay.text}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <EditableDate order={order} onDateUpdate={onDateUpdate} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.preferredTime || 'Not set'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₱{(order.totalAmount || 0).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
