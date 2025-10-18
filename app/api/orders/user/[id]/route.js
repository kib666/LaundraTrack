import { connectDB } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models';

// GET - Fetch orders for a specific user
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return Response.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    // Fetch orders for the user
    const orders = await Order.find({ customerId: id })
      .populate('customerId', 'firstName lastName email phone')
      .populate('staffId', 'firstName lastName email')
      .sort({ createdAt: -1 });

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

    return Response.json(formattedOrders, { status: 200 });
  } catch (error) {
    console.error('Fetch user orders error:', error);
    return Response.json(
      { success: false, message: 'Failed to fetch orders', error: error.message },
      { status: 500 }
    );
  }
}
