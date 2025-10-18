import { connectDB } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models';
import { authMiddleware, requireApproval } from '@/lib/auth/middleware';

// GET - Fetch single order
export async function GET(request, { params }) {
  try {
    await connectDB();

    // Check authentication
    const auth = await authMiddleware(request);
    if (auth.error) {
      return Response.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { id } = params;

    const order = await Order.findById(id)
      .populate('customerId', 'firstName lastName email phone')
      .populate('staffId', 'firstName lastName email');

    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Check authorization - customer can only see their own orders
    if (auth.user.role === 'customer' && order.customerId._id.toString() !== auth.user.id) {
      return Response.json({ success: false, message: 'Access denied' }, { status: 403 });
    }

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

    // Format order for consistency
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
      eta: order.deliveryDate,
      pickupDate: order.pickupDate,
      serviceType: order.serviceType,
      service: order.serviceType,
      weight: order.weight,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      user: order.customerId,
    };

    return Response.json(
      {
        success: true,
        order: formattedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch order error:', error);
    return Response.json(
      { success: false, message: 'Failed to fetch order', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update order
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    // Check authentication
    const auth = await authMiddleware(request);
    if (auth.error) {
      return Response.json({ success: false, message: auth.error }, { status: auth.status });
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
    const updates = await request.json();

    // Find order
    const order = await Order.findById(id);
    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Check authorization
    if (auth.user.role === 'customer' && order.customerId.toString() !== auth.user.id) {
      return Response.json({ success: false, message: 'Access denied' }, { status: 403 });
    }

    // Admin/Staff can update most fields
    // Customer can only update certain fields before order is confirmed
    if (auth.user.role === 'customer') {
      if (order.status !== 'pending') {
        return Response.json(
          { success: false, message: 'Cannot update order after confirmation' },
          { status: 400 }
        );
      }
      // Only allow updating specific fields
      const allowedFields = ['description', 'items', 'pickupAddress', 'deliveryAddress'];
      Object.keys(updates).forEach((key) => {
        if (allowedFields.includes(key)) {
          order[key] = updates[key];
        }
      });
    } else {
      // Admin/Staff can update all fields
      Object.assign(order, updates);
    }

    await order.save();

    return Response.json(
      {
        success: true,
        message: 'Order updated successfully',
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update order error:', error);
    return Response.json(
      { success: false, message: 'Failed to update order', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Check authentication
    const auth = await authMiddleware(request);
    if (auth.error) {
      return Response.json({ success: false, message: auth.error }, { status: auth.status });
    }

    // Only admin can delete orders
    if (auth.user.role !== 'admin') {
      return Response.json(
        { success: false, message: 'Only admins can delete orders' },
        { status: 403 }
      );
    }

    const { id } = params;

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return Response.json(
      {
        success: true,
        message: 'Order deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete order error:', error);
    return Response.json(
      { success: false, message: 'Failed to delete order', error: error.message },
      { status: 500 }
    );
  }
}
