import { connectDB } from '@/lib/db/mongodb';
import { Appointment } from '@/lib/db/models';
import { authMiddleware, requireApproval } from '@/lib/auth/middleware';

// GET - Fetch appointments
export async function GET(request) {
  try {
    await connectDB();

    // Check authentication
    const auth = await authMiddleware(request);
    if (auth.error) {
      return Response.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // pickup or delivery
    const date = searchParams.get('date');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build filter
    const filter = {};
    if (auth.user.role === 'customer') {
      filter.customerId = auth.user.id;
    }
    if (type) filter.type = type;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Fetch appointments
    const appointments = await Appointment.find(filter)
      .populate('customerId', 'firstName lastName email')
      .populate('orderId', 'trackingNumber status')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: 1 });

    const total = await Appointment.countDocuments(filter);

    return Response.json(
      {
        success: true,
        appointments,
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
    console.error('Fetch appointments error:', error);
    return Response.json(
      { success: false, message: 'Failed to fetch appointments', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create appointment
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
      return Response.json({ success: false, message: approval.error }, { status: approval.status });
    }

    const { type, date, timeSlot, notes, orderId } = await request.json();

    // Validation
    if (!type || !date || !timeSlot) {
      return Response.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['pickup', 'delivery'].includes(type)) {
      return Response.json(
        { success: false, message: 'Invalid appointment type' },
        { status: 400 }
      );
    }

    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      },
      timeSlot,
      status: 'booked',
    });

    if (existingAppointment) {
      return Response.json(
        { success: false, message: 'This time slot is already booked' },
        { status: 400 }
      );
    }

    // Create appointment
    const appointment = new Appointment({
      customerId: auth.user.id,
      type,
      date: new Date(date),
      timeSlot,
      notes,
      orderId: orderId || null,
      status: 'booked',
    });

    await appointment.save();

    return Response.json(
      {
        success: true,
        message: 'Appointment booked successfully',
        appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create appointment error:', error);
    return Response.json(
      { success: false, message: 'Failed to create appointment', error: error.message },
      { status: 500 }
    );
  }
}