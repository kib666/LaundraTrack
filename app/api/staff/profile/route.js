import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models';
import { authMiddleware, requireRole } from '@/lib/auth/middleware';

// PATCH - Update staff member's own profile
export async function PATCH(request) {
  try {
    await connectDB();

    // Check authentication
    const auth = await authMiddleware(request);
    if (auth.error) {
      return Response.json({ success: false, message: auth.error }, { status: auth.status });
    }

    // Check authorization - staff and admin can update their own profile
    const roleCheck = requireRole('staff', 'admin')(auth.user);
    if (roleCheck.error) {
      return Response.json(
        { success: false, message: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    const { firstName, lastName, email, phone } = await request.json();

    // Find the authenticated user
    const user = await User.findById(auth.user.id);
    if (!user) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    return Response.json(
      {
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return Response.json(
      { success: false, message: 'Failed to update profile', error: error.message },
      { status: 500 }
    );
  }
}
