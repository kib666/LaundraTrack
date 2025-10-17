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
      return Response.json({ success: false, message: roleCheck.error }, { status: roleCheck.status });
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