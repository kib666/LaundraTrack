import { connectDB } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models';
import { authMiddleware } from '@/lib/auth/middleware';

// PATCH - Edit order details (customers can edit pending orders)
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    // Check authentication
    const auth = await authMiddleware(request);
    if (auth.error) {
      return Response.json({ success: false, message: auth.error }, { status: auth.status });
    }

    // Only customers can use this endpoint
    if (auth.user.role !== 'customer') {
      return Response.json(
        { success: false, message: 'Only customers can edit order details' },
        { status: 403 }
      );
    }

    const { id } = params;
    const updates = await request.json();

    const order = await Order.findById(id);
    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Verify order belongs to customer
    if (order.customerId.toString() !== auth.user.id.toString()) {
      return Response.json(
        { success: false, message: 'Access denied - not your order' },
        { status: 403 }
      );
    }

    // Only allow editing pending or confirmed orders
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return Response.json(
        { success: false, message: 'Can only edit pending orders' },
        { status: 400 }
      );
    }

    // Allowed fields to edit
    const allowedFields = [
      'serviceType',
      'weight',
      'preferredDate',
      'fulfillmentType',
      'pickupAddress',
      'deliveryAddress',
    ];
    let hasUpdates = false;

    for (const field of allowedFields) {
      if (field in updates) {
        if (field === 'preferredDate') {
          const parsedDate = new Date(updates[field]);
          if (Number.isNaN(parsedDate.getTime())) {
            return Response.json(
              { success: false, message: 'Invalid preferred date' },
              { status: 400 }
            );
          }
          order.preferredDate = parsedDate;
          // Update pickup/delivery dates based on fulfillment type
          if (order.fulfillmentType === 'pickup') {
            order.pickupDate = parsedDate;
          } else {
            order.deliveryDate = parsedDate;
          }
          hasUpdates = true;
        } else if (field === 'fulfillmentType') {
          if (!['pickup', 'delivery'].includes(updates[field])) {
            return Response.json(
              { success: false, message: 'Invalid fulfillment type' },
              { status: 400 }
            );
          }
          order.fulfillmentType = updates[field];
          hasUpdates = true;

          // Clear conflicting addresses
          if (updates[field] === 'pickup') {
            order.deliveryAddress = null;
            order.pickupAddress = updates.pickupAddress?.trim() || 'Customer Drop-off';
          } else {
            if (!updates.deliveryAddress) {
              return Response.json(
                { success: false, message: 'Delivery address is required for delivery orders' },
                { status: 400 }
              );
            }
            order.deliveryAddress = updates.deliveryAddress.trim();
          }
        } else if (field === 'pickupAddress' && order.fulfillmentType === 'pickup') {
          order.pickupAddress = updates[field]?.trim() || 'Customer Drop-off';
          hasUpdates = true;
        } else if (field === 'deliveryAddress' && order.fulfillmentType === 'delivery') {
          if (!updates[field]) {
            return Response.json(
              { success: false, message: 'Delivery address is required' },
              { status: 400 }
            );
          }
          order.deliveryAddress = updates[field].trim();
          hasUpdates = true;
        } else if (field !== 'pickupAddress' && field !== 'deliveryAddress') {
          order[field] = updates[field];
          hasUpdates = true;
        }
      }
    }

    if (!hasUpdates) {
      return Response.json(
        { success: false, message: 'No valid updates provided' },
        { status: 400 }
      );
    }

    await order.save();

    return Response.json(
      {
        success: true,
        message: 'Order details updated successfully',
        order: order.toObject(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Edit order details error:', error);
    return Response.json(
      { success: false, message: 'Failed to edit order details', error: error.message },
      { status: 500 }
    );
  }
}
