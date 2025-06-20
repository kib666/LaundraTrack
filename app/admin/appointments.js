// pages/admin/appointments.js
import { useState, useEffect } from 'react';
import AppointmentsTable from '../../components/Admin/AppointmentsTable';
import AppointmentCalendarView from '../../components/Admin/AppointmentCalendarView';
import TopBar from '../../components/Shared/TopBar';
import Modal from '../../components/Shared/Modal';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    service: 'all',
    date: '',
    search: ''
  });

  // Mock appointments data
  const mockAppointments = [
    {
      id: 'APT-001',
      customerName: 'Alice Johnson',
      customerPhone: '+1-555-0201',
      service: 'Drop-off',
      status: 'confirmed',
      date: '2024-06-21',
      time: '09:00',
      duration: 30,
      notes: 'Large load - comforters and blankets',
      createdAt: '2024-06-20T10:00:00Z'
    },
    {
      id: 'APT-002',
      customerName: 'Bob Martinez',
      customerPhone: '+1-555-0202',
      service: 'Pick-up',
      status: 'pending',
      date: '2024-06-21',
      time: '14:30',
      duration: 15,
      notes: 'Apartment complex - Unit 205',
      createdAt: '2024-06-20T11:30:00Z'
    },
    {
      id: 'APT-003',
      customerName: 'Carol Davis',
      customerPhone: '+1-555-0203',
      service: 'Consultation',
      status: 'completed',
      date: '2024-06-20',
      time: '11:00',
      duration: 45,
      notes: 'Discussed dry cleaning options for wedding dress',
      createdAt: '2024-06-19T15:20:00Z',
      completedAt: '2024-06-20T11:45:00Z'
    },
    {
      id: 'APT-004',
      customerName: 'David Lee',
      customerPhone: '+1-555-0204',
      service: 'Drop-off',
      status: 'confirmed',
      date: '2024-06-22',
      time: '16:00',
      duration: 20,
      notes: 'Business shirts - starch requested',
      createdAt: '2024-06-20T13:45:00Z'
    },
    {
      id: 'APT-005',
      customerName: 'Emma Wilson',
      customerPhone: '+1-555-0205',
      service: 'Pick-up',
      status: 'cancelled',
      date: '2024-06-21',
      time: '10:30',
      duration: 15,
      notes: 'Customer requested cancellation',
      createdAt: '2024-06-20T08:30:00Z',
      cancelledAt: '2024-06-20T12:00:00Z'
    }
  ];

  const [newAppointment, setNewAppointment] = useState({
    customerName: '',
    customerPhone: '',
    service: 'Drop-off',
    date: '',
    time: '',
    duration: 30,
    notes: ''
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setAppointments(mockAppointments);
        setIsLoading(false);
      }, 1000);
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    let matchesFilters = true;

    if (filters.status !== 'all') {
      matchesFilters = matchesFilters && appointment.status === filters.status;
    }

    if (filters.service !== 'all') {
      matchesFilters = matchesFilters && appointment.service === filters.service;
    }

    if (filters.date) {
      matchesFilters = matchesFilters && appointment.date === filters.date;
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      matchesFilters = matchesFilters && (
        appointment.customerName.toLowerCase().includes(searchLower) ||
        appointment.customerPhone.includes(filters.search) ||
        appointment.id.toLowerCase().includes(searchLower)
      );
    }

    return matchesFilters;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const handleStatusUpdate = (appointmentId, newStatus) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { 
              ...appointment, 
              status: newStatus,
              updatedAt: new Date().toISOString(),
              ...(newStatus === 'completed' && { completedAt: new Date().toISOString() }),
              ...(newStatus === 'cancelled' && { cancelledAt: new Date().toISOString() })
            }
          : appointment
      )
    );
  };

  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
    }
  };

  const handleNewAppointmentSubmit = (e) => {
    e.preventDefault();
    const appointmentId = `APT-${String(appointments.length + 1).padStart(3, '0')}`;
    
    const newAppt = {
      ...newAppointment,
      id: appointmentId,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [...prev, newAppt]);
    setNewAppointment({
      customerName: '',
      customerPhone: '',
      service: 'Drop-off',
      date: '',
      time: '',
      duration: 30,
      notes: ''
    });
    setShowNewAppointmentModal(false);
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === today && apt.status !== 'cancelled').length;
  };

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => 
      apt.date >= today && apt.status === 'confirmed'
    ).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        title="Appointments Management" 
        userRole="admin"
        userName="Admin User"
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments Management</h1>
              <p className="text-gray-600">Schedule and manage customer appointments</p>
            </div>
            <button
              onClick={() => setShowNewAppointmentModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              New Appointment
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-700">Today's Appointments</h3>
              <p className="text-3xl font-bold text-blue-600">{getTodayAppointments()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-700">Upcoming</h3>
              <p className="text-3xl font-bold text-green-600">{getUpcomingAppointments()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-700">Total This Month</h3>
              <p className="text-3xl font-bold text-purple-600">{appointments.length}</p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => s