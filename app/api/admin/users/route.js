import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models';
import { authMiddleware, requireRole } from '@/lib/auth/middleware';

// GET - Fetch users (admin only)
export async function GET(request) {
  try {
    await connectDB();

    // Check authentication
    const auth = await authMiddleware(request);
    if (auth.error) {
      return Response.json({ success: false, message: auth.error }, { status: auth.status });
    }

    // Check authorization
    const roleCheck = requireRole('admin')(auth.user);
    if (roleCheck.error) {
      return Response.json(
        { success: false, message: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // 'staff', 'customer', 'admin'
    const status = searchParams.get('status'); // 'pending', 'active', 'approved', 'rejected'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    // Fetch users with pagination
    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password');

    const total = await User.countDocuments(filter);

    return Response.json(
      {
        success: true,
        users,
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
    console.error('Fetch users error:', error);
    return Response.json(
      { success: false, message: 'Failed to fetch users', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create user (admin only)
export async function POST(request) {
  try {
    await connectDB();

    // Check authentication
    const auth = await authMiddleware(request);
    if (auth.error) {
      return Response.json({ success: false, message: auth.error }, { status: auth.status });
    }

    // Check authorization
    const roleCheck = requireRole('admin')(auth.user);
    if (roleCheck.error) {
      return Response.json(
        { success: false, message: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    const { firstName, lastName, email, phone, password, role } = await request.json();

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !role) {
      return Response.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ success: false, message: 'Email already exists' }, { status: 400 });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: role.toLowerCase(),
      status: role.toLowerCase() === 'staff' ? 'pending' : 'active',
      isActive: true,
    });

    await user.save();

    return Response.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    return Response.json(
      { success: false, message: 'Failed to create user', error: error.message },
      { status: 500 }
    );
  }
}
