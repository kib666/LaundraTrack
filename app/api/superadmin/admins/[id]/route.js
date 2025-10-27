import { User } from '@/lib/db/models';
import { connectDB } from '@/lib/db/mongodb';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Middleware to verify super admin token
async function verifySuperAdmin(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid authorization header' };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

    if (decoded.role !== 'superadmin') {
      return { valid: false, error: 'Insufficient permissions' };
    }

    return { valid: true, userId: decoded.userId };
  } catch (error) {
    console.error('Super admin token verification failed:', error);
    return { valid: false, error: 'Invalid or expired token' };
  }
}

// PATCH update admin
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    // Verify super admin
    const auth = await verifySuperAdmin(request);
    if (!auth.valid) {
      return Response.json({ message: auth.error }, { status: 401 });
    }

    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ message: 'Invalid admin ID' }, { status: 400 });
    }

    const { firstName, lastName, email, password } = await request.json();

    // Build update object
    const updateData = {};

    if (firstName !== undefined) {
      updateData.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      updateData.lastName = lastName.trim();
    }

    if (email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });

      if (existingUser) {
        return Response.json({ message: 'Email already exists' }, { status: 409 });
      }

      updateData.email = email.toLowerCase().trim();
    }

    if (password !== undefined) {
      if (password.length < 6) {
        return Response.json(
          { message: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      updateData.password = password;
    }

    const admin = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!admin) {
      return Response.json({ message: 'Admin not found' }, { status: 404 });
    }

    const adminData = admin.toJSON();
    adminData.id = admin._id;

    return Response.json({
      success: true,
      message: 'Admin updated successfully',
      admin: adminData,
    });
  } catch (updateError) {
    console.error('Error updating admin:', updateError);
    return Response.json({ message: 'An error occurred while updating admin' }, { status: 500 });
  }
}

// DELETE admin
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Verify super admin
    const auth = await verifySuperAdmin(request);
    if (!auth.valid) {
      return Response.json({ message: auth.error }, { status: 401 });
    }

    const { id } = params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ message: 'Invalid admin ID' }, { status: 400 });
    }

    const admin = await User.findByIdAndDelete(id);

    if (!admin) {
      return Response.json({ message: 'Admin not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (deleteError) {
    console.error('Error deleting admin:', deleteError);
    return Response.json({ message: 'An error occurred while deleting admin' }, { status: 500 });
  }
}
