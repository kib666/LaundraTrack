'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Package, Truck, User, Users, DollarSign, CheckCircle,
  AlertCircle, Search, Filter, Plus, MapPin, Phone, Mail, Settings,
  Bell, Menu, X, Home, Clipboard, BarChart3, HelpCircle, Loader,
  Download, CalendarCheck, CalendarX2, CalendarDays, ChevronLeft, ChevronRight
} from 'lucide-react';

// Import components
import DashboardStats from '@/components/admin/DashboardStats';
import OrdersTable from '@/components/admin/OrdersTable';
import AppointmentsTable from '@/components/admin/AppointmentsTable';
import AppointmentCalendarView from '@/components/admin/AppointmentCalendarView';
import Modal from '@/components/common/Modal';
import AppointmentForm from '@/components/common/AppointmentForm';
import OrderForm from '@/components/admin/OrderForm';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrdersAndAppointments = async () => {
    try {
      setLoading(true);
      const [ordersRes, apptRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/appointments')
      ]);

      if (!ordersRes.ok) {
        console.error('Failed to fetch orders:', await ordersRes.text());
      }
      if (!apptRes.ok) {
        console.error('Failed to fetch appointments:', await apptRes.text());
      }

      const ordersData = ordersRes.ok ? await ordersRes.json() : [];
      const appointmentsData = apptRes.ok ? await apptRes.json() : [];
      
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setOrders([]);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndAppointments();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh the data to get the updated order
        await fetchOrdersAndAppointments();
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleAppointmentStatusUpdate = async (apptId, newStatus, rejectionReason = '') => {
    try {
      const response = await fetch(`/api/appointments/${apptId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          ...(rejectionReason && { rejectionReason })
        }),
      });

      if (response.ok) {
        // Refresh the data to get the updated appointment
        await fetchOrdersAndAppointments();
      } else {
        console.error('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleCreateOrder = async (formData) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsOrderModalOpen(false);
        await fetchOrdersAndAppointments();
      } else {
        console.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleBookAppointment = async (formData) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: formData.name,
          phone: formData.phone,
          date: formData.date,
          service: formData.service,
          notes: formData.notes,
          status: 'pending'
        }),
      });

      if (response.ok) {
        setIsAppointmentModalOpen(false);
        setAppointmentSuccess(true);
        // Refresh the data to include the new appointment
        await fetchOrdersAndAppointments();
      } else {
        console.error('Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <>
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

      <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title="Add New Order">
        <OrderForm onSubmit={handleCreateOrder} onCancel={() => setIsOrderModalOpen(false)} />
      </Modal>

      {/* Success Modal */}
      {appointmentSuccess && (
        <Modal isOpen={appointmentSuccess} onClose={() => setAppointmentSuccess(false)} title="Success">
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold mb-2">Appointment Created Successfully!</h3>
            <p className="text-gray-600 mb-4">The appointment has been added to the system.</p>
            <button
              onClick={() => setAppointmentSuccess(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
