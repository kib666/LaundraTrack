import { connectDB } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models';
import { authMiddleware, requireApproval } from '@/lib/auth/middleware';

// POST - Undo order cancellation
export async function POST(request, { params }) {
  try {
    await connectDB();

    // Check authentication
    const auth = await authMiddleware(request);
    if (auth.error) {
      return Response.json({ success: false, message: auth.error }, { status: auth.status });
    }

    // Check approval for staff/admin
    if (auth.user.role !== 'customer') {
      const approval = requireApproval(auth.user);
      if (approval.error) {
        return Response.json(
          { success: false, message: approval.error },
          { status: approval.status }
        );
      }
    }

    const { id } = params;

    const order = await Order.findById(id).populate('customerId').populate('staffId');
    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Verify authorization
    if (auth.user.role === 'customer') {
      if (order.customerId._id.toString() !== auth.user.id.toString()) {
        return Response.json(
          { success: false, message: 'Access denied - not your order' },
          { status: 403 }
        );
      }
    }

    // Check if order is cancelled
    if (order.status !== 'cancelled') {
      return Response.json({ success: false, message: 'Order is not cancelled' }, { status: 400 });
    }

    // Get the previous status from history
    let previousStatus = 'pending';
    if (order.statusHistory && order.statusHistory.length > 0) {
      // Find the status before it was cancelled
      for (let i = order.statusHistory.length - 1; i >= 0; i--) {
        if (order.statusHistory[i].status !== 'cancelled') {
          previousStatus = order.statusHistory[i].status;
          break;
        }
      }
    }

    // Restore to previous status
    order.status = previousStatus;
    order.cancelledAt = null;
    order.cancelledBy = null;
    order.cancelReason = null;

    // Add to status history
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    order.statusHistory.push({
      status: previousStatus,
      changedAt: new Date(),
      changedBy: auth.user.id,
      notes: `Order restored from cancellation by ${auth.user.role}`,
    });

    await order.save();

    return Response.json(
      {
        success: true,
        message: 'Order cancellation undone successfully',
        order: order.toObject(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Undo cancel error:', error);
    return Response.json(
      { success: false, message: 'Failed to undo cancellation', error: error.message },
      { status: 500 }
    );
  }
}
