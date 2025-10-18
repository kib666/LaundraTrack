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
      .populate('customerId', 'firstName lastName email phone phoneNumber')
      .populate('staffId', 'firstName lastName email');

    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Check authorization - customer can only see their own orders
    if (
      auth.user.role === 'customer' &&
      order.customerId._id.toString() !== auth.user.id.toString()
    ) {
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

    const { id } = params;
    const updates = await request.json();

    const order = await Order.findById(id);
    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (auth.user.role === 'customer') {
      // Check if order has a customerId and it matches the authenticated user
      if (!order.customerId) {
        return Response.json(
          {
            success: false,
            message: 'This order does not have a customer assigned. Please contact support.',
          },
          { status: 403 }
        );
      }

      if (order.customerId.toString() !== auth.user.id.toString()) {
        console.error('Access denied - customer mismatch:', {
          auth_user_id: auth.user.id?.toString(),
          order_customerId: order.customerId?.toString(),
        });
        return Response.json(
          { success: false, message: 'Access denied - not your order' },
          { status: 403 }
        );
      }
    }

    // Check approval only for non-customer users (staff/admin)
    if (auth.user.role !== 'customer') {
      const approval = requireApproval(auth.user);
      if (approval.error) {
        return Response.json(
          { success: false, message: approval.error },
          { status: approval.status }
        );
      }
    }

    if (auth.user.role === 'customer') {
      // Allow customers to change fulfillment type for pending, in_progress, and ready_for_pickup orders
      // Cannot change if order is delivered or cancelled
      const allowedStatusesForUpdate = ['pending', 'in_progress', 'ready_for_pickup'];
      if (!allowedStatusesForUpdate.includes(order.status)) {
        return Response.json(
          {
            success: false,
            message: 'Cannot update order after it has been delivered or cancelled',
          },
          { status: 400 }
        );
      }

      const { fulfillmentType, deliveryAddress, pickupAddress, preferredDate } = updates;

      if (fulfillmentType && !['pickup', 'delivery'].includes(fulfillmentType)) {
        return Response.json(
          { success: false, message: 'Invalid fulfillment type' },
          { status: 400 }
        );
      }

      if (fulfillmentType) {
        order.fulfillmentType = fulfillmentType;
      }

      if (fulfillmentType === 'delivery' && !deliveryAddress) {
        return Response.json(
          { success: false, message: 'Delivery address is required when switching to delivery' },
          { status: 400 }
        );
      }

      if (fulfillmentType === 'pickup') {
        order.deliveryAddress = null;
        order.pickupAddress = pickupAddress?.trim() || 'Customer Drop-off';
      }

      if (deliveryAddress && (fulfillmentType || order.fulfillmentType) === 'delivery') {
        order.deliveryAddress = deliveryAddress.trim();
      }

      if (preferredDate) {
        const parsedPreferredDate = new Date(preferredDate);
        if (Number.isNaN(parsedPreferredDate.getTime())) {
          return Response.json(
            { success: false, message: 'Invalid preferred date' },
            { status: 400 }
          );
        }
        order.preferredDate = parsedPreferredDate;
        // Update pickup/delivery dates based on fulfillment type
        if (fulfillmentType === 'pickup') {
          order.pickupDate = parsedPreferredDate;
          order.deliveryDate = null;
        } else if (fulfillmentType === 'delivery') {
          order.deliveryDate = parsedPreferredDate;
          order.pickupDate = null;
        }
      } else if (fulfillmentType && preferredDate === undefined) {
        // If fulfillment type changed but no new preferred date provided, use existing one
        if (order.preferredDate) {
          const existingDate = new Date(order.preferredDate);
          if (fulfillmentType === 'pickup') {
            order.pickupDate = existingDate;
            order.deliveryDate = null;
          } else if (fulfillmentType === 'delivery') {
            order.deliveryDate = existingDate;
            order.pickupDate = null;
          }
        }
      }
    } else {
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
