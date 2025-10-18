import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models';
import { authMiddleware, requireRole } from '@/lib/auth/middleware';

export async function GET(request) {
  try {
    // Apply auth middleware
    const authResult = await authMiddleware(request);
    if (!authResult.user) {
      return Response.json(
        { error: authResult.error || 'Unauthorized' },
        { status: authResult.status || 401 }
      );
    }

    // Check if user is superadmin
    const roleCheck = requireRole('superadmin');
    const roleCheckResult = roleCheck(authResult.user);
    if (roleCheckResult.error) {
      return Response.json({ error: roleCheckResult.error }, { status: 403 });
    }

    await connectDB();

    // Get statistics
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Get recent admins
    const admins = await User.find({ role: 'admin' })
      .select('firstName lastName email phone createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    return Response.json({
      totalAdmins,
      totalStaff,
      totalCustomers,
      admins,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
