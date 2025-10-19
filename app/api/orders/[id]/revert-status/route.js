import { connectDB } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models';
import { authMiddleware, requireApproval } from '@/lib/auth/middleware';

// POST - Revert order status to previous state
export async function POST(request, { params }) {
  try {
    await connectDB();

    // Check authentication
    const auth = await authMiddleware(request);
    if (auth.error) {
      return Response.json({ success: false, message: auth.error }, { status: auth.status });
    }

    // Only staff/admin can revert status
    if (auth.user.role !== 'staff' && auth.user.role !== 'admin') {
      return Response.json(
        { success: false, message: 'Only staff and admins can revert order status' },
        { status: 403 }
      );
    }

    // Check approval
    const approval = requireApproval(auth.user);
    if (approval.error) {
      return Response.json(
        { success: false, message: approval.error },
        { status: approval.status }
      );
    }

    const { id } = params;

    const order = await Order.findById(id).populate('customerId').populate('staffId');
    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Cannot revert cancelled or pending orders
    if (order.status === 'cancelled' || order.status === 'pending') {
      return Response.json(
        { success: false, message: 'Cannot revert this order status' },
        { status: 400 }
      );
    }

    // Determine fulfillment type (default to pickup if not specified)
    const isDelivery = (order.fulfillmentType || 'pickup') === 'delivery';

    // Define status progression based on fulfillment type
    const statusProgression = isDelivery
      ? ['pending', 'confirmed', 'in_progress', 'ready_for_pickup', 'picked_up', 'delivered']
      : ['pending', 'confirmed', 'in_progress', 'ready_for_pickup', 'delivered'];

    const currentIndex = statusProgression.indexOf(order.status);
    if (currentIndex <= 0) {
      return Response.json({ success: false, message: 'Cannot revert further' }, { status: 400 });
    }

    // Go back one step
    const previousStatus = statusProgression[currentIndex - 1];

    // Store current status before updating
    const currentStatus = order.status;

    // Update order
    order.status = previousStatus;

    // Add to status history
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    order.statusHistory.push({
      status: previousStatus,
      changedAt: new Date(),
      changedBy: auth.user.id,
      notes: `Reverted from ${currentStatus} by ${auth.user.role}`,
    });

    await order.save();

    // Helper function to normalize status to uppercase for UI
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

    // Format the returned order to match the frontend expectations
    const formattedOrder = {
      _id: order._id,
      id: order._id,
      trackingNumber: order.trackingNumber,
      customerId: order.customerId,
      staffId: order.staffId,
      status: normalizeStatus(order.status),
      dbStatus: order.status,
      items: order.items,
      totalAmount: order.totalAmount,
      total: order.totalAmount,
      pickupAddress: order.pickupAddress,
      deliveryAddress: order.deliveryAddress,
      deliveryDate: order.deliveryDate,
      pickupDate: order.pickupDate,
      preferredDate: order.preferredDate,
      serviceType: order.serviceType,
      fulfillmentType: order.fulfillmentType || 'pickup',
      weight: order.weight,
      preferredTime: order.preferredTime,
      submittedAt: order.submittedAt,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return Response.json(
      {
        success: true,
        message: `Order reverted to ${previousStatus}`,
        order: formattedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Revert status error:', error);
    return Response.json(
      { success: false, message: 'Failed to revert order status', error: error.message },
      { status: 500 }
    );
  }
}
