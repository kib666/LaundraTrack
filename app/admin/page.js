'use client';

import React, { useState } from 'react';
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

// Import components
import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/common/TopBar';
import DashboardStats from '@/components/admin/DashboardStats';
import OrdersTable from '@/components/admin/OrdersTable';
import AppointmentsTable from '@/components/admin/AppointmentsTable';
import AppointmentCalendarView from '@/components/admin/AppointmentCalendarView';
import Modal from '@/components/common/Modal';
import AppointmentForm from '@/components/common/AppointmentForm';

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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState(mockOrders);
  const [appointments, setAppointments] = useState(mockAppointments);
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

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Admin Dashboard';
      case 'orders': return 'Order Management';
      case 'appointments': return 'Appointments';
      case 'reports': return 'Reports';
      case 'settings': return 'Settings';
      default: return 'Admin Portal';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 w-64 h-full">
              <Sidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
              />
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
            <h1 className="text-lg font-semibold">Laundry Admin</h1>
            <div className="w-6" />
          </div>

          <TopBar title={getPageTitle()} />

          <div className="flex-1 p-6 overflow-y-auto">
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
                  <button
                    onClick={() => setIsAppointmentModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Appointment</span>
                  </button>
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
                <h2 className="text-xl font-semibold mb-2">
                  {activeTab === 'reports' ? 'Reports' : 'Settings'}
                </h2>
                <p className="text-gray-600">This section is under development</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
}