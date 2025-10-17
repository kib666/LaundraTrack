import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models';
import { authMiddleware, requireRole } from '@/lib/auth/middleware';

// PATCH - Approve user (admin only)
export async function PATCH(request, { params }) {
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

    const { id } = params;
    const { action } = await request.json(); // 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return Response.json(
        { success: false, message: 'Invalid action. Use "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Only approve pending users
    if (user.status !== 'pending') {
      return Response.json(
        { success: false, message: 'Only pending users can be approved or rejected' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      user.status = 'active';
      user.approvedBy = auth.user.id;
      user.approvedAt = new Date();
      await user.save();

      return Response.json(
        {
          success: true,
          message: `${user.firstName} ${user.lastName} has been approved as ${user.role}`,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
          },
        },
        { status: 200 }
      );
    } else {
      // Reject
      const { reason } = await request.json();
      user.status = 'rejected';
      user.rejectionReason = reason || 'Rejected by admin';
      await user.save();

      return Response.json(
        {
          success: true,
          message: `${user.firstName} ${user.lastName} has been rejected`,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Approve user error:', error);
    return Response.json(
      { success: false, message: 'Failed to process request', error: error.message },
      { status: 500 }
    );
  }
}