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

    // Check approval
    const approval = requireApproval(auth.user);
    if (approval.error) {
      return Response.json(
        { success: false, message: approval.error },
        { status: approval.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build filter based on user role
    const filter = {};
    if (auth.user.role === 'customer') {
      filter.customerId = auth.user.id;
    }
    if (status) filter.status = status;

    // Fetch orders with pagination
    const orders = await Order.find(filter)
      .populate('customerId', 'firstName lastName email phone')
      .populate('staffId', 'firstName lastName email')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

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
      total: order.totalAmount,
      pickupAddress: order.pickupAddress,
      deliveryAddress: order.deliveryAddress,
      deliveryDate: order.deliveryDate,
      pickupDate: order.pickupDate,
      serviceType: order.serviceType,
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

    // Check approval
    const approval = requireApproval(auth.user);
    if (approval.error) {
      return Response.json(
        { success: false, message: approval.error },
        { status: approval.status }
      );
    }

    const {
      items,
      totalAmount,
      description,
      pickupAddress,
      deliveryAddress,
      pickupDate,
      deliveryDate,
      serviceType,
    } = await request.json();

    // Validation
    if (!items || !totalAmount || !pickupAddress || !deliveryAddress) {
      return Response.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    if (totalAmount <= 0) {
      return Response.json({ success: false, message: 'Invalid total amount' }, { status: 400 });
    }

    // Create order
    const trackingNumber = `ORD-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const order = new Order({
      trackingNumber,
      customerId: auth.user.id,
      items,
      totalAmount,
      description,
      pickupAddress,
      deliveryAddress,
      pickupDate: pickupDate ? new Date(pickupDate) : null,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      serviceType: serviceType || 'wash',
      status: 'pending',
      paymentStatus: 'pending',
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
