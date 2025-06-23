'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Loader } from 'lucide-react';
import AppointmentsTable from '@/components/admin/AppointmentsTable';
import AppointmentCalendarView from '@/components/admin/AppointmentCalendarView';
import Modal from '@/components/common/Modal';
import AppointmentForm from '@/components/common/AppointmentForm';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/appointments');
      
      if (!response.ok) {
        console.error('Failed to fetch appointments:', await response.text());
        setAppointments([]);
        return;
      }
      
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('An error occurred while fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
        await fetchAppointments();
      } else {
        console.error('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
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
        setIsModalOpen(false);
        await fetchAppointments();
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
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar className="mr-2" /> Appointments
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
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
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book Appointment">
        <AppointmentForm onSubmit={handleBookAppointment} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
} 