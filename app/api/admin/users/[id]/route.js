import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models';
import { authMiddleware, requireRole } from '@/lib/auth/middleware';

// PATCH - Update user (admin only)
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
      return Response.json(
        { success: false, message: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    const { id } = params;
    const { firstName, lastName, email, phone, password, role } = await request.json();

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = password;
    if (role) user.role = role.toLowerCase();

    await user.save();

    return Response.json(
      {
        success: true,
        message: 'User updated successfully',
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
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('Update user error:', error);
    return Response.json(
      { success: false, message: 'Failed to update user', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (admin only)
export async function DELETE(request, { params }) {
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

    const { id } = params;

    // Find and delete user
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return Response.json(
      {
        success: true,
        message: 'User deleted successfully',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return Response.json(
      { success: false, message: 'Failed to delete user', error: error.message },
      { status: 500 }
    );
  }
}
