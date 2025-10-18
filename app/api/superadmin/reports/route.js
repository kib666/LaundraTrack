import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models';
import Order from '@/lib/db/models';
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
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments().catch(() => 0);

    // Calculate total revenue
    const orders = await Order.find().catch(() => []);
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    // Get monthly stats (last 6 months)
    const monthlyStats = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const monthOrders = await Order.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      }).catch(() => 0);

      const monthOrdersData = await Order.find({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      }).catch(() => []);

      const monthRevenue = monthOrdersData.reduce(
        (sum, order) => sum + Number(order.totalAmount || 0),
        0
      );

      monthlyStats.push({
        name: monthName,
        orders: monthOrders,
        revenue: Math.round(monthRevenue * 100) / 100,
      });
    }

    return Response.json({
      totalUsers,
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      monthlyStats,
    });
  } catch (error) {
    console.error('Reports error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
