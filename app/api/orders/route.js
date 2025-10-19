import { connectDB } from '@/lib/db/mongodb';
import { Order } from '@/lib/db/models';
import { authMiddleware, requireApproval } from '@/lib/auth/middleware';
import { v4 as uuidv4 } from 'uuid';

// GET - Fetch orders
export async function GET(request) {
  try {
    await connectDB();

    // Check authentication
    const auth = await authMiddleware(request);
    if (auth.error) {
      return Response.json({ success: false, message: auth.error }, { status: auth.status });
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    // Build filter based on user role
    const filter = {};
    if (auth.user.role === 'customer') {
      filter.customerId = auth.user.id;
    }
    if (status) filter.status = status;

    // Only staff/admin hide deleted orders - customers see all orders including deleted ones
    // This way customers can see when their order was deleted
    if (auth.user.role !== 'customer' && !includeDeleted) {
      filter.isDeleted = false;
    }

    // Fetch orders with pagination
    const orders = await Order.find(filter)
      .populate('customerId', 'firstName lastName email phone')
      .populate('staffId', 'firstName lastName email')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    // Helper function to normalize status to uppercase for UI
    const normalizeStatus = (status, isDeleted) => {
      if (isDeleted) return 'DELETED';
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
      status: normalizeStatus(order.status, order.isDeleted),
      dbStatus: order.status,
      isDeleted: order.isDeleted,
      deletedAt: order.deletedAt,
      deletedBy: order.deletedBy,
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
    }));

    return Response.json(
      {
        success: true,
        orders: formattedOrders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch orders error:', error);
    return Response.json(
      { success: false, message: 'Failed to fetch orders', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create order
export async function POST(request) {
  try {
    await connectDB();

    // Check authentication
    const auth = await authMiddleware(request);
    if (auth.error) {
      return Response.json({ success: false, message: auth.error }, { status: auth.status });
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

    const requestData = await request.json();
    console.log('Order creation request data:', requestData);

    const {
      items,
      totalAmount,
      description,
      pickupAddress,
      deliveryAddress,
      preferredDate,
      preferredTime,
      fulfillmentType = 'pickup',
      weight,
      serviceType,
      inclusions,
      notes,
    } = requestData;

    if (
      !items ||
      !items.length ||
      !totalAmount ||
      !serviceType ||
      !preferredDate ||
      typeof weight === 'undefined'
    ) {
      const missingFields = [];
      if (!items || !items.length) missingFields.push('items');
      if (!totalAmount) missingFields.push('totalAmount');
      if (!serviceType) missingFields.push('serviceType');
      if (!preferredDate) missingFields.push('preferredDate');
      if (typeof weight === 'undefined') missingFields.push('weight');

      console.error('Missing required fields:', missingFields);
      return Response.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`,
          receivedData: { items, totalAmount, serviceType, preferredDate, weight },
        },
        { status: 400 }
      );
    }

    if (totalAmount <= 0 || Number.isNaN(Number(weight)) || Number(weight) <= 0) {
      return Response.json(
        { success: false, message: 'Invalid weight or total amount' },
        { status: 400 }
      );
    }

    if (fulfillmentType === 'delivery' && !deliveryAddress) {
      return Response.json(
        { success: false, message: 'Delivery address is required for delivery orders' },
        { status: 400 }
      );
    }

    const normalizedPreferredDate = preferredDate ? new Date(preferredDate) : null;
    if (!normalizedPreferredDate || Number.isNaN(normalizedPreferredDate.getTime())) {
      return Response.json(
        { success: false, message: 'Preferred date is invalid' },
        { status: 400 }
      );
    }

    const trackingNumber = `ORD-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const order = new Order({
      trackingNumber,
      customerId: auth.user.id,
      items,
      totalAmount,
      description,
      notes,
      pickupAddress:
        fulfillmentType === 'delivery'
          ? pickupAddress?.trim() || null
          : pickupAddress?.trim() || 'Customer Drop-off',
      deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress?.trim() : null,
      preferredDate: normalizedPreferredDate,
      preferredTime,
      pickupDate: fulfillmentType === 'pickup' ? normalizedPreferredDate : null,
      deliveryDate: fulfillmentType === 'delivery' ? normalizedPreferredDate : null,
      fulfillmentType,
      weight,
      serviceType: serviceType || 'wash',
      status: 'pending',
      paymentStatus: 'pending',
      inclusions: inclusions || {
        liquidDetergent: 0,
        downy: 0,
        plastic: 0,
      },
    });

    await order.save();

    return Response.json(
      {
        success: true,
        message: 'Order created successfully',
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return Response.json(
      { success: false, message: 'Failed to create order', error: error.message },
      { status: 500 }
    );
  }
}
