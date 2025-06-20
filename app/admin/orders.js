// pages/admin/orders.js
import { useState, useEffect } from 'react';
import OrdersTable from '../../components/Admin/OrdersTable';
import TopBar from '../../components/Shared/TopBar';
import Modal from '../../components/Shared/Modal';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all'
  });

  // Mock orders data
  const mockOrders = [
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      customerPhone: '+1-555-0123',
      service: 'Wash & Fold',
      status: 'processing',
      priority: 'normal',
      weight: 5.5,
      amount: 27.50,
      createdAt: '2024-06-20T10:30:00Z',
      estimatedCompletion: '2024-06-21T14:00:00Z',
      notes: 'Delicate items included'
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      customerPhone: '+1-555-0124',
      service: 'Dry Cleaning',
      status: 'completed',
      priority: 'high',
      weight: 3.2,
      amount: 45.00,
      createdAt: '2024-06-19T08:15:00Z',
      estimatedCompletion: '2024-06-20T12:00:00Z',
      completedAt: '2024-06-20T11:45:00Z',
      notes: 'Suit and dress shirts'
    },
    {
      id: 'ORD-003',
      customerName: 'Mike Johnson',
      customerPhone: '+1-555-0125',
      service: 'Wash & Fold',
      status: 'pending',
      priority: 'normal',
      weight: 8.0,
      amount: 40.00,
      createdAt: '2024-06-20T14:22:00Z',
      estimatedCompletion: '2024-06-22T16:00:00Z',
      notes: 'Extra rinse requested'
    },
    {
      id: 'ORD-004',
      customerName: 'Sarah Wilson',
      customerPhone: '+1-555-0126',
      service: 'Express Wash',
      status: 'ready',
      priority: 'high',
      weight: 2.5,
      amount: 35.00,
      createdAt: '2024-06-20T09:00:00Z',
      estimatedCompletion: '2024-06-20T15:00:00Z',
      notes: 'Same day service'
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setIsLoading(false);
      }, 1000);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Filter by search
    if (filters.search) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customerPhone.includes(filters.search)
      );
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(order => 
        new Date(order.createdAt) >= filterDate
      );
    }

    setFilteredOrders(filtered);
  }, [orders, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  const exportOrders = () => {
    // Simple CSV export
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Order ID,Customer,Phone,Service,Status,Amount,Created At\n" +
      filteredOrders.map(order => 
        `${order.id},${order.customerName},${order.customerPhone},${order.service},${order.status},$${order.amount},${order.createdAt}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        title="Orders Management" 
        userRole="admin"
        userName="Admin User"
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-600">Track and manage all customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Order ID, Customer, Phone..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={exportOrders}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable
          orders={filteredOrders}
          isLoading={isLoading}
          onOrderClick={handleOrderClick}
          onStatusUpdate={handleStatusUpdate}
          onDeleteOrder={handleDeleteOrder}
        />

        {/* Order Details Modal */}
        <Modal
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          title={`Order Details - ${selectedOrder?.id}`}
        >
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Customer Information</h4>
                  <p className="text-gray-600">{selectedOrder.customerName}</p>
                  <p className="text-gray-600">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Order Information</h4>
                  <p className="text-gray-600">Service: {selectedOrder.service}</p>
                  <p className="text-gray-600">Weight: {selectedOrder.weight} lbs</p>
                  <p className="text-gray-600">Amount: ${selectedOrder.amount}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700">Timeline</h4>
                <p className="text-gray-600">Created: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p className="text-gray-600">Estimated Completion: {new Date(selectedOrder.estimatedCompletion).toLocaleString()}</p>
                {selectedOrder.completedAt && (
                  <p className="text-gray-600">Completed: {new Date(selectedOrder.completedAt).toLocaleString()}</p>
                )}
              </div>
              
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold text-gray-700">Notes</h4>
                  <p className="text-gray-600">{selectedOrder.notes}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}