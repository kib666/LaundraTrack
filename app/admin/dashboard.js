// pages/admin/dashboard.js
import { useState, useEffect } from 'react';
import DashboardStats from '../../components/Admin/DashboardStats';
import TopBar from '../../components/Shared/TopBar';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    activeAppointments: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  // Mock data fetch
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalOrders: 342,
          pendingOrders: 23,
          completedOrders: 319,
          totalRevenue: 15420.50,
          todayOrders: 8,
          activeAppointments: 12
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchDashboardStats();
  }, []);

  const handleRefreshStats = () => {
    // Refresh stats functionality
    setIsLoading(true);
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 5),
        pendingOrders: Math.floor(Math.random() * 30),
        todayOrders: prev.todayOrders + Math.floor(Math.random() * 3)
      }));
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        title="Admin Dashboard" 
        userRole="admin"
        userName="Admin User"
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor your laundry business performance</p>
        </div>

        <div className="mb-6">
          <button
            onClick={handleRefreshStats}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Stats'}
          </button>
        </div>

        <DashboardStats 
          stats={stats}
          isLoading={isLoading}
          onRefresh={handleRefreshStats}
        />

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
                Add New Order
              </button>
              <button className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
                Schedule Appointment
              </button>
              <button className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
                Generate Report
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Order #1234 completed</p>
              <p>• New appointment scheduled</p>
              <p>• Payment received for #1235</p>
              <p>• Customer inquiry resolved</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">System Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className="text-sm text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm text-gray-600">2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm text-gray-600">23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}