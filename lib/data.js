// Mock data for the laundry app
export const mockOrders = [
    { id: 'LD001', customer: 'John Doe', phone: '+1234567890', weight: '5kg', status: 'pending', eta: '2024-06-19T10:00:00Z', total: 45.00 },
    { id: 'LD002', customer: 'Jane Smith', phone: '+1234567891', weight: '3kg', status: 'in_wash', eta: '2024-06-19T14:00:00Z', total: 35.00 },
    { id: 'LD003', customer: 'Bob Wilson', phone: '+1234567892', weight: '7kg', status: 'ready', eta: '2024-06-19T16:00:00Z', total: 65.00 },
    { id: 'LD004', customer: 'Alice Johnson', phone: '+1234567893', weight: '4kg', status: 'delivered', eta: '2024-06-18T18:00:00Z', total: 40.00 }
];

export const mockAppointments = [
    { id: 'AP001', customer: 'Mike Brown', phone: '+1234567894', date: '2024-06-20T10:00:00Z', service: 'Wash & Fold', notes: 'Has delicate items', status: 'pending' },
    { id: 'AP002', customer: 'Sarah Wilson', phone: '+1234567895', date: '2024-06-20T14:00:00Z', service: 'Dry Clean', notes: 'Urgent - needed by Friday', status: 'approved' },
    { id: 'AP003', customer: 'David Lee', phone: '+1234567896', date: '2024-06-21T11:00:00Z', service: 'Wash & Iron', notes: 'Large blanket included', status: 'rejected', rejectionReason: 'Fully booked at this time' }
];

// Service types
export const serviceTypes = [
    'Wash & Fold',
    'Dry Clean',
    'Wash & Iron',
    'Express Service'
];

// Order statuses
export const orderStatuses = [
    { key: 'pending', label: 'Pending' },
    { key: 'in_wash', label: 'In Wash' },
    { key: 'ready', label: 'Ready' },
    { key: 'delivered', label: 'Delivered' }
];

// Appointment statuses
export const appointmentStatuses = [
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' }
];