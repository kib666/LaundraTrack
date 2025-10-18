import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models';
import { authMiddleware, requireRole } from '@/lib/auth/middleware';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function PATCH(request, { params }) {
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

    const { id } = params;
    const { firstName, lastName, email, phone, password } = await request.json();

    if (!firstName || !lastName || !email) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Find the admin
    const admin = await User.findById(id);
    if (!admin) {
      return Response.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Check if new email already exists (if changing email)
    if (email !== admin.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return Response.json({ error: 'Email already exists' }, { status: 400 });
      }
    }

    // Update fields
    admin.firstName = firstName;
    admin.lastName = lastName;
    admin.email = email;
    if (phone) {
      admin.phone = phone;
    }

    // Update password only if provided
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();

    const adminData = admin.toObject();
    delete adminData.password;

    return Response.json({ message: 'Admin updated successfully', admin: adminData });
  } catch (error) {
    console.error('Update admin error:', error.message, error);
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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

    const { id } = params;

    await connectDB();

    // Find and delete the admin
    const admin = await User.findByIdAndDelete(id);
    if (!admin) {
      return Response.json({ error: 'Admin not found' }, { status: 404 });
    }

    return Response.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error.message, error);
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
