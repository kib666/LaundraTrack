import { connectDB } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models';

// Mark this route as dynamic since it always queries the database
export const dynamic = 'force-dynamic';

// GET - Lookup orders by phone number
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const query = searchParams.get('q');

    if (!type || !query) {
      return Response.json({ error: 'Missing search parameters' }, { status: 400 });
    }

    let filter = {};

    if (type === 'phone') {
      // Search by phone number in customer data
      filter = { 'customerId.phoneNumber': query };
    } else if (type === 'orderId') {
      filter = { _id: query };
    }

    // Try to find orders matching the filter
    let orders = await Order.find(filter)
      .populate('customerId', 'firstName lastName email phone phoneNumber')
      .populate('staffId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    // If no results with populated filter, try searching in nested fields
    if (orders.length === 0 && type === 'phone') {
      // Search all orders and filter in application
      const allOrders = await Order.find()
        .populate('customerId', 'firstName lastName email phone phoneNumber')
        .populate('staffId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      orders = allOrders.filter((order) => {
        const customer = order.customerId;
        if (!customer) return false;

        const phoneField = customer.phoneNumber || customer.phone;
        if (!phoneField) return false;

        // Clean phone numbers for comparison
        const cleanQuery = query.replace(/\D/g, '');
        const cleanPhone = phoneField.replace(/\D/g, '');

        return cleanPhone.includes(cleanQuery) || cleanQuery.includes(cleanPhone);
      });
    }

    if (orders.length === 0) {
      return Response.json({ error: 'No orders found' }, { status: 404 });
    }

    // Helper function to normalize status to uppercase for UI/StatusProgressTracker
    const normalizeStatus = (status) => {
      const statusMap = {
        pending: 'PENDING',
        confirmed: 'PENDING',
        in_progress: 'IN_PROGRESS',
        ready_for_pickup: 'COMPLETED',
        picked_up: 'COMPLETED',
        delivered: 'DELIVERED',
        cancelled: 'CANCELLED',
      };
      return statusMap[status] || status.toUpperCase();
    };

    // Format response for consistency
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      id: order._id,
      trackingNumber: order.trackingNumber,
      customerId: order.customerId,
      staffId: order.staffId,
      status: normalizeStatus(order.status),
      dbStatus: order.status,
      items: order.items,
      totalAmount: order.totalAmount,
      total: order.totalAmount, // alias for compatibility
      pickupAddress: order.pickupAddress,
      deliveryAddress: order.deliveryAddress,
      deliveryDate: order.deliveryDate,
      eta: order.deliveryDate, // alias for compatibility
      pickupDate: order.pickupDate,
      serviceType: order.serviceType,
      service: order.serviceType, // alias for compatibility
      weight: order.weight,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      user: order.customerId,
    }));

    // If single order, return as object for backward compatibility
    if (formattedOrders.length === 1) {
      return Response.json(formattedOrders[0], { status: 200 });
    }

    // Return array for multiple orders
    return Response.json(formattedOrders, { status: 200 });
  } catch (error) {
    console.error('Order lookup error:', error);
    return Response.json({ error: 'Failed to lookup order' }, { status: 500 });
  }
}
